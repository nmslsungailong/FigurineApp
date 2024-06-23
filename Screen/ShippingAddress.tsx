import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure the icon name "ship-wheel" is available in your icon set
import { RootStackParamList } from "./RootStackParamList";
import { FloatingAction } from "react-native-floating-action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storePreferredAddressID } from "../Database/StorageService";
import { io } from "socket.io-client";

export type ProfileRouteProps = RouteProp<RootStackParamList, 'Profile'>

type NavigationProp = StackNavigationProp<RootStackParamList>;

const socket = io('http://10.0.2.2:5000/figurinesData', {
  transports: ['websocket'],
});

const actions = [
    {
    text : "AddShippingAddress",
    icon : require("../floatingIcon/add_icon.png"),
    name: "ShipAddressAdd",
    position: 2
    },
    {
        text : "DeleteShippingAddress",
        icon : require("../floatingIcon/delete_icon.jpg"),
        name: "ShipAddressDelete",
        position: 1
    },
];

const ShippingAddress = () => {

    const [selectedId, setSelectedId] = useState<any>();
    const navigation = useNavigation<NavigationProp>();
    const [address, setaddress] = useState<any>([])
    const [User, setUser] = useState();
    const route = useRoute<ProfileRouteProps>();
    const [lastTappedId, setLastTappedId] = useState(null);
    const [lastTap, setLastTap] = useState<any>(null);

    
    const handleDoubleTap = (item: any) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (lastTappedId === item.shippingaddressid && (now - lastTap) < DOUBLE_PRESS_DELAY) {
            navigation.navigate('ShipAddressEdit', { User: User });
        } else {
            setLastTap(now);
            setLastTappedId(item.shippingaddressid);
        }
    };

    useEffect(() => {
        if (route.params?.User) {
            setUser(route.params.User);
            socket.emit('list_user_address', { userid: route.params.User.userid });
        }else{
            Alert.alert("Error", "User data is not available.");
        }

        socket.on('user_addresses_response', (response) => {
            if (response.success) {
                setaddress(response.addresses);
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

    useEffect(() => {
        const getPreferredAddress = async () => {
            const storedAddressId = await AsyncStorage.getItem('@preferredAddressId');
            if (storedAddressId) {
                setSelectedId(storedAddressId);
            } else {
                setSelectedId(address[0].id); // Set first address as default
                const defaultShippingId  = JSON.stringify(address[0].id);
                storePreferredAddressID(defaultShippingId);  // Use the imported function
            }
        };
        getPreferredAddress();
    }, []);

    const handleSelectAddress = async (id: any) => {
        setSelectedId(id);
        const shippingid = JSON.stringify(id)
        await storePreferredAddressID(shippingid);    
    };

    const renderAddress = ({ item }: any) => {
        const isSelected = item.shippingaddressid === selectedId;
        return (
            <TouchableOpacity
                onPress={() => {
                    handleDoubleTap(item);
                    handleSelectAddress(item.shippingaddressid);
                }}
                style={[styles.addressContainer, isSelected ? styles.selectedAddress : null]}
            >
                <Text style={styles.addressText}>{`${item.address1}, ${item.address2}, ${item.address3}`}</Text>
                <Icon name={isSelected ? "radiobox-marked" : "radiobox-blank"} size={24} color={isSelected ? "orange" : "grey"} />
            </TouchableOpacity>
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
                data={address}
                renderItem={renderAddress}
                keyExtractor={(item: any) => item.shippingaddressid}
                contentContainerStyle={styles.listContent}
            />
            <TouchableOpacity
            onPress={()=>navigation.navigate('ShipAddressAdd', {User: User})}
            >
                <Text>
                    AddShip
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>navigation.navigate('ShipAddressDelete', {User: User})}>
                <Text>
                    DeleteShip
                </Text>
            </TouchableOpacity>
        </View>
        
    );
};
/*<FloatingAction
actions={actions}
color={'orange'}
floatingIcon={<Icon name={'chevron-up'} size={30}/>}
onPressItem={handleScreenSelector}
/>*/
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
        padding: 15,
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

export default ShippingAddress;
