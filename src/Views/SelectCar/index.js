import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import styles from './styles';
import CarMini from '../../../assets/images/car_mini.png';
import CarGo from '../../../assets/images/car_go.png';
import carBusiness from '../../../assets/images/car_business.png';
import Icon from 'react-native-vector-icons/Ionicons';

const SelectCar = ({ route, navigation }) => {
  const { distance } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const cars = [
    {
      carImage: CarMini,
      carName: 'Mini',
      carPrice: 25,
    },
    {
      carImage: CarGo,
      carName: 'Go',
      carPrice: 45,
    },
    {
      carImage: carBusiness,
      carName: 'Business',
      carPrice: 60,
    },
  ];

  return (
    <View style={styles.root}>
      <View style={styles.floatBtn}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Icon name='arrow-back' color='#e2b052' size={28} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View>
          <Text style={{ textAlign: 'center' }}>
            Select car to start your trip: {`${distance} km`}
          </Text>
        </View>
        <View style={styles.carVarietyContainer}>
          {cars.map(({ carImage, carName, carPrice }, index) => (
            <TouchableOpacity
              style={styles.carContainer}
              key={index}
              onPress={() => setModalVisible(true)}
            >
              <View style={styles.imageWrapper}>
                <Image source={carImage} style={styles.image} />
              </View>
              <Text>{carName}</Text>
              <Text>{`${distance} km : ${Math.round(
                distance * carPrice
              )} rs`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View
      // style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Modal animationType='slide' transparent={true} visible={modalVisible}>
          <ActivityIndicator size='large' color='#e2b052' />
          <Text>Finding Driver</Text>
        </Modal>
      </View>
    </View>
  );
};

export default SelectCar;
