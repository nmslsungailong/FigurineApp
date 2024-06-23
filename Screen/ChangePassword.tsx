import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RouteProp, useRoute } from '@react-navigation/native';
import { io } from "socket.io-client";
import { RootStackParamList } from './RootStackParamList';

export type ProfileRouteProps = RouteProp<RootStackParamList, 'Profile'>;

const socket = io('http://10.0.2.2:5000/figurinesData', {
    transports: ['websocket'],
});

const ChangePassword = () => {
    const route = useRoute<ProfileRouteProps>();
    const [User, setUser] = useState<any>();
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confPasswordVisible, setConfPasswordVisible] = useState(false);

    useEffect(() => {
        if (route.params?.User !== undefined) {
            setUser(route.params.User);
        } else {
            console.log("No user found");
        }
    }, [route.params]);

    useEffect(() => {
        const handleResponse = (response: any) => {
            if (response.success) {
                Alert.alert('Success', response.message);
            } else {
                Alert.alert('Error', response.error);
            }
        };

        socket.on('edit_userpass_response', handleResponse);

        return () => {
            socket.off('edit_userpass_response', handleResponse);
        };
    }, []);

    const handleSubmit = () => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordPattern.test(password)) {
            Alert.alert('Error', 'Password must be at least 8 characters long and include at least one uppercase letter, one number, and one symbol.');
            return;
        }

        if (password !== confPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        socket.emit('edit_userpass', { new_password: password, user_id: User.userid });
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconHeaderContainer}>
                <Icon name="key" size={30} color='white' />
            </View>

            <Text style={styles.subHeader}>New Password</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="New password"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="orange" />
                </TouchableOpacity>
            </View>

            <Text style={styles.subHeader}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    secureTextEntry={!confPasswordVisible}
                    value={confPassword}
                    onChangeText={setConfPassword}
                />
                <TouchableOpacity onPress={() => setConfPasswordVisible(!confPasswordVisible)}>
                    <Icon name={confPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="orange" />
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Update Password"
                    onPress={handleSubmit}
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginBottom: 10,
    },
    input: {
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

export default ChangePassword;
