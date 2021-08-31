import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';

const firebaseConfig = {
  apiKey: 'AIzaSyBpJkmGVSHEm_qubL0a_Jvyx--vKcKxBsg',
  authDomain: 'react-todo-app-981c3.firebaseapp.com',
  projectId: 'react-todo-app-981c3',
  storageBucket: 'react-todo-app-981c3.appspot.com',
  messagingSenderId: '643736516444',
  appId: '1:643736516444:web:3541a4639380204458b399',
  measurementId: 'G-71DQCTN1ED',
};

// Handling error which causes double initializing
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const appId = '328746008952558';

const storeUserLocation = (userId, location) => {
  return db
    .collection('users')
    .doc(userId)
    .update({ ...location });
};

const storeDriverLocation = (driverId, location) => {
  return db
    .collection('drivers')
    .doc(driverId)
    .update({ ...location });
};

const requestSingleDriver = (driverId, request) => {
  return db
    .collection('drivers')
    .doc(driverId)
    .update({ ...request });
};

const signInWithFacebook = async () => {
  const permissions = ['public_profile', 'email'];
  Facebook.initializeAsync({
    appId,
  });
  return Facebook.logInWithReadPermissionsAsync({
    permissions,
  });
};

const loginUsingToken = async (token) => {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL); // Set persistent auth state
  const credential = firebase.auth.FacebookAuthProvider.credential(token);
  return await firebase.auth().signInWithCredential(credential); // Sign in with Facebook credential
};

const signOut = async () => {
  await Facebook.initializeAsync({
    appId,
  });
  return Facebook.logOutAsync();
};

export {
  db,
  auth,
  storeUserLocation,
  storeDriverLocation,
  requestSingleDriver,
  signInWithFacebook,
  loginUsingToken,
  signOut,
};
