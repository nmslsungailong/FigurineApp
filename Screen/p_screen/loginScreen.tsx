import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { io } from 'socket.io-client';
import { storeUserLoggedInData } from '../../Database/StorageService';

type NavigationProp = StackNavigationProp<RootStackParamList, 'LogIn'>;

type User = {
    userid: any,
    username: any,
    email: any,
    balance: any
}

const socket = io('http://10.0.2.2:5000/figurinesData', {
    transports: ['websocket'],
});

const LogInScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        socket.on('login_response', (response: any) => {
            if (response.success) {
                Alert.alert('Login Success', response.message);
                let user_parsed = JSON.parse(response.user);
                const LoggedInUser : User ={
                    userid: user_parsed.userid.toString(),
                    username: user_parsed.username.toString(),
                    email: user_parsed.email.toString(),
                    balance: user_parsed.balance.toString()
                };

                // Store user data in AsyncStorage
                storeUserLoggedInData({
                    LogInStatus: true,
                    userData: LoggedInUser
                });

                console.log(LoggedInUser);
                // Navigate to the ProfileScreen with the user's ID
                navigation.navigate('Profile', { User: LoggedInUser , loggedIn: true });
            } else {
                Alert.alert('Login Failed', response.message);
            }
        });

        return () => {
            socket.off('login_response');
        };
    }, []);

    const handleUsernameChange = (username: any) => setUsername(username);
    const handlePasswordChange = (password : any) => setPassword(password);


    const handleLogIn = () => {

        if (!username || !password) {
            Alert.alert('Error', 'Please do not leave the text fields empty');
            return; // Exit the function early
        }else{
            console.log("emit into login");
            socket.emit('login', username, password );
        }

    }
    
    return (
        <View style={styles.container}>
             <View style={styles.iconContainer}>
                <Icon name="user-circle" size={60} color="orange" />
            </View>
            <Text style={styles.subHeader}>Username </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your username" 
                value={username}
                placeholderTextColor="black"
                onChangeText={handleUsernameChange}
            />
            <Text style={styles.subHeader}>Password </Text>
            <View style={styles.passinputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    placeholderTextColor="black"
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity 
                    style={styles.iconTouchArea}
                    onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="orange" />
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title='Log In'
                    onPress={handleLogIn}
                    color={'orange'}
                />
            </View>
            <Text style={{
                marginTop: 10,
            }}></Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        padding: 10,
        color: 'white',
        backgroundColor: 'orange',
        borderRadius: 20,
    },
    subHeader: {
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
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: 'black'
    },
    passinputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginBottom: 10,
    },
    passinput:{
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingRight: 20,
        paddingHorizontal: 10,
        flex: 1, // Added to ensure input expands to fill space
        color: 'black',
    },
    iconTouchArea: {
        position: 'absolute', // Position over the right edge of the input
        right: 10,
        height: '100%', // Match height of the input
        justifyContent: 'center', // Center the icon vertically
        paddingHorizontal: 10, // Padding for touch area
        paddingBottom: 10,
    },
    buttonContainer: {
        width: '80%',
        marginTop: 10,
    }
});

export default LogInScreen;

