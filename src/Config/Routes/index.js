import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { loginUsingToken, signInWithFacebook, db, auth } from '../Firebase';
import 'react-native-get-random-values';
// Navigations
import DrawerNavigator from './DrawerNavigator';
import Login from '../../Views/Auth/Login';

const Routes = () => {
  const Stack = createStackNavigator();
  const [isLoading, setIsLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log('user persitance ===>', user);
      }
    });
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     const auth = await AsyncStorage.getItem('auth');
  //     const authObj = JSON.parse(auth);
  //     if (authObj) {
  //       const { token, userId } = authObj;
  //       await loginUsingToken(token);
  //       const userData = await db.collection('users').doc(userId).get();
  //       console.log('firebase user from useEffect db ===>', userData.data());
  //       setUser(userData.data());
  //       setIsLoading(false);
  //       setSignedIn(true);
  //     }
  //   })();
  // }, []);

  const loginWithFacebook = async (loginRole) => {
    try {
      setIsLoading(true);
      const { type, token, userId } = await signInWithFacebook();
      switch (type) {
        case 'success': {
          ///// SAVING USER ROLE AND TOKEN /////
          const authJson = JSON.stringify({ token, userId });
          await AsyncStorage.setItem('auth', authJson);
          const facebookProfileData = await loginUsingToken(token);
          ///// DO SOMETHING WITH FACEBOOK PROFILE DATA /////
          const { id, name, email, picture } =
            facebookProfileData?.additionalUserInfo?.profile;
          const profilePicture = picture?.data?.url;
          if (loginRole === 'user') {
            await addUser(id, {
              role: loginRole,
              id,
              name,
              email,
              profilePicture,
            });
            const userData = await db.collection('users').doc(userId).get();
            setUser(userData.data());
          } else if (loginRole === 'driver') {
            await addDrvier(id, {
              role: loginRole,
              id,
              name,
              email,
              profilePicture,
              request: null,
            });
            const userData = await db.collection('drivers').doc(userId).get();
            setUser(userData.data());
          }
          setIsLoading(false);
          setSignedIn(true);
        }
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
      setIsLoading(false);
    }
  };

  const addUser = (userId, userData) => {
    return db.collection('users').doc(userId).set(userData);
  };

  const addDrvier = (userId, userData) => {
    return db.collection('drivers').doc(userId).set(userData);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!signedIn ? (
        <Stack.Screen name='Login'>
          {(props) => (
            <Login
              loginWithFacebook={loginWithFacebook}
              isLoading={isLoading}
              {...props}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name='drawernavigator'>
          {(props) => (
            <DrawerNavigator
              setSignedIn={setSignedIn}
              {...props}
              user={user && user}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default Routes;
