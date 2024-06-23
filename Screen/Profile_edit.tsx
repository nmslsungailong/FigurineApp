import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Ensure you have FontAwesome installed
import { RootStackParamList } from './RootStackParamList';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileEditScreen = () => {
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [username, setUsername] = useState('CurrentUsername'); // Placeholder values
    const [email, setEmail] = useState('user@example.com'); // Placeholder values
    const [User, setUser] = useState<any>();
    const navigation  = useNavigation<NavigationProp>();

    

    const usernameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);

    // Toggle edit state for username
    const toggleEditUsername = () => {
        setIsEditingUsername(true);
        setTimeout(() => {
            if (usernameInputRef.current) {
                usernameInputRef.current.focus();
            }
        }, 100);
    };

    const toggleEditEmail = () => {
        setIsEditingEmail(true);
        setTimeout(() => {
            if (emailInputRef.current) {
                emailInputRef.current.focus();
            }
        }, 100);
    };

    // Handle automatic update when editing is stopped
    useEffect(() => {
        if (isEditingUsername) {
            const timer = setTimeout(() => {
                setIsEditingUsername(false);
                console.log('Username updated to:', username);
                // Implement update logic or API call here
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [username]);

    useEffect(() => {
        if (isEditingEmail) {
            const timer = setTimeout(() => {
                setIsEditingEmail(false);
                console.log('Email updated to:', email);
                // Implement update logic or API call here
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [email]);

    return (
        <View style={styles.container}>
            <View style={styles.iconHeaderContainer}>
                <Icon name="user-edit" size={30} color='white' />
            </View>

            <Text style={styles.subHeader}>Edit Username</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={usernameInputRef}
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    editable={isEditingUsername}
                />
                {!isEditingUsername && (
                    <TouchableOpacity onPress={toggleEditUsername}>
                        <Icon name="pencil-alt" size={20} color="orange" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.subHeader}>Edit Email</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={emailInputRef}
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    editable={isEditingEmail}
                />
                {!isEditingEmail && (
                    <TouchableOpacity onPress={toggleEditEmail}>
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
        flex: 1,
        marginRight: 10, // adjust this value to increase spacing
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginBottom: 10,
    },
});

export default ProfileEditScreen;
