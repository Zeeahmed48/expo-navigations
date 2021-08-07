import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Profile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Chat')}
      >
        <Text style={styles.btnText}>Contact</Text>
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
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  btnText: {
    color: '#fff',
  },
});

export default Profile;
