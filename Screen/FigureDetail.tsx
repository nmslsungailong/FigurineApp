import React, {useCallback, useEffect, useState} from "react";
import { TouchableOpacity, ScrollView, Text, View, Image, Dimensions, StyleSheet, Alert} from 'react-native';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "./RootStackParamList";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { StackNavigationProp } from "@react-navigation/stack";

export type FigureDetailRouteProps = RouteProp<RootStackParamList, 'FigureDetails'>;

type NavigationProps = StackNavigationProp<RootStackParamList>;

const screenWidth = Dimensions.get('window').width;

const socket = io('http://10.0.2.2:5000/figurinesData', {
    transports: ['websocket'],
});

const FigureDetail = () =>{
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<FigureDetailRouteProps>();
    const { item } = route.params; // Accessing the item parameter
    const [figurineid, setfigurineid] = useState<any>(item?.id)
    const [activeSlide, setActiveSlide] = useState(0);
    const [LogInStatus, setIsLoggedIn] = useState(false);
    const [User, setUser] = useState<any>();
    const [shippingID, setshippingID] = useState<any>();
    const images = [item.image1, item.image2, item.image3, item.image4].map(image => `https:${image}`);

    const renderItem = ({ item }: any) => (
        <View style={styles.slide}>
            <Image source={{ uri: item }} style={styles.image} />
        </View>
        
    );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user');
        setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
      } catch (e) {
        console.log("Error:" + e);
      }
    }

    fetchUserData();
  }, [LogInStatus, User]);

  useFocusEffect(
    useCallback(() => {
        const checkLoginStatus = async () => {
            const logInStat = await AsyncStorage.getItem('@isLoggedIn');
            if (logInStat != null) {
                setIsLoggedIn(JSON.parse(logInStat));
            } else {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, [])
);

  useEffect(() => {
    console.log("Received item:", item);
    if (item && item.id) {
        setfigurineid(item.id);
    } else {
        console.log("Item or item.id is undefined");
    }
}, [item]);


const handleAddToCart = async () => {
    const ShipValue = await AsyncStorage.getItem('@preferredAddressId');

    if (LogInStatus != true) {
        console.log(LogInStatus);
        Alert.alert("Please log in to continue");
        navigation.navigate('LogIn');
        return;
    }

    if (!ShipValue) {
        Alert.alert("Please select a shipping address first");
        return;
    }

    if (!figurineid) {
        console.error("Figurine ID is undefined at the time of adding to cart");
        Alert.alert("Error", "Item details are incomplete.");
        return;
    }

    try {
        socket.emit('add_cart', {
            userid: User.userid, 
            figurineid: figurineid, 
            shippingaddressid: ShipValue
        });

        socket.on('add_order_response', (response) => {
            if (response.success) {
                Alert.alert("Success", "Added to cart successfully!");
            } else {
                Alert.alert("Error", response.error);
            }
        });
    } catch (e) {
        console.error("Socket emission error:", e);
        Alert.alert("Error", "Could not add to cart.");
    }
};


    return (
        <View style={{flex: 1}}>
        <ScrollView style={{ 
            flex: 0.6,
            height: 20,
             }}> 
        <View style={styles.mainContainer}>
            <Carousel
                data={images}
                renderItem={renderItem}
                sliderWidth={screenWidth}
                itemWidth={screenWidth}
                onSnapToItem={(index) => setActiveSlide(index)}
                loop
            />
            <Pagination
                dotsLength={images.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.paginationContainer}
                dotStyle={styles.dotStyle}
                inactiveDotStyle={styles.inactiveDotStyle}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
            <View style={styles.HeaderBox}>
                <Text style={styles.WordHeader}>
                    Product Name:
                </Text>
                <Text style={styles.Word}>
                    {item.product_name}
                </Text>
            </View>
            <View style={styles.HeaderBox}>
                <Text style={styles.WordHeader}>
                    Product Description:
                </Text>
                <Text style={styles.Word}>
                    {item.product_description}
                </Text>
            </View>
            <View style={styles.HeaderBox}>
                <Text style={styles.WordHeader}>
                    Series:
                </Text>
                <Text style={styles.Word}>
                    {item.series}
                </Text>
            </View>
            <View style={styles.HeaderBox}>
                <Text style={styles.WordHeader}>
                    Manufacturer:
                </Text>
                <Text style={styles.Word}>
                    {item.manufacturer}
                </Text>
            </View>
            <View style={styles.HeaderBox}>
                <Text style={styles.WordHeader}>
                    Category:
                </Text>
                <Text style={styles.Word}>
                    {item.category}
                </Text>
            </View>
        </View>
            <View style={styles.HeaderBox}>
                <Text style={styles.WordHeader}>
                    Price:
                </Text>
                <Text style={styles.Word}>
                    {item.price}
                </Text>
            </View>
            <View style={styles.HeaderBox}>
                <Text style={styles.WordHeader}>
                    Specification:
                </Text>
                <Text style={styles.Word}>
                    {item.specification}
                </Text>
            </View>
            <View style={styles.HeaderBox}>
                <Text style={styles.WordHeader}>
                    Sculptor:
                </Text>
                <Text style={styles.Word}>
                    {item.sculptor}
                </Text>
            </View>
            <View style={styles.HeaderBox}>
                <Text style={styles.WordHeader}>
                    Cooperation:
                </Text>
                <Text style={styles.Word}>
                    {item.cooperation}
                </Text>
            </View>
            <View style={styles.HeaderBoxBottom}>
                <Text style={styles.WordHeader}>
                    Ratings:
                </Text>
                <Text style={styles.Word}>
                    {item.average_rating}
                </Text>
            </View>
    </ScrollView>

    <TouchableOpacity onPress={handleAddToCart} style={styles.purchaseButton}>
        <Text style={styles.purchaseButtonText}>Add To Cart</Text>
    </TouchableOpacity>

        </View>


    
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: 50,
        position: 'relative', // Adjust this value as needed to account for the header's height
    },
    slide: {
        marginTop: 30,
        marginLeft: 11,
        maxHeight: 500,
        marginBottom: 200,
        width: screenWidth-20,
        height: '100%', // Adjust the height as needed
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10, // Rounded corners for the images
    },
    paginationContainer: {
        position: 'absolute',
        bottom: '52%', // Adjust this value as needed to position the pagination just under the slider.
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: 'orange', // Active dot color
    },
    inactiveDotStyle: {
    },
    HeaderBox:{
        marginLeft: 30,
        marginBottom: 50,
        marginRight: 20,
    },
    HeaderBoxBottom:{
        marginLeft: 30,
        marginBottom: 50,
        marginRight: 20,
        paddingBottom: 100
    },
    WordHeader:{
        fontSize: 25,
        fontWeight: 'bold',
        color: 'orange',
        
    },
    Word:{
        fontSize: 20,
        color: 'black'
    },
    purchaseButtonContainer: {
        position: 'absolute', // Position it absolutely over the screen content
        bottom: 0, // At the bottom
        left: 0,
        right: 0,
        backgroundColor: 'orange', // Background color of the button
        padding: 20, // Padding inside the button for spacing
        justifyContent: 'center', // Center the text inside the button
        alignItems: 'center', // Align items in the center for horizontal alignment
    },
    purchaseButton: {
        position: 'absolute',
        bottom: 10, // Adjust this to place the button correctly at the bottom
        left: 20,
        right: 20,
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    purchaseButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default FigureDetail;