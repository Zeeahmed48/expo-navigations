import React, { useEffect, useState, useRef } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapPin from '../../../assets/images/map_pin.png';
import { MapStyle, styles } from './styles';

const Map = ({ region, setRegion, selected, status }) => {
  const clientId = 'VJIEZGBRDDZHMTMGJTHZYWL3L2URSSXNJV0VFNU0I2V1FFNA';
  const clientSecret = 'FDZU2U0J0BKB3VFRCGAVPXTYSM1ZXAWBWG0AJRQMFPE1E44Z';
  const markerRef = useRef(null);
  const [locationName, setLocationName] = useState('');

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
        setRegion({ ...region, latitude: lat, longitude: lng });
      }
    })();
  }, []);

  useEffect(() => {
    if (region?.latitude && region?.longitude) {
      const { latitude, longitude } = region;
      (async () => {
        const data = await fetch(
          `https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&ll=${latitude},${longitude}&v=20180323`
        );
        const res = await data.json();
        setLocationName(res?.response?.venues[0]?.name);
      })();
    }
  }, [region]);

  return (
    <View style={styles.container}>
      {region?.latitude && region?.longitude ? (
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
            title={locationName && locationName}
          >
            <Image style={styles.marker} source={MapPin} />
          </Marker>
        </MapView>
      ) : (
        <ActivityIndicator size='large' color='#e2b052' />
      )}
    </View>
  );
};

export default Map;
