import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Home = () => {
  const clientId = 'VJIEZGBRDDZHMTMGJTHZYWL3L2URSSXNJV0VFNU0I2V1FFNA';
  const clientSecret = 'FDZU2U0J0BKB3VFRCGAVPXTYSM1ZXAWBWG0AJRQMFPE1E44Z';
  const [compass, setCompass] = useState(0);
  const [locationName, setLocationName] = useState('');
  const [isDropOffSelected, setIsDropOffSelected] = useState(false);
  const [region, setRegion] = useState({
    latitude: 24.9286909,
    longitude: 67.0898786,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const onMarkerDragEnd = (e) => {
    const newPosition = e.nativeEvent.coordinate;
    const newMarker = { ...region, ...newPosition };
    setIsDropOffSelected(true);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        const {
          coords: { latitude, longitude },
        } = location;
        setRegion({ ...region, latitude, longitude });
      }
    })();
    // (async () => {
    //   Location.watchPositionAsync(
    //     { timeInterval: 1, distanceInterval: 0 },
    //     (location) => {
    //       const {
    //         coords: { latitude, longitude, heading },
    //       } = location;
    //       setRegion({ ...region, longitude, latitude });
    //       setCompass(Math.floor(heading));
    //     }
    //   );
    // })();
  }, []);

  // useEffect(() => {
  //   const { latitude, longitude } = region;
  //   (async () => {
  //     const data = await fetch(
  //       `https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&ll=${latitude},${longitude}&v=20180323`
  //     );
  //     const res = await data.json();
  //     setLocationName(res.response.venues[0].name);
  //   })();
  // }, [region]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} mapType='mutedStandard'>
        <Marker
          // title={locationName}
          coordinate={region}
          // rotation={compass}
          draggable={!isDropOffSelected}
          onDragEnd={(e) => onMarkerDragEnd(e)}
        >
          <View style={styles.markerContainer}>
            <MaterialCommunityIcons name='car-sports' size={24} color='black' />
          </View>
        </Marker>
      </MapView>
      {isDropOffSelected && (
        <>
          <TouchableOpacity style={{ ...styles.dropOffBtn, marginBottom: 10 }}>
            <Text style={styles.dropOffBtnText}>Drop Off</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropOffBtn}
            onPress={() => setIsDropOffSelected(false)}
          >
            <Text style={styles.dropOffBtnText}>Cancel</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerText: {
    backgroundColor: '#fff',
    padding: 3,
    borderRadius: 8,
  },
  dropOffBtn: {
    backgroundColor: 'red',
    padding: 30,
  },
  dropOffBtnText: {
    color: '#fff',
  },
});

export default Home;
