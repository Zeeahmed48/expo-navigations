import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Login = ({ isLoading, loginWithFacebook }) => {
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size='large' color='#e2b052' />
      ) : (
        <View>
          <View style={{ margin: 8 }}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => loginWithFacebook('user')}
            >
              <Text style={styles.btnText}>Log in as user</Text>
            </TouchableOpacity>
          </View>
          <View style={{ margin: 8 }}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => loginWithFacebook('driver')}
            >
              <Text style={styles.btnText}>Log in as driver</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#e2b052',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 8,
    // justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
  startBtn: {},
  startBtnText: {},
});

export default Login;
