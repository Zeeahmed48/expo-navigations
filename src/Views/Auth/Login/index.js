import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { signInWithFacebook } from '../../../Config/Firebase';

const Login = ({ setSignedIn, isLoading, setIsLoading, navigation }) => {
  const loginWithFacebook = async (loginType) => {
    try {
      setIsLoading(true);
      const { type, token } = await signInWithFacebook();
      switch (type) {
        case 'success': {
          setSignedIn(true);
          ///// SAVING TOKEN /////
          await AsyncStorage.setItem('loginToken', token);
        }
        case 'cancel': {
          setIsLoading(false);
          setSignedIn(false);
        }
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size='large' color='#e2b052' />
      ) : (
        <View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => loginWithFacebook('user')}
          >
            <Text style={styles.btnText}>Log in as user</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => loginWithFacebook('driver')}
          >
            <Text style={styles.btnText}>Log in as driver</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    backgroundColor: '#e2b052',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  btnText: {
    color: '#fff',
  },
});

export default Login;
