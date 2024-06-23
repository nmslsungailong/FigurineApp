import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "./RootStackParamList";
import { io } from "socket.io-client";

export type ProfileRouteProps = RouteProp<RootStackParamList, 'Profile'>;

const socket = io('http://10.0.2.2:5000/figurinesData', {
  transports: ['websocket'],
});

type CartItem={
  orderid: any,
  product_name: any,
  price: any,
  image1: any,
  checked: boolean
}

const CartScreen = () => {

  const route = useRoute<ProfileRouteProps>();
  
  const [cartitem, setCartItems] = useState<any>([]);
  const [User, setUser] = useState<any>() 
  const [data, setData] = useState<CartItem[]>(cartitem);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCartItems = useCallback(() => {
    setRefreshing(true); // Enable the refreshing indicator
    socket.emit('get_cart_items', { userid: route.params.User.userid });

    socket.on('cart_items_response', (response) => {
      if (response.success) {
        const cartItemsWithCheck = response.cart_items.map((item: CartItem) => ({
          ...item,
          checked: false // Initialize all as unchecked
        }));
        setData(cartItemsWithCheck);
      } else {
        console.log('Error fetching cart items:', response.error);
      }
      setRefreshing(false); // Disable the refreshing indicator
    });

    // Since we only want to register this listener once, we can disable the dependency array
    // or add socket as a dependency if it is stable throughout the component's lifetime
  }, [socket, route.params.User.userid]);

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [fetchCartItems])
  );
  
  



  const handleCheckBox = ({ itemId, newValue }: any) => {
    const newData = data.map((item: CartItem) => {
      if (item.orderid === itemId) {
        return { ...item, checked: newValue };
      }
      return item;
    });
    setData(newData);
  };
  

  const renderCartItem = ({ item }:any) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: 'https:' + item.image1 }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text>{item.price}</Text>
      </View>
      <CheckBox
        value={item.checked}
        onValueChange={(newValue: boolean) => handleCheckBox({itemId: item.orderid, newValue})}
        style={styles.checkbox}
      />
    </View>
  );

  const handleCheckout = () => {
    const selectedItems = data.filter(item => item.checked).map(item => item.orderid);
    
    if (selectedItems.length === 0) {
      Alert.alert("Error", "No items selected for checkout.");
      return;
    }
    
    socket.emit('checkout', { userid: route.params.User.userid, order_ids: selectedItems });
  
    socket.once('checkout_response', (response) => {
      if (response.success) {
        // If checkout is successful, delete the items from the cart
        handleDeleteSelected(selectedItems);
        Alert.alert("Checkout Successful");
      } else {
        // If checkout is unsuccessful, alert the user
        Alert.alert("Checkout Error", response.error);
      }
    });
  };

  const handleDeleteSelected = (selectedItems:any) => {
    socket.emit('delete_cart_items', { order_ids: selectedItems });
  
    // Use `socket.once` to ensure the callback is only called once
    socket.once('delete_items_response', (response) => {
      if (response.success) {
        const newData = data.filter((item) => !selectedItems.includes(item.orderid));
        setData(newData);
      } else {
        Alert.alert("Error", "Could not delete items: " + response.error);
      }
    });
  };
  


  const totalPrice = data.reduce((sum, item) => {
    // Ensure item.price is a string and remove any non-numeric characters
    const priceString = String(item.price).replace(/[^0-9.]+/g, '');
    const itemPrice = parseFloat(priceString);
    console.log(`Price for item ${item.product_name}:`, itemPrice);
    return item.checked ? sum + itemPrice : sum;
  }, 0.0); // Initialize sum as a number
  
  console.log(`Total price: ${totalPrice}`);
  
  

  return (
    <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Icon name="cart" size={30} color="white" />
            </View>
            <Text
            style={{
                fontWeight: 'bold',
                fontSize: 25,
                color: 'black',
                marginHorizontal: 10,
                marginBottom: 5
            }}
            >Select checkout products</Text>
      <FlatList
        data={data}
        renderItem={renderCartItem}
        keyExtractor={item => item.orderid}
      />
      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSelected}>
          <Icon name="delete" size={24} color="red" />
        </TouchableOpacity>
        <Text>Total Price: </Text>
        <Text>{`¥${Number.isFinite(totalPrice) ? totalPrice.toFixed(2) : '0.00'}`}</Text>
        <TouchableOpacity 
        style={styles.checkoutButton} 
        onPress={handleCheckout}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        alignItems: 'center', // Align items vertically in the center
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    itemInfo: {
        flex: 1, // Take up all available space
        justifyContent: 'center',
        marginRight: 10, // Add space between text and the checkbox
    },
    productName: {
        fontWeight: 'bold',
        flexShrink: 1, // Allows text to shrink and wrap if needed
    },
    checkoutContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    checkoutButton: {
        fontWeight:'bold',
        backgroundColor: 'orange',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    checkoutText: {
        color: '#fff',
    },
    deleteButton: {
        // You might want to add some styling to this
        padding: 10,
      },
    checkbox: {
        alignSelf: 'center',
    },
});

export default CartScreen;
