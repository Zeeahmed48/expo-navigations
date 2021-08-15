import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Trips = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('TripDetails')}
      >
        <Text style={styles.btnText}>View Trip Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#e2b052',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  btnText: {
    color: '#fff',
  },
});

export default Trips;
