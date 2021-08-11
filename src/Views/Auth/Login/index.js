import React, { useState } from 'react';
import * as Facebook from 'expo-facebook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Login = ({ setSignedIn, isLoading, setIsLoading }) => {
  const loginWithFacebook = async () => {
    try {
      setIsLoading(true);
      await Facebook.initializeAsync({
        appId: '328746008952558',
      });
      const { type, token, userId } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile'],
        });
      if (type === 'success') {
        setSignedIn(true);
        setIsLoading(false);
        const dataForStorage = {
          userId: userId,
          token: token,
        };
        const jsonData = JSON.stringify(dataForStorage);
        await AsyncStorage.setItem('userData', jsonData);
      } else {
        setSignedIn(false);
        setIsLoading(false);
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size='large' color='red' />
      ) : (
        <TouchableOpacity style={styles.btn} onPress={loginWithFacebook}>
          <Text style={styles.btnText}>Login with facebook</Text>
        </TouchableOpacity>
      )}
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

export default Login;
