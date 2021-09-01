import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { db } from '../../Config/Firebase';
import CarMarker from '../../../assets/images/car_mini.png';
import MapPin from '../../../assets/images/map_pin.png';

const TripStarted = ({ route }) => {
  const { driverId, id, dropOff } = route.params;
  const [dInM, setDInM] = useState('');
  const [driverName, setDriverName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [isTripEnded, setIsTripEnded] = useState(false);
  const [userMarker, setUserMarker] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [dropOffPoint, setDropOffPoint] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [driverMarker, setDriverMarker] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  useEffect(() => {
    (async () => {
      const userLocation = await db.collection('users').doc(id).get();
      const { lat, lng } = userLocation.data();
      setUserMarker({ ...userMarker, latitude: lat, longitude: lng });
    })();
    db.collection('drivers')
      .doc(driverId)
      .onSnapshot((doc) => {
        const { name, lat, lng } = doc?.data();
        setDriverMarker({ ...driverMarker, latitude: lat, longitude: lng });
        setDriverName(name);
      });
  }, []);

  useEffect(() => {
    if (
      driverMarker?.latitude &&
      driverMarker.longitude &&
      userMarker?.longitude &&
      userMarker?.longitude
    ) {
      // if (dInM <= 100) {
      //   return;
      // }
      calculateDistance();
    }
  }, [driverMarker?.latitude, driverMarker.longitude]);

  const calculateDistance = () => {
    const allCoords = {
      lat1: userMarker?.latitude,
      lon1: userMarker?.longitude,
      lat2: driverMarker?.latitude,
      lon2: driverMarker?.longitude,
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
    const distanceInMeter = d * 1000;
    console.log('distanceInMeter ===>', distanceInMeter);
    if (distanceInMeter <= 100) {
      setModalVisible(true);
      return;
      // setDInM(distanceInMeter);
    }
  };

  const startTrip = () => {
    const { latitude, longitude } = dropOff;
    setDropOffPoint({ ...dropOffPoint, latitude, longitude });
    setModalVisible(false);
    setIsTripStarted(true);
    db.collection('users').doc(id).update({ dropOffPoint });
    db.collection('drivers')
      .doc(driverId)
      .update({ request: 'customerAccepted' });
    db.collection('drivers')
      .doc(driverId)
      .onSnapshot((doc) => {
        const { lat, lng } = doc?.data();
        setDriverMarker({ ...driverMarker, latitude: lat, longitude: lng });
        const allCoords = {
          lat1: dropOffPoint?.latitude,
          lon1: dropOffPoint?.longitude,
          lat2: driverMarker?.latitude,
          lon2: driverMarker?.longitude,
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
        const distanceInMeter = d * 1000;
        if (distanceInMeter <= 100) {
          setIsTripEnded(true);
          setModalVisible(true);
          return;
        }
      });
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const endTrip = () => {
    db.collection('drivers').doc(driverId).update({ request: 'ended' });
  };

  return (
    <>
      {!modalVisible ? (
        userMarker.latitude &&
        userMarker.longitude && (
          <MapView
            region={driverMarker}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
          >
            {isTripStarted && (
              <MapViewDirections
                lineDashPattern={[0]}
                origin={driverMarker}
                destination={dropOffPoint}
                apikey={API_KEY} // insert your API Key here
                strokeWidth={4}
                strokeColor='#e2b052'
              />
            )}
            {driverMarker.latitude && driverMarker.longitude && (
              <Marker coordinate={driverMarker}>
                <Image style={styles.marker} source={CarMarker} />
                <Callout style={styles.calloutContainer} tooltip={true} />
              </Marker>
            )}
            {userMarker.latitude && userMarker.longitude && (
              <Marker coordinate={isTripStarted ? dropOffPoint : userMarker}>
                <Image style={styles.marker} source={MapPin} />
              </Marker>
            )}
          </MapView>
        )
      ) : (
        <Modal animationType='slide' transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <>
                <Text style={styles.arriveMsg}>
                  {isTripEnded
                    ? 'Destination Reached!'
                    : `${driverName} Has Arrived!`}
                </Text>
                <TouchableOpacity
                  style={styles.startBtn}
                  onPress={isTripEnded ? endTrip : startTrip}
                >
                  <Text style={styles.startBtnText}>
                    {isTripEnded ? 'End Trip' : 'Start Trip'}
                  </Text>
                </TouchableOpacity>
              </>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default TripStarted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  marker: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  centeredView: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    margin: 'auto',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  startBtn: {
    backgroundColor: '#e2b052',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 8,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 18,
  },
  arriveMsg: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 18,
    marginVertical: 8,
  },
});
