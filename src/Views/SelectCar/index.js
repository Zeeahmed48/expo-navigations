import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import CarMini from '../../../assets/images/car_mini.png';
import CarGo from '../../../assets/images/car_go.png';
import carBusiness from '../../../assets/images/car_business.png';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  geohashForLocation,
  geohashQueryBounds,
  distanceBetween,
} from 'geofire-common';
import {
  db,
  requestSingleDriver,
  storeUserLocation,
} from '../../Config/Firebase';
import styles from './styles';

const SelectCar = ({ route, navigation, user }) => {
  const { distance, location } = route.params;
  const { id } = user;
  const { pickUp, region } = location;
  const [modalVisible, setModalVisible] = useState(false);
  const [drivers, setDrivers] = useState(null);
  const [noDriver, setNoDriver] = useState(false);
  const [text, setText] = useState('');
  const [driverResponseText, setDriverResponseText] = useState('');
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

  const findDriver = async (carPrice) => {
    const { latitude, longitude } = pickUp;
    const lat = pickUp.latitude;
    const lng = pickUp.longitude;
    const hash = geohashForLocation([lat, lng]);
    const storeData = {
      geohash: hash,
      lat,
      lng,
    };
    await storeUserLocation(id, storeData);
    setModalVisible(true);
    const center = [latitude, longitude];
    const radiusInM = 15 * 1000;
    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];
    for (const b of bounds) {
      const q = db
        .collection('drivers')
        .orderBy('geohash')
        .startAt(b[0])
        .endAt(b[1]);
      promises.push(q.get());
    }
    // Collecting all the query results together into a single list
    Promise.all(promises)
      .then((snapshots) => {
        const matchingDocs = [];
        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            const lat = doc.get('lat');
            const lng = doc.get('lng');
            // We have to filter out a few false positives due to GeoHash
            // accuracy, but most will match
            const distanceInKm = distanceBetween([lat, lng], center);
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= radiusInM) {
              matchingDocs.push(doc?.data());
            }
          }
        }
        return matchingDocs;
      })
      .then((matchingDocs) => {
        ///// DO SOMETHING WITH MATCHING DOCS /////
        sendRequest(matchingDocs, 0, carPrice);
      });
  };

  const sendRequest = async (matchingDocs, currentDriver, carPrice) => {
    let currentDriverIndex = currentDriver;
    if (currentDriver >= matchingDocs.length) {
      setText('Sorry! No More Drivers left');
      setNoDriver(true);
      return;
    }
    setDrivers(matchingDocs);
    const id = matchingDocs[currentDriver]?.id;
    await requestSingleDriver(id, { request: 'pending' });
    db.collection('drivers')
      .doc(id)
      .onSnapshot((doc) => {
        const driverResponse = doc?.data()?.request;
        const driverName = doc?.data()?.name;
        if (driverResponse === 'rejected') {
          currentDriverIndex += 1;
          setDriverResponseText('rejected');
          setText('Driver rejected! Sending request to another driver');
          sendRequest(matchingDocs, currentDriverIndex);
        } else if (driverResponse === 'accepted') {
          setText(`${driverName} Accepted Ride!`);
          setDriverResponseText('accepted');
          let price = Math.round((carPrice * distance) / 100);
          console.log('price ==>', price);
          startTrip(matchingDocs, currentDriver, { price, distance });
        }
      });
  };

  const startTrip = (driversArray, currentDriver, pay) => {
    const driverId = driversArray[currentDriver]?.id;
    db.collection('drivers')
      .doc(driverId)
      .update({ request: 'started', customer: id, pay });
    db.collection('drivers')
      .doc(driverId)
      .onSnapshot((doc) => {
        const driverResponse = doc?.data()?.request;
        if (driverResponse === 'started') {
          navigation.navigate('tripStarted', { driverId, id, dropOff: region });
        }
      });
  };

  return (
    <View style={styles.root}>
      {!modalVisible ? (
        <>
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
                Select car to start your trip: {`${distance} m`}
              </Text>
            </View>
            <View style={styles.carVarietyContainer}>
              {cars.map(({ carImage, carName, carPrice }, index) => (
                <TouchableOpacity
                  style={styles.carContainer}
                  key={index}
                  onPress={() => findDriver(carPrice)}
                >
                  <View style={styles.imageWrapper}>
                    <Image source={carImage} style={styles.image} />
                  </View>
                  <Text style={styles.textCenter}>{carName}</Text>
                  <Text
                    style={styles.textCenter}
                  >{`${distance} m : ${Math.round(
                    (distance * carPrice) / 100
                  )} rs`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      ) : (
        <Modal animationType='slide' transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {drivers ? (
                <>
                  <Text style={styles.reqMessage}>
                    {driverResponseText === 'accepted'
                      ? text
                      : driverResponseText === 'rejected'
                      ? text
                      : `${drivers?.length} Driver Found`}
                  </Text>
                  {noDriver && (
                    <TouchableOpacity
                      style={styles.startBtn}
                      onPress={() => navigation.navigate('dashboard')}
                    >
                      <Text style={styles.startBtnText}>Go Back</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  <ActivityIndicator size='large' color='#e2b052' />
                  <View style={styles.modalText}>
                    <Text style={styles.textCenter}>Finding Driver</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SelectCar;
