import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Ensure you have FontAwesome installed
import { RootStackParamList } from './RootStackParamList';

export type EditShipAddRouteProps = StackNavigationProp<RootStackParamList, 'ShipAddressEdit'>

type NavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ShipAddEditScreen = () => {
    const [isEditingAddress1, setIsEditingAddress1] = useState(false);
    const [isEditingAddress2, setIsEditingAddress2] = useState(false);
    const [isEditingAddress3, setIsEditingAddress3] = useState(false);
    const [address1, setAddress1]  = useState('');
    const [address2, setAddress2]  = useState('');
    const [address3, setAddress3]  = useState('');
    const [User, setUser] = useState();

    const navigation  = useNavigation<NavigationProp>();

    const address1InputRef = useRef<TextInput>(null);
    const address2InputRef = useRef<TextInput>(null);
    const address3InputRef = useRef<TextInput>(null);


    // Toggle edit state for Address1
    const toggleEditAddress1 = () => {
        setIsEditingAddress1(true);
        setTimeout(() => {
            if (address1InputRef.current) {
                address1InputRef.current.focus();
            }
        }, 100);
    };

    const toggleEditAddress2 = () => {
        setIsEditingAddress2(true);
        setTimeout(() => {
            if (address2InputRef.current) {
                address2InputRef.current.focus();
            }
        }, 100);
    };

        // Toggle edit state for Address1
    const toggleEditAddress3 = () => {
        setIsEditingAddress3(true);
        setTimeout(() => {
            if (address3InputRef.current) {
                address3InputRef.current.focus();
            }
        }, 100);
    };

    // Handle automatic update when editing is stopped
    useEffect(() => {
        if (isEditingAddress1) {
            const timer = setTimeout(() => {
                setIsEditingAddress1(false);
                console.log('Address1 updated to:', address1);
                // Implement update logic or API call here
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [address1]);

    useEffect(() => {
        if (isEditingAddress2) {
            const timer = setTimeout(() => {
                setIsEditingAddress2(false);
                console.log('Address2 updated to:', address2);
                // Implement update logic or API call here
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [address1]);

    useEffect(() => {
        if (isEditingAddress3) {
            const timer = setTimeout(() => {
                setIsEditingAddress3(false);
                console.log('Address3 updated to:', address3);
                // Implement update logic or API call here
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [address3]);

    return (
        <View style={styles.container}>
            <View style={styles.iconHeaderContainer}>
                <Icon name="shipping-fast" size={30} color='white' />
            </View>
            <Text style={styles.subHeader}>Edit Address1</Text>
            <View style={styles.inputContainer}>

                <TextInput
                    ref={address1InputRef}
                    style={styles.input}
                    value={address1}
                    onChangeText={setAddress1}
                    editable={isEditingAddress1}
                />
                {!isEditingAddress1 && (
                    <TouchableOpacity onPress={toggleEditAddress1}>
                        <Icon name="pencil-alt" size={20} color="orange" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.subHeader}>Edit Address2</Text>
            <View style={styles.inputContainer}>

                <TextInput
                    ref={address2InputRef}
                    style={styles.input}
                    value={address2}
                    onChangeText={setAddress2}
                    editable={isEditingAddress2}
                />
                {!isEditingAddress2 && (
                    <TouchableOpacity onPress={toggleEditAddress2}>
                        <Icon name="pencil-alt" size={20} color="orange" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.subHeader}>Edit Address3</Text>
            <View style={styles.inputContainer}>

                <TextInput
                    ref={address3InputRef}
                    style={styles.input}
                    value={address3}
                    onChangeText={setAddress3}
                    editable={isEditingAddress3}
                />
                {!isEditingAddress3 && (
                    <TouchableOpacity onPress={toggleEditAddress3}>
                        <Icon name="pencil-alt" size={20} color="orange" />
                    </TouchableOpacity>
                )}
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
    input: {
        flex: 1, // Allows the input to expand and take up most of the space
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'black',
        marginRight: 10, // Ensures there is space between the text input and the icon
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Ensures the icon stays at the end of the container
        alignItems: 'center',
        width: '80%',
        marginBottom: 10,
    },
    buttonContainer: {
        width: '80%',
        marginTop: 20,
    },
});

export default ShipAddEditScreen;
