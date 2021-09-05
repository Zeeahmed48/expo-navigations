import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';

const firebaseConfig = {
  /// firebase config ///
};

// Handling error which causes double initializing
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const appId = { APP_ID };

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
