import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can choose a cash icon from FontAwesome or another suitable library
import { RootStackParamList } from './RootStackParamList';
import { RouteProp, useRoute } from '@react-navigation/native';
import { io } from 'socket.io-client';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

export type ProfileRouteProps = RouteProp<RootStackParamList, 'Profile'>

const socket = io('http://10.0.2.2:5000/figurinesData', {
  transports: ['websocket'],
});

const TopUpScreen = () => {

  const route =  useRoute<ProfileRouteProps>();
  const [balance, setBalance] = useState<Float>(0.0); // Starting balance
  const [topUpAmount, setTopUpAmount] = useState('');
  const [User, setUser] = useState<any>({
    id: '',
    username: '',
    email: '',
    balance: '10,000'
  });
  useEffect(() => {
    // Handle balance update responses
    socket.on('update_balance_response', (response) => {
      if (response.success) {
        // Assuming response.new_balance is already a number or a string that can be converted to a number
        const newBalance = parseFloat(response.new_balance); // Convert to number if not already
        if (!isNaN(newBalance)) {
          Alert.alert(`Balance updated: ${newBalance.toFixed(2)} Yen`); // Format to 2 decimal places
          setBalance(newBalance); // Update the balance state
        } else {
          Alert.alert("Error: The new balance format is incorrect.");
        }
      } else {
        console.log(response.error);
        Alert.alert(`Error: ${response.error}`);
      }
    });
  
    // Clean up the effect by removing the listener when the component unmounts
    return () => {
      socket.off('update_balance_response');
    };
  }, []);
  
  useEffect(() => {
    if (route.params?.User !== undefined) {
      setUser(route.params.User);
    }else{
      console.log("No user found");
    }
  }, [route.params]);

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (!isNaN(amount)) {
      const newBalance = balance + amount;
      socket.emit('update_balance', {userid: User.userid}, newBalance); // Emit the new balance
      setTopUpAmount(''); // Reset input after top up
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="money" size={30} color="#fff" />
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.label}>Balance</Text>
        <Text style={styles.balance}>{`${User.balance.toLocaleString()} Yen`}</Text>
      </View>
      
      <Text style={styles.topUpQuestion}>How much would you like to top up?</Text>
      
      <TextInput
        value={topUpAmount}
        onChangeText={setTopUpAmount}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter top-up amount"
      />

      <TouchableOpacity style={styles.topUpButton} onPress={handleTopUp}>
        <Text>Top Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff', // Assuming a light theme
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  balanceContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'orange',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    color: 'orange',
    fontSize: 14,
    textAlign: 'center',
  },
  balance: {
    color: 'orange',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topUpQuestion: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '80%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    borderRadius: 5,
  },
  topUpButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
  },
});

export default TopUpScreen;


