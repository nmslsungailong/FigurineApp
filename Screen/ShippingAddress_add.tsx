import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
import { io } from 'socket.io-client';

export type ProfileRouteProps = RouteProp<RootStackParamList, 'ShipAddressAdd'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;
const socket = io('http://10.0.2.2:5000/figurinesData', {
    transports: ['websocket'],
});
const ShipAddAddScreen = () => {
    const route = useRoute<ProfileRouteProps>();
    const navigation = useNavigation<NavigationProp>();

    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');
    const [isEditingAddress1, setIsEditingAddress1] = useState(false);
    const [isEditingAddress2, setIsEditingAddress2] = useState(false);
    const [isEditingAddress3, setIsEditingAddress3] = useState(false);

    const address1InputRef = useRef<TextInput>(null);
    const address2InputRef = useRef<TextInput>(null);
    const address3InputRef = useRef<TextInput>(null);


    const [User, setUser] = useState<any>();

    useEffect(() => {
        if (route.params?.User !== undefined) {
            setUser(route.params.User);
        } else {
            console.log("No user found");
        }
    }, [route.params]);

    useEffect(() => {
        socket.on('add_shipping_address_response', (response: any) => {
            if (response.success) {
                Alert.alert('Success', 'Shipping address added successfully.');
            } else {
                Alert.alert('Error', response.error);
            }
        });

        return () => {
            socket.off('add_shipping_address_response');
        }
    }, []);

    const toggleEdit = (setEditState: React.Dispatch<React.SetStateAction<boolean>>, inputRef: React.RefObject<TextInput>) => {
        setEditState(prevState => {
            if (!prevState) {
                setTimeout(() => inputRef.current?.focus(), 100);
            }
            return !prevState;
        });
    };

    const submitAddress = () => {
        if (!address1 || !address2 || !address3) {
            Alert.alert('Error', 'All address fields are required.');
            return;
        }

        console.log('Address submitted:', { address1, address2, address3 });
        socket.emit('add_shipping_address', {
            userid: User.userid,
            address1: address1,
            address2: address2,
            address3: address3
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconHeaderContainer}>
                <Icon name="shipping-fast" size={30} color='white' />
            </View>
            <Text style={styles.subHeader}>Address 1</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={address1InputRef}
                    style={styles.input}
                    value={address1}
                    onChangeText={setAddress1}
                    editable={isEditingAddress1}
                    onBlur={() => setIsEditingAddress1(false)}
                />
                <TouchableOpacity onPress={() => toggleEdit(setIsEditingAddress1, address1InputRef)}>
                    <Icon name="pencil-alt" size={20} color="orange" />
                </TouchableOpacity>
            </View>

            <Text style={styles.subHeader}>Address 2</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={address2InputRef}
                    style={styles.input}
                    value={address2}
                    onChangeText={setAddress2}
                    editable={isEditingAddress2}
                    onBlur={() => setIsEditingAddress2(false)}
                />
                <TouchableOpacity onPress={() => toggleEdit(setIsEditingAddress2, address2InputRef)}>
                    <Icon name="pencil-alt" size={20} color="orange" />
                </TouchableOpacity>
            </View>

            <Text style={styles.subHeader}>Address 3</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={address3InputRef}
                    style={styles.input}
                    value={address3}
                    onChangeText={setAddress3}
                    editable={isEditingAddress3}
                    onBlur={() => setIsEditingAddress3(false)}
                />
                <TouchableOpacity onPress={() => toggleEdit(setIsEditingAddress3, address3InputRef)}>
                    <Icon name="pencil-alt" size={20} color="orange" />
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Submit Address"
                    onPress={submitAddress}
                    color="orange"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconHeaderContainer: {
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
    subHeader: {
        alignSelf: 'flex-start',
        marginLeft: '10%',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        padding: 2,
        paddingLeft: 5,
        paddingBottom: 4,
        backgroundColor: 'orange',
        borderRadius: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'black',
    },
    buttonContainer: {
        width: '80%',
        marginTop: 20,
    },
});

export default ShipAddAddScreen;
