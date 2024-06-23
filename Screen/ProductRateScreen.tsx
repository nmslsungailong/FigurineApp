// screens/ProductRateScreen.js
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { RootStackParamList } from './RootStackParamList';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconStar from 'react-native-vector-icons/Ionicons';
let SQLite = require('react-native-sqlite-storage');

export type ProductRateRouteProps = StackNavigationProp<RootStackParamList, 'ProductRate'>


const ProductRateScreen = ({ route, navigation }: any) => {

  const { productId, onRate } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [User, setUser] = useState();


  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Icon
            name={i <= rating ? 'star' : 'star-o'}
            size={50}
            color={i <= rating ? 'orange' : 'grey'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const db = SQLite.openDatabase(
    {name: 'figurines.sqlite', createFromLocation: '~figurines.sqlite'},
    () => {console.log('Database opened')},
    (error: any) => {console.error('Error opening database', error)}
  );

  const submitRating = ({itemId, rating} : any) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'INSERT INTO rating_figure(figurineid, rating) VALUES (?, ?)',
        [itemId, rating],
        (tx: any) => {
          console.log('Rating inserted');
          tx.executeSql(
            'UPDATE items SET number_of_ratings = number_of_ratings + 1, average_rating = ((average_rating * number_of_ratings) + ?) / (number_of_ratings + 1) WHERE item_id = ?',
            [rating, itemId],
            () => console.log('Average rating updated'),
            (error: any) => console.error('Error updating average rating', error)
          );
        },
        (error : any) => console.error('Error inserting rating', error)
      );
    });
  };

  //<Icon name="star-outline" size={30} />
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconStar name="star-outline" size={30} color='white'/>
      </View>
      <Text style={styles.title}>Rate It!</Text>
      <Text style={styles.tapToRate}>Tap to rate</Text>
      <View style={styles.starContainer}>{renderStars()}</View>

      <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
        <Text style={styles.submitButtonText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
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
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tapToRate: {
    fontSize: 18,
    color: 'grey',
    marginBottom: 16,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentPrompt: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    width: '100%',
    height: 100,
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ProductRateScreen;
