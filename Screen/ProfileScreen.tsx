import React , {useEffect, useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./RootStackParamList";
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

export type LogInRouteProps = RouteProp<RootStackParamList, 'LogIn'>;

type NavigationProp = StackNavigationProp<RootStackParamList>;

type User = {
  userid: any,
  username: any,
  email: any,
  balance: any
}

const ProfileScreen = () => {

  const route = useRoute<LogInRouteProps>();
  const navigation = useNavigation<NavigationProp>(); // Move this here
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [User, setUser] = useState<any>({
    userid: '',
    username: '',
    email: '',
    balance: '10,000'
  });

  useEffect(() => {
    console.log("Profile screen params:", route.params);
    if (route.params?.loggedIn) {
      const loggedInUser: User = route.params.User;
      setIsLoggedIn(route.params.loggedIn);
      setUser(loggedInUser);
      console.log("Logged in user set:", loggedInUser);
    } else {
      console.log("log in unsuccessful or no user found");
    }
  }, [route.params]);


  const data = [
    { id: '1', title: 'My Cart' },
    { id: '2', title: 'Shipping Address' },
    { id: '3', title: 'Top Up' },
    { id: '4', title: 'Change Password'}
  ];

  const renderUsername = () => {
    if (User && isLoggedIn) {
      return (
        <Text style={styles.username}>{User.username}</Text>
      );
    } else {
      return (
        <Text style={styles.username}>Guest</Text>
      );
    }
  };

  // Function to render email based on authentication status
  const renderEmail = () => {
    if (User && isLoggedIn) {
      return (
        <View>
          <Text style={styles.email}>{User.email}</Text>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <Text
              style={styles.signinbutton}
              onPress={navigateToSignIn}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn'); // Use the navigation here directly
  }

  const handleItemPress = (item:any) => {
    if(isLoggedIn){
      switch (item.title) {
        case 'My Cart':
            navigation.navigate('Cart', {User: User});
            break;
        case 'Shipping Address':
            navigation.navigate('ShipAddress', {User: User});
            break;
        case 'Top Up':
            navigation.navigate('TopUp', {User: User});
            break;
        case 'Change Password':
            navigation.navigate('ChangePassword', {User: User});
            break;
        default:
            Alert.alert('Navigation error', 'Screen not found');
    }
    }else{
      Alert.alert("Please Sign In first!");
    }
};


const renderItem = ({ item }: any) => (
    <TouchableOpacity 
        style={styles.orderItem}
        onPress={() => handleItemPress(item)}
    >
        <Icon name="cart-outline" size={24} color="#333" />
        <Text style={styles.orderItemText}>{item.title}</Text>
        <Icon name="chevron-forward-outline" size={24} color="#333" />
    </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image source={require('../IMG/chizuru_nendroid.png')} style={styles.avatar} />
        </View>
        <View style={styles.userInfoContainer}>
          {renderUsername()}
          {renderEmail()}
        </View>
      </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.headerText}>Balance</Text>
          <Text style={styles.valueText}>¥{User.balance}</Text>
        </View>
      <View style={styles.myOrdersContainer}>
        <Text style={styles.myOrdersHeading}>My Orders</Text>
        <View style={styles.orderItemContainer}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 70,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    marginLeft: 40,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'black'
  },
  userInfoContainer: {},
  username: {
    marginLeft: 2,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black'
  },
  email: {
    marginBottom: 12,
    fontSize: 16,
    color: '#666',
  },
  balanceContainer: {
    alignItems: 'center',
  },
  pointsContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black'
  },
  valueText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'orange',
  },
  myOrdersContainer: {
    paddingTop: 50,
  },
  myOrdersHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  orderIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderIcon: {
    alignItems: 'center',
  },
  orderIconText: {
    marginTop: 5,
    fontSize: 12,
    color: 'black'
  },
  orderItemContainer: {
    paddingTop: 50,
    paddingVertical: 10,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1, // Add borderBottomWidth
    borderBottomColor: '#ccc', // Add borderBottomColor
    
  },
  orderItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'black'
  },
  signinbutton:{
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'orange',
    marginRight: 30,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 20
  },
  editbutton:{
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'orange',
    marginRight: 30,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 20,
    width: 60, // Set a fixed width
    textAlign: 'center', // Center the text inside the button
    justifyContent: 'center', // Center button text vertically (useful in flex containers)
  },

});

export default ProfileScreen;
