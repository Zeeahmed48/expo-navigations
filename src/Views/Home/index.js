import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import Map from '../../Components/Maps';
import AntIcons from 'react-native-vector-icons/AntDesign';
import EntypoIcons from 'react-native-vector-icons/Entypo';

const Home = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 24.9286909,
    longitude: 67.0898786,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [isPickUpSelected, setIsPickUpSelected] = useState(false);

  const pickUpSelected = (callBack) => {
    setIsPickUpSelected(true);
    callBack();
  };

  const cancelPickUp = () => {
    setIsPickUpSelected(false);
    // const marker = markerRef.current;
    // marker.hideCallout();
  };

  const confirmPickUp = () => {
    setIsPickUpSelected(false);
    navigation.navigate('dropoff', { pickUp: region });
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Map
          region={region}
          setRegion={setRegion}
          selected={pickUpSelected}
          status={isPickUpSelected}
        />
      </View>
      {isPickUpSelected && (
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmText}>Confirm Pickup Location?</Text>
          <TouchableOpacity
            style={[styles.btn, styles.cancelBtn]}
            onPress={cancelPickUp}
          >
            <EntypoIcons name='cross' size={32} color='#e2b052' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmPickUp}
            style={[styles.confirmBtn, styles.btn]}
          >
            <AntIcons name='check' size={32} color='#383838' />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Home;
