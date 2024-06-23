import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import NendroidScreen from './p_screen/NendroidScreen';
import ScaleScreen from './p_screen/ScaleScreen';
import FigmaScreen from './p_screen/FigmaScreen';
import OthersScreen from './p_screen/OthersScreen';



const Tab = createBottomTabNavigator();

const ProductTabNavigator = () => (
  <Tab.Navigator
  >
    <Tab.Screen 
    name="Nendroid" 
    component={NendroidScreen} 
    options={{
      headerTitle:'',
      headerTransparent : true,
      tabBarIcon: ({ color, size }) => ( // Define tabBarIcon for Scale tab
        <Icon name="star-outline" size={30} />
      ),
      tabBarLabelStyle:{
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'arial',
      },
      tabBarActiveTintColor:'orange',
      
    }}
    />
    <Tab.Screen 
    name="Scale" 
    component={ScaleScreen} 
    options={{
      headerTitle:'',
      headerTransparent: true,
      tabBarIcon: ({ color, size }) => ( // Define tabBarIcon for Scale tab
        <Icon name="star-outline" size={30} />
      ),
      tabBarLabelStyle:{
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'arial',
      },
      tabBarActiveTintColor:'orange',
    }}
    />
    <Tab.Screen 
    name="Figma" 
    component={FigmaScreen} 
    options={{
      headerTitle:'',
      headerTransparent : true,
      tabBarIcon: ({ color, size }) => ( // Define tabBarIcon for Scale tab
        <Icon name="star-outline" size={30}/>
      ),
      tabBarLabelStyle:{
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'arial',
      },
      tabBarActiveTintColor:'orange',
    }}
    />
    <Tab.Screen 
    name="OtherFigure" 
    component={OthersScreen} 
    options={{
      headerTitle:'',
      headerTransparent : true,
      tabBarIcon: ({ color, size }) => ( // Define tabBarIcon for Scale tab
        <Icon name="star-outline" size={30} />
      ),
       tabBarLabelStyle:{
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'arial',
      },
      tabBarActiveTintColor:'orange',
    }}
    />
  </Tab.Navigator>
);

export default ProductTabNavigator;
