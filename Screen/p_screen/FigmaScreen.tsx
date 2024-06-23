import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../RootStackParamList';
import { useNavigation } from '@react-navigation/native';
let SQLite = require('react-native-sqlite-storage');

// Define interface for Figurine
interface Figurine {
  id: number;
  product_name: string;
  tab_category: string;
  image1: string;
  // Add other properties as needed
}

const openCallback = () =>{
  console.log('database open success');
}

const errorCallback = (err: any) => {
  console.log('Error in opening the database: ' + err);
}

type FigureDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'FigureDetails'>;

// Custom component to display each figurine
const FigurineItem = ({ item }: { item: any }) => {
  const navigation  = useNavigation<FigureDetailsNavigationProp>();

  const showFigureDetails = () =>{
    navigation.navigate('FigureDetails', {item: item})
  }
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={showFigureDetails}>
      <Image source={{ uri: 'https:' + item.image1 }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.product_name}</Text>
      <Text style={styles.itemCategory}>{item.tab_category}</Text>
    </TouchableOpacity>
  );
};



// Product Screen component
const FigmaScreen = () => {
  const [FigmaItems, setFigmaItems] = useState<Figurine[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const pageSize = 6;

  let db = SQLite.openDatabase(
    {name: 'figurines.sqlite', createFromLocation: '~figurines.sqlite'},
    openCallback,
    errorCallback,
  )


  const _queryFigmaItem = () =>{
    try{
      const FigmaData:any = [];
      db.executeSql('SELECT * FROM figurines WHERE tab_category="Figma"',[], (results:any) => {
      (results.rows.raw()).forEach(( item:any ) => {
      FigmaData.push(item);
      })
      setFigmaItems(FigmaData);
      });
      } catch (error) {
      console.error(error);
      throw Error('Failed to get students !!!');
      }
  }
  useEffect(()=>{
    _queryFigmaItem();
    },[]);

  // Calculate the number of tabs needed
  const numberOfTabs = Math.ceil(FigmaItems.length / pageSize);

  // Generate tabs dynamically
  const tabs = Array.from({ length: numberOfTabs }, (_, index) => index + 1);

  // Get items for the current active tab
  const getItemsForTab = (tab: number) => {
    const startIndex = (tab - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return FigmaItems.slice(startIndex, endIndex);
  };

  const handleNextTab = () => {
    if (activeTab < numberOfTabs) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrevTab = () => {
    if (activeTab > 1) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {getItemsForTab(activeTab).map(item => (
          <FigurineItem key={item.id} item={item} />
        ))}
      </ScrollView>
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navigationButton} onPress={handlePrevTab}>
          <Icon name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text
        style={{
          fontFamily: 'arial',
          fontWeight: 'bold',
          fontSize: 20,
          color:'black'
        }}
        >{activeTab}/{numberOfTabs}</Text>
        <TouchableOpacity style={styles.navigationButton} onPress={handleNextTab}>
          <Icon name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden', // Ensure content does not overflow rounded borders
  },
  itemImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover', // Ensure the entire image is covered without stretching
    borderRadius: 10, // Rounded corners
  },
  
  itemName: {
    marginTop: 5,
    fontWeight: 'bold',
    fontFamily: 'arial',
    color: 'black'
  },
  itemCategory: {
    marginVertical: 5, // Increased vertical margin
    paddingHorizontal: 8, // Added horizontal padding
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'orange',
    borderRadius: 5, // Increased border radius for rounder corners
    alignSelf: 'flex-start', // Align category text to the start of the container
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'transparent'
  },
  navigationButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'orange',
  },
});

export default FigmaScreen;
