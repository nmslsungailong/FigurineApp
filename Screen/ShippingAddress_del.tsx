import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure the icon name "ship-wheel" is available in your icon set
import { RootStackParamList } from "./RootStackParamList";
import CheckBox from "@react-native-community/checkbox";
import { io } from "socket.io-client";

export type ProfileRouteProps = RouteProp<RootStackParamList, 'Profile'>

type NavigationProp = StackNavigationProp<RootStackParamList>;

const socket = io('http://10.0.2.2:5000/figurinesData', {
  transports: ['websocket'],
});

const ShippingAddressDelete = () => {

  const route = useRoute<ProfileRouteProps>();

    const [addresses, setAddresses] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const navigation = useNavigation<NavigationProp>();
    const [User, setUser] = useState<any>();

    useEffect(() => {
      if (route.params?.User) {
          setUser(route.params.User);
          socket.emit('list_user_address', { userid: route.params.User.userid });
      }

      socket.on('user_addresses_response', (response) => {
          if (response.success) {
              setAddresses(response.addresses);
          } else {
              console.log('Error fetching addresses:', response.error);
          }
      });

      return () => {
          socket.off('user_addresses_response');
      };
  }, [route.params]);

    useEffect(() => {
      if (route.params?.User !== undefined) {
          setUser(route.params.User);
      } else {
          console.log("No user found");
      }
    }, [route.params]);

    const handleSelectAddress = (id:any) => {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(id)) {
          newSelectedIds.delete(id);
        } else {
          newSelectedIds.add(id);
        }
        setSelectedIds(newSelectedIds);
    }

    const deleteAddresses = () => {
      if (selectedIds.size === 0) {
          Alert.alert("Error", "No addresses selected for deletion.");
          return;
      }
  
      Alert.alert(
          "Delete Address",
          "Are you sure you want to delete the selected addresses?",
          [
              { text: "Cancel", style: "cancel" },
              {
                  text: "OK", onPress: () => {
                      const idsToDelete = Array.from(selectedIds);  // Convert Set to Array
                      socket.emit('delete_shipping_address_list', {
                          userid: User.userid,  // Assuming User object has a userid property
                          address_ids: idsToDelete
                      });
  
                      socket.on('delete_shipping_address_response', (response) => {
                          if (response.success) {
                              Alert.alert("Success", "Selected addresses deleted successfully.");
                              // Update the local state to reflect the deletion
                              const newAddresses = addresses.filter((address :any) => !selectedIds.has(address.shippingaddressid));
                              setAddresses(newAddresses);
                              setSelectedIds(new Set());  // Clear selections
                          } else {
                              Alert.alert("Error", response.error);
                          }
                      });
                  }
              }
          ]
      );
  };
  

    const renderAddress = ({ item }: any) => {
        const isSelected = selectedIds.has(item.id);
        return (
            <View style={styles.addressContainer}>
              <CheckBox
                value={isSelected}
                onValueChange={() => handleSelectAddress(item.shippingaddressid)}
              />

              <Text style={styles.addressText}>{`${item.address1}, ${item.address2}, ${item.address3}`}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ShipAddressEdit', { User })}>
                <Icon name="pencil" size={24} color="orange" />
              </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Icon name="ship-wheel" size={30} color="white" />
            </View>
            <Text
            style={{
                marginVertical: 20,
                fontSize: 20,
                color: 'black'
            }}
            >
                Select your preferred address:
            </Text>
            <FlatList
                data={addresses}
                renderItem={renderAddress}
                keyExtractor={(item :any) => item.shippingaddressid}
                contentContainerStyle={styles.listContent}
            />
      <Button
        title="Delete Selected"
        onPress={() => {
          Alert.alert(
            "Delete Address",
            "Are you sure you want to delete the selected addresses?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "OK", onPress: deleteAddresses }
            ]
          );
        }}
        color="red"
      />            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
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
    addressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        flex: 1
    },
    selectedAddress: {
        backgroundColor: '#e0e0e0', // A different background color to indicate selection
    },
    addressText: {
        marginRight: 5,
        paddingRight: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black'
    },
    listContent: {
        flexGrow: 1,
    }
});

export default ShippingAddressDelete;
