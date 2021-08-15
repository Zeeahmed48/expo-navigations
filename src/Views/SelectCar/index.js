import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import CarMini from '../../../assets/images/car_mini.png';
import CarGo from '../../../assets/images/car_go.png';
import carBusiness from '../../../assets/images/car_business.png';
import Icon from 'react-native-vector-icons/Ionicons';

const SelectCar = ({ route, navigation }) => {
  const { distance } = route.params;
  return (
    <View style={styles.container}>
      <View style={styles.floatBtn}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Icon name='arrow-back' color='#e2b052' size={28} />
        </TouchableOpacity>
      </View>
      <View>
        <Text>Select car to start your trip: {`${distance} km`}</Text>
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageWrapper}>
          <Image source={CarMini} style={styles.image} />
          <Text>Mini</Text>
          <Text>{`${distance} km : ${distance * 25} rs`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageWrapper}>
          <Image source={CarGo} style={styles.image} />
          <Text>Go</Text>
          <Text>{`${distance} km : ${distance * 45} rs`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageWrapper}>
          <Image source={carBusiness} style={styles.image} />
          <Text>Business</Text>
          <Text>{`${distance} km : ${distance * 60} rs`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectCar;
