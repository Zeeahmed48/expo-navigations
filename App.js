import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet } from 'react-native';
import Routes from './src/Config/Routes';

export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);
  return (
    <NavigationContainer style={styles.container}>
      <Routes />
      <StatusBar style='auto' backgroundColor='#fff' />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
