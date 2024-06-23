import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
let SQLite = require('react-native-sqlite-storage');


const { width } = Dimensions.get('window');

interface Figurine {
  id: number;
  product_name: string;
  tab_category: String;
  image1: string;
}

const openCallback = () =>{
  console.log('database open success');
}

const errorCallback = (err: any) => {
  console.log('Error in opening the database: ' + err);
}

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

type FigureDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'FigureDetails'>;


const FigurineItem = ({ item }: { item: Figurine }) => {
  const navigation  = useNavigation<FigureDetailsNavigationProp>();

  const showFigureDetails = () =>{
    navigation.navigate('FigureDetails', {item: item})
  }
  
  return (
    <TouchableOpacity style={styles.itemContainer}
    onPress={showFigureDetails}
    >
      <Image source={{ uri: 'https:' + item.image1 }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.product_name}</Text>
      <Text style={styles.itemCategory}>{item.tab_category}</Text>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const images = [
    require('../IMG/Chainsaw_Figure.png'),
    require('../IMG/Chiaki_Figurine.png'),
    require('../IMG/Miku_Nendroid.png'),
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('Popular');
  const [PopularItems, setPopularItems] = useState<Figurine[]>([]);
  const [NewArrivalItems, setNewArrivalItems] = useState<Figurine[]>([]);

  let db = SQLite.openDatabase(
    {name: 'figurines.sqlite', createFromLocation: '~figurines.sqlite'},
    openCallback,
    errorCallback,
  )


  const _queryItem = () =>{
    try{
      var FigmaData:any = [];
      db.executeSql('SELECT * FROM figurines WHERE tab_category="Figma"',[], (results:any) => {
      (results.rows.raw()).forEach(( item:any ) => {
      FigmaData.push(item);
      })

      
      
      FigmaData = shuffleArray(FigmaData);
      setPopularItems(FigmaData.slice(0, 6));

      FigmaData = shuffleArray(FigmaData);
      setNewArrivalItems(FigmaData.slice(0, 6));

      });

      } catch (error) {
      console.error(error);
      throw Error('Failed to get students !!!');
      }
  }

  useEffect(()=>{
    _queryItem();

    },[]);

  const renderImage = ({ item }: any) => (
    <View style={styles.imageContainer}>
      <Image source={item} style={styles.image} />
    </View>

  );

  const stickyIndices = [3];

  return (
    <View style={styles.container}>
      <Carousel
        data={images}
        renderItem={renderImage}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={(index) => setActiveSlide(index)}
        loop
        autoplay
        autoplayDelay={5000}
        autoplayInterval={5000}
        scrollEnabled
      />
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Popular' && styles.selectedTab]}
          onPress={() => setSelectedTab('Popular')}
        >
          <Text style={styles.tab_font}>
            Popular
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'NewArrival' && styles.selectedTab]}
          onPress={() => setSelectedTab('NewArrival')}
        >
          <Text style={styles.tab_font}>
            New Arrival
          </Text>
        </TouchableOpacity>
      </View>
      {selectedTab === 'Popular' && (
        <ScrollView style={styles.scrollView}>
          {
            PopularItems.map((item:any) => (
              <FigurineItem key={item.id} item={item} />
            ))
          }
        </ScrollView>
      )}
      {selectedTab === 'NewArrival' && (
        <ScrollView style={styles.scrollView}>
          {
            NewArrivalItems.map(item => (
              <FigurineItem key={item.id} item={item} />
            ))
          }
        </ScrollView>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    width: width,
    height: 500, // Adjusted height
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  pagination: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  dot: {
    width: 10,
    height: 5,
    borderRadius: 1,
    marginHorizontal: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 10, // Margin applied to the tab navigation buttons
    borderColor: '#ccc',
  },
  tab: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    color: 'orange',
    borderBottomWidth: 2,
    borderColor: 'orange',
  },
  tab_font: {
    fontFamily: 'arial',
    fontWeight: 'bold',
    color: 'black'
  },
  scrollView: {
    height: '47%', // Adjusted height
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden', // Ensure content does not overflow rounded borders
  },
  itemImage: {
    width: width -20,
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
});

export default HomeScreen;
