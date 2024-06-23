// App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MyDrawer from './Drawer/MyDrawer';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';




// Main App Component
export default function App() {
  useEffect(() => {
    const initializeAsyncStorage = async () => {
      await AsyncStorage.clear();  // or clearSpecificKeys()
      console.log('AsyncStorage is cleared on app start');
    };

    initializeAsyncStorage();
  }, []);
  return (
    <NavigationContainer>
      <MyDrawer/>
    </NavigationContainer>

  );
}
