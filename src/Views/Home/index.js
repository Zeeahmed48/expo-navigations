import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import Map from '../../Components/Maps';
import AntIcons from 'react-native-vector-icons/AntDesign';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { db } from '../../Config/Firebase';
import { geohashQueryBounds, distanceBetween } from 'geofire-common';

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
    // setIsPickUpSelected(false);
    // navigation.navigate('dropoff', { pickUp: region });
  };

  useEffect(() => {
    (async () => {
      const center = [24.9286909, 67.0898786];
      const radiusInM = 15 * 1000;
      const bounds = geohashQueryBounds(center, radiusInM);
      const promises = [];
      for (const b of bounds) {
        const q = db
          .collection('customer')
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
        });
    })();
  }, []);

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
