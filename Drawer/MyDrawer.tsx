import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from '../Screen/HomeScreen.tsx';
import ProfileScreen from '../Screen/ProfileScreen.tsx';
import ProfileEditScreen from '../Screen/Profile_edit.tsx';
import ProductScreen from '../Screen/ProductScreen.tsx';
import FigureDetails from '../Screen/FigureDetail.tsx';
import SignInScreen from '../Screen/p_screen/signinScreen.tsx';
import LogInScreen from '../Screen/p_screen/loginScreen.tsx';
import changepassword from '../Screen/ChangePassword.tsx';
import TopUpScreen from '../Screen/TopUpScreen.tsx';
import ShippingAddress from '../Screen/ShippingAddress.tsx';
import ShipAddEditScreen from '../Screen/ShippingAddress_edit.tsx';
import ShipAddAddScreen from '../Screen/ShippingAddress_add.tsx'
import ShipAddDeleteScreen from '../Screen/ShippingAddress_del.tsx'
import CartScreen from '../Screen/CartScreen.tsx';
import ProductRateScreen from '../Screen/ProductRateScreen.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Screen/RootStackParamList.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = StackNavigationProp<RootStackParamList>

type User = {
  id: any,
  username: any,
  email: any,
  balance: any
}

// Custom Drawer Content
function CustomDrawerContent(props: any) {

  const navigation  = useNavigation<NavigationProp>();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: 'transparent' }}>
      <SafeAreaView style={{
        paddingLeft: 50,
        backgroundColor: 'transparent',
      }}>
        <Image source={require('../IMG/Logo.png')} style={styles.logo} />
      </SafeAreaView>
      <DrawerItemList {...props} />
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20, paddingLeft: 20 }}>
        <TouchableOpacity 
          onPress={(item:any) => {
            // Here you should add your log-out logic
            const NullUser: User ={
              id: '',
              username: '',
              email: '',
              balance: '10,000'
            }
            navigation.navigate('Profile', {User: NullUser, loggedIn: false})
            // Example: navigation.navigate('LoginScreen'); or your log-out function
          }}
          style={{ flexDirection: 'row', alignItems: 'flex-start' }}>

        </TouchableOpacity>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

const CustomDrawerHeader = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.Drawerheader}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ zIndex: 1 }}>
          <Icon name="menu" size={30} color={'black'} />
        </TouchableOpacity>
        <View style={{ width: 30 }}></View>
      </View>
    </SafeAreaView>
  );
};

const CustomScreenHeader = ({ navigation} : any)  =>{
  return(
    <SafeAreaView style={styles.Drawerheader}>
      <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon 
            name="arrow-back" 
            size={36} 
            color="black"
            />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}




// Create Drawer Navigator
const Drawer = createDrawerNavigator();

const MyDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={props => <CustomDrawerContent {...props} />}>
       <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="person-circle-outline" size={size} color={color} />,
          header: ({ navigation}) => <CustomDrawerHeader navigation={navigation} />,
        }}
      />
      <Drawer.Screen
      name="ProfileEdit"
      component={ProfileEditScreen}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
          header: ({ navigation }) => <CustomDrawerHeader navigation={navigation} />,
        }}
      />
     
      <Drawer.Screen
        name="Product"
        component={ProductScreen}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="cube-outline" size={size} color={color} />, // Assuming you have an icon for Product
          header: ({ navigation }) => <CustomDrawerHeader navigation={navigation} />,
        }}
      />

      <Drawer.Screen
      name="FigureDetails"
      component={FigureDetails}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />
      <Drawer.Screen
      name="SignIn"
      component={SignInScreen}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />
      <Drawer.Screen
      name="LogIn"
      component={LogInScreen}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />

      <Drawer.Screen
      name="ChangePassword"
      component={changepassword}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />

      <Drawer.Screen
      name="TopUp"
      component={TopUpScreen}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />     

      <Drawer.Screen
      name="ShipAddress"
      component={ShippingAddress}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      /> 

      <Drawer.Screen
      name="ShipAddressEdit"
      component={ShipAddEditScreen}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />

      <Drawer.Screen
      name="ShipAddressAdd"
      component={ShipAddAddScreen}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />

      <Drawer.Screen
      name="ShipAddressDelete"
      component={ShipAddDeleteScreen}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />



      <Drawer.Screen
      name="Cart"
      component={CartScreen}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />

      <Drawer.Screen
      name="ProductRate"
      component={ProductRateScreen}
      options={{
        drawerItemStyle: { height: 0 }, // Hide drawer item
        drawerLabel: () => null, // Optionally, ensure no label is shown
        headerTransparent: true,
        header: ({navigation}) => <CustomScreenHeader navigation={navigation}/>

      }}
      />
      
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'transparent',
  },
  Drawerheader: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 2,
    zIndex: 2, // Ensure header appears above other content
    backgroundColor: 'transparent', // Make header transparent
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  imageContainer: {
    marginRight: 10, // Adjust the spacing between images
  },
  image: {
    width: 200, // Adjust the width of the image as needed
    height: 100, // Adjust the height of the image as needed

    borderRadius: 10, // Optional: Add border radius to the image
  },
  logo:{
    width: 100,
    height: 100,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  drawerIcon: {
    marginRight: 10,
    color: 'white',
  },
  ScreenHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  }
});

export default MyDrawer;
