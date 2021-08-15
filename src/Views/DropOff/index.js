import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Map from '../../Components/Maps';
import AntIcons from 'react-native-vector-icons/AntDesign';
import EntypoIcons from 'react-native-vector-icons/Entypo';

const DropOff = ({ route, navigation }) => {
  const { pickUp } = route.params;
  const [isDropOffSelected, setIsDropOffSelected] = useState(false);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState({
    ...pickUp,
  });

  const dropOffSelected = () => {
    setIsDropOffSelected(true);
  };

  const cancelDropOff = () => {
    setIsDropOffSelected(false);
  };

  const confirmDropOff = () => {
    setIsDropOffSelected(false);
    const totalDistance = calculateDistance();
    navigation.navigate('selectcars', { distance: totalDistance });
  };

  const calculateDistance = () => {
    const allCoords = {
      lat1: pickUp.latitude,
      lon1: pickUp.longitude,
      lat2: region.latitude,
      lon2: region.longitude,
    };
    const { lat1, lat2, lon1, lon2 } = allCoords;
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    const distanceInKm = d.toFixed(1);
    return distanceInKm;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Icon name='arrow-back' color='#e2b052' size={28} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder='Search dropoff location'
          onChangeText={(text) => setSearch(text)}
          defaultValue={search}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Map
          region={region}
          setRegion={setRegion}
          selected={dropOffSelected}
          status={isDropOffSelected}
        />
      </View>
      {isDropOffSelected && (
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmText}>Confirm DropOff Location?</Text>
          <TouchableOpacity
            style={[styles.btn, styles.cancelBtn]}
            onPress={cancelDropOff}
          >
            <EntypoIcons name='cross' size={32} color='#e2b052' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmDropOff}
            style={[styles.confirmBtn, styles.btn]}
          >
            <AntIcons name='check' size={32} color='#383838' />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DropOff;
