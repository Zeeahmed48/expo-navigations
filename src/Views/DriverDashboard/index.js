import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, Modal } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import CarMarker from '../../../assets/images/car_mini.png';
import MapPin from '../../../assets/images/map_pin.png';
import { storeDriverLocation } from '../../Config/Firebase/index';
import { geohashForLocation } from 'geofire-common';
import { db } from '../../Config/Firebase';
import styles from './styles';
import MapViewDirections from 'react-native-maps-directions';

const DriverDashboard = ({ driver }) => {
  const { id } = driver;
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: 24.9286909,
    longitude: 67.0898786,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 0,
          },
          (location) => {
            const {
              coords: { latitude: lat, longitude: lng },
            } = location;
            setRegion({ ...region, latitude: lat, longitude: lng });
          }
        );
      }
    })();
  }, []);

  useEffect(() => {
    (() => {
      db.collection('drivers')
        .doc(id)
        .onSnapshot(async (doc) => {
          const obj = doc.data();
          if (obj?.request === 'pending') {
            setModalVisible(true);
          } else if (obj?.request === 'started') {
            const userId = obj?.customer;
            const userLocation = await db.collection('users').doc(userId).get();
            const { lat, lng } = userLocation?.data();
            setUserMarker({ ...userMarker, latitude: lat, longitude: lng });
          } else if (obj?.request === 'customerAccepted') {
            db.collection('users')
              .doc(userId)
              .onSnapshot((doc) => {
                const obj = doc.data();
                let dropOffPoint = obj?.dropOffPoint;
                if (dropOffPoint) {
                  setIsTripStarted(true);
                  setDropOffPoint(dropOffPoint);
                }
              });
          } else if (obj?.request === 'ended') {
            setIsTripStarted(false);
            setUserMarker({ ...userMarker, latitude: null, longitude: null });
          }
        });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const lat = region.latitude;
      const lng = region.longitude;
      const hash = geohashForLocation([lat, lng]);
      const storeData = {
        geohash: hash,
        lat,
        lng,
      };
      try {
        await storeDriverLocation(id, storeData);
      } catch ({ message }) {
        console.log('error occured while storing in database', message);
      }
    })();
  }, [region]);

  const acceptReq = () => {
    const reqAccepted = {
      request: 'accepted',
    };
    db.collection('drivers')
      .doc(id)
      .update({ ...reqAccepted });
    setModalVisible(false);
  };

  const rejectReq = () => {
    const reqRejected = {
      request: 'rejected',
    };
    db.collection('drivers')
      .doc(id)
      .update({ ...reqRejected });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {modalVisible ? (
          <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalTextWrapper}>
                  <Text>Customer Found!</Text>
                </View>
                <View style={styles.btnContainer}>
                  <TouchableOpacity style={styles.modalBtn} onPress={acceptReq}>
                    <Text style={styles.modalBtnText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalBtn} onPress={rejectReq}>
                    <Text style={styles.modalBtnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          <MapView
            region={region}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
          >
            {isTripStarted && (
              <MapViewDirections
                lineDashPattern={[0]}
                origin={region}
                destination={dropOffPoint}
                apikey='AIzaSyCtMCLg_zFHKO7we7DaNJUFCYzXdqAcPs4' // insert your API Key here
                strokeWidth={4}
                strokeColor='#e2b052'
              />
            )}
            <Marker coordinate={region}>
              <Image style={styles.marker} source={CarMarker} />
            </Marker>
            {userMarker.latitude && userMarker.longitude && (
              <Marker coordinate={isTripStarted ? dropOffPoint : userMarker}>
                <Image style={styles.marker} source={MapPin} />
              </Marker>
            )}
          </MapView>
        )}
      </View>
    </View>
  );
};

export default DriverDashboard;
