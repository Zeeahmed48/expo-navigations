import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Facebook from 'expo-facebook';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
//Screens
import Home from '../../Views/Home';
import Chat from '../../Views/Chat';
import Profile from '../../Views/Profile';
import Login from '../../Views/Auth/Login';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Routes = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData !== null) {
        const { userId, token } = JSON.parse(storedData);
        const jsonData = await fetch(
          `https://graph.facebook.com/${userId}?fields=id,name,email,picture&access_token=${token}`
        );
        const userData = await jsonData.json();
        // setUserName(userData.name);
        // setProfilePic(userData.picture.data.url);
        setSignedIn(true);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {!signedIn ? (
        <AuthStack
          setSignedIn={setSignedIn}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        <DrawerNavigator setSignedIn={setSignedIn} />
      )}
    </>
  );
};

const DrawerNavigator = ({ setSignedIn }) => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} setSignedIn={setSignedIn} />
      )}
    >
      <Drawer.Screen
        options={{
          drawerIcon: () => <Entypo name='home' size={24} color='red' />,
        }}
        name='Home'
        component={Home}
      />
      <Drawer.Screen
        options={{
          title: 'Profile',
          drawerIcon: () => <FontAwesome name='user' size={24} color='red' />,
        }}
        name='ProfileStack'
        component={ProfileStack}
      />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = (props) => {
  const { setSignedIn } = props;
  const logOut = async () => {
    await Facebook.initializeAsync({
      appId: '328746008952558',
    });
    await Facebook.logOutAsync();
    await AsyncStorage.removeItem('userData');
    setSignedIn(false);
  };

  return (
    <DrawerContentScrollView>
      <DrawerItemList {...props} />
      <DrawerItem label='Log Out' onPress={logOut} />
    </DrawerContentScrollView>
  );
};

const AuthStack = ({ setSignedIn, isLoading, setIsLoading }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Login'>
        {() => (
          <Login
            setSignedIn={setSignedIn}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
  x;
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen name='Chat' component={Chat} />
    </Stack.Navigator>
  );
};

export default Routes;
