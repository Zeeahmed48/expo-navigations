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

const TripStarted = ({ navigation, route }) => {
  const { driverId, id, dropOff } = route.params;
  const [driverName, setDriverName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [pay, setPay] = useState({});
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
      startListenToDriver({ lat, lng });
    })();
  }, []);

  let driverListener;

  const startListenToDriver = (userLocation) => {
    driverListener = db
      .collection('drivers')
      .doc(driverId)
      .onSnapshot((doc) => {
        const { name, lat, lng } = doc?.data();
        setDriverMarker({ ...driverMarker, latitude: lat, longitude: lng });
        setDriverName(name);
        console.log('driver listening started');
        calculateDriverDistance(userLocation, { lat, lng });
      });
  };

  const stopListenToDriver = () => {
    driverListener();
    console.log('driver listening stopped');
  };

  const calculateDriverDistance = (userLocation, driverLocation) => {
    const allCoords = {
      lat1: userLocation?.lat,
      lon1: userLocation?.lng,
      lat2: driverLocation?.lat,
      lon2: driverLocation?.lng,
    };
    const { lat1, lon1, lat2, lon2 } = allCoords;
    if (lat1 && lon1 && lat2 && lon2) {
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
        setModalVisible(true);
        stopListenToDriver();
      }
    }
  };

  const startTrip = () => {
    console.log('started');
    startListenToTrip();
    const { latitude, longitude } = dropOff;
    setDropOffPoint({ ...dropOffPoint, latitude, longitude });
    setModalVisible(false);
    setIsTripStarted(true);
    db.collection('drivers').doc(driverId).update({
      request: 'customerAccepted',
      dropOff,
    });
  };

  let tripListener;

  const startListenToTrip = () => {
    tripListener = db
      .collection('drivers')
      .doc(driverId)
      .onSnapshot((doc) => {
        const { lat, lng, pay } = doc?.data();
        setPay(pay);
        setDriverMarker({ ...driverMarker, latitude: lat, longitude: lng });
        console.log('trip listening started');
        calculateTripDistance();
      });
  };

  const stopListenToTrip = () => {
    tripListener();
    console.log('trip listening stopped');
  };

  const calculateTripDistance = () => {
    const allCoords = {
      lat1: dropOff?.latitude,
      lon1: dropOff?.longitude,
      lat2: driverMarker?.latitude,
      lon2: driverMarker?.longitude,
    };
    const { lat1, lat2, lon1, lon2 } = allCoords;
    if (lat1 && lon1 && lat2 && lon2) {
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
        stopListenToTrip();
      }
    }
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const endTrip = () => {
    setModalVisible(false);
    db.collection('drivers').doc(driverId).update({ request: 'ended' });
    navigation.navigate('dashboard');
  };

  return (
    <>
      {!modalVisible ? (
        userMarker?.latitude &&
        userMarker?.longitude &&
        driverMarker?.latitude &&
        driverMarker?.longitude && (
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
                apikey='AIzaSyCtMCLg_zFHKO7we7DaNJUFCYzXdqAcPs4' // insert your API Key here
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
                {isTripEnded && (
                  <>
                    <Text style={styles.arriveMsg}>
                      {`Distance: ${pay.distance} m`}
                    </Text>
                    <Text
                      style={styles.arriveMsg}
                    >{`pay: ${pay.price} rs`}</Text>
                  </>
                )}
                {isTripEnded ? (
                  <TouchableOpacity style={styles.startBtn} onPress={endTrip}>
                    <Text style={styles.startBtnText}>End Trip</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.startBtn} onPress={startTrip}>
                    <Text style={styles.startBtnText}>Start Trip</Text>
                  </TouchableOpacity>
                )}
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
