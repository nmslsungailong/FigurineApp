import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ToastAndroid } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackParamList } from '../RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import io  from 'socket.io-client';

type User = {
    username: string,
    email: string,
    password: string,
    balance: number // Assuming balance is a number
}

type FigureDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'LogIn'>;

var socket = io('http://10.0.2.2:5000/figurinesData', {
    transports:['websocket'],
});

const SignInScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confpassword, setConfPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confPasswordVisible, setConfPasswordVisible] = useState(false);

    
    const navigation  = useNavigation<FigureDetailsNavigationProp>();

    useEffect(() => {
        // This useEffect only sets up connections and should not depend on state variables that change frequently
        socket.on('connect', () => {
            socket.emit('mobile_client_connected', { connected: true });
            ToastAndroid.show('Connected to server', ToastAndroid.LONG);
        });
    
        socket.on('add_user_response', (response: any) => {
            if (response.success) {
                Alert.alert('Success', 'User added successfully');
                navigation.navigate('LogIn');
            } else {
                Alert.alert('Error', response.error);
            }
        });
    
        return () => {
            socket.off('connect');
            socket.off('add_user_response');
        };
    }, []);

    
    
    const handleUsernameChange = (text: string) => {
        setUsername(text);
    }

    const handleEmailChange = (text: string) => {
        setEmail(text);
    }

    const handleSignIn = () => {

        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!username || !email || !password || !confpassword) {
            Alert.alert('Error', 'Please do not leave the text fields empty');
            return; // Exit the function early
        }

        if (!emailPattern.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return; // Exit the function early if the email is invalid
        }
    
        if (!passwordPattern.test(password)) {
            Alert.alert('Error', 'Password must be at least 8 characters long and include at least one uppercase letter, one number, and one symbol.');
            return; // Exit the function early if the password is invalid
        }

        if (password === confpassword) {

            const newUser: User = {
                username: username,
                email: email,
                password: password,
                balance: 0.0 // Set default balance to 0
            };

            socket.emit('add_user', newUser)
            
        } else {
            Alert.alert('Error', 'Password and Confirm Password must be the same.');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconHeaderContainer}>
                <Icon name="user-circle" size={80} color='orange' />
            </View>
            <Text style={styles.subHeader}>Username </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={handleUsernameChange}
            />
            <Text style={styles.subHeader}>Email Address </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={handleEmailChange}
            />
            <Text style={styles.subHeader}>Password </Text>
            <View style={styles.inputContainer}>

                <TextInput
                    style={styles.passinput}
                    placeholder="Enter your password"
                    secureTextEntry={!passwordVisible}  // Toggle based on state
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="orange" />
                </TouchableOpacity>
            </View>

            <Text style={styles.subHeader}>Confirm Password </Text>
            <View style={styles.inputContainer}>
            <TextInput
                style={styles.passinput}
                placeholder="Enter your confirm password"
                secureTextEntry={!confPasswordVisible}  // Toggle based on state
                value={confpassword}
                onChangeText={setConfPassword}
            />
            <TouchableOpacity onPress={() => setConfPasswordVisible(!confPasswordVisible)}>
                <Icon name={confPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="orange" />
            </TouchableOpacity>
        </View>
            <View style={styles.buttonContainer}>
                <Button
                    title='Sign In'
                    onPress={handleSignIn}
                    color={'orange'}
                />
            </View>
            <TouchableOpacity
            onPress={() => navigation.navigate('LogIn')}
            style={{
                marginTop: 15,
                
            }}
            >
                <Text style={{
                    color: 'black'
                }}>Registered already? Click Here</Text>
            </TouchableOpacity>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconHeaderContainer: {
        marginBottom: 50, // Space between icon and form fields
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 70,
        padding: 10,
        color: 'white',
        backgroundColor: 'orange',
        borderRadius: 20,
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
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: 'black'
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginBottom: 10,
    },
    passinput: {
        flex: 1,
        marginRight: 10,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '80%',
        marginTop: 20,

    },
});

export default SignInScreen;
