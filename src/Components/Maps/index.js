import React, { useEffect, useState, useRef } from 'react';
import { Text, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import CarMarker from '../../../assets/images/car_marker.png';
import { MapStyle, styles } from './styles';
import { storeLocation } from '../../Config/Firebase/index';
import { geohashForLocation } from 'geofire-common';

const Map = ({ region, setRegion, selected, status }) => {
  const clientId = 'VJIEZGBRDDZHMTMGJTHZYWL3L2URSSXNJV0VFNU0I2V1FFNA';
  const clientSecret = 'FDZU2U0J0BKB3VFRCGAVPXTYSM1ZXAWBWG0AJRQMFPE1E44Z';
  const markerRef = useRef(null);
  const [locationName, setLocationName] = useState('');
  // const [compass, setCompass] = useState(0);

  const onMarkerDragEnd = (e) => {
    const marker = markerRef.current;
    const newPosition = e.nativeEvent.coordinate;
    const newMarker = { ...region, ...newPosition };
    setRegion(newMarker);
    marker.showCallout();
    marker.animateMarkerToCoordinate({ ...newMarker }, 1500);
    selected(() => {
      return region;
    });
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        const {
          coords: { latitude: lat, longitude: lng },
        } = location;
        const hash = geohashForLocation([lat, lng]);
        const storeData = {
          geohash: hash,
          lat,
          lng,
        };
        try {
          await storeLocation(undefined, storeData);
        } catch (e) {
          console.log('error occured while storing in database', e);
        }
        setRegion({ ...region, latitude: lat, longitude: lng });
      }
    })();
    // (async () => {
    //   Location.watchPositionAsync({ timeInterval: 1 }, (location) => {
    //     const {
    //       coords: { latitude, longitude, heading },
    //     } = location;
    // setRegion({ ...region, longitude, latitude });
    //       setCompass(Math.floor(heading));
    //     });
    //   })();
  }, []);

  useEffect(() => {
    const { latitude, longitude } = region;
    (async () => {
      const data = await fetch(
        `https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&ll=${latitude},${longitude}&v=20180323`
      );
      const res = await data.json();
      const randomNumber = Math.round(Math.random() * 7);
      setLocationName(res.response.venues[randomNumber].name);
    })();
  }, [region]);

  return (
    <MapView
      region={region}
      provider={PROVIDER_GOOGLE}
      customMapStyle={MapStyle}
      style={styles.map}
    >
      <Marker
        ref={markerRef}
        coordinate={region}
        draggable={!status}
        onDragEnd={(e) => onMarkerDragEnd(e)}
        // rotation={compass}
      >
        <Image style={styles.marker} source={CarMarker} />
        <Callout style={styles.calloutContainer} tooltip={true}>
          <Text style={styles.calloutText}>{locationName}</Text>
        </Callout>
      </Marker>
    </MapView>
  );
};

export default Map;
