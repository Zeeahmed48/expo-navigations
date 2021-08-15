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
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//Screens
import Login from '../../Views/Auth/Login';
import Home from '../../Views/Home';
import Trips from '../../Views/Trips';
import TripDetails from '../../Views/TripDetails';
import DropOff from '../../Views/DropOff';
import SelectCar from '../../Views/SelectCar';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Routes = () => {
  const [signedIn, setSignedIn] = useState(true);
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
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!signedIn ? (
        <Stack.Screen name='authstack'>
          {() => (
            <AuthStack
              setSignedIn={setSignedIn}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name='drawernavigator'>
          {() => <DrawerNavigator setSignedIn={setSignedIn} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const DrawerNavigator = ({ setSignedIn }) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#e2b052' },
        headerTintColor: '#383838',
        drawerStyle: {
          backgroundColor: '#383838',
          marginTop: 90,
        },
        drawerItemStyle: {
          backgroundColor: 'rgb(99, 99, 99)',
          margin: 0,
          marginBottom: 20,
          borderRadius: 0,
        },
        drawerLabelStyle: {
          color: '#e2b052',
        },
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} setSignedIn={setSignedIn} />
      )}
    >
      <Drawer.Screen
        options={{
          title: 'Dashboard',
          drawerIcon: () => (
            <Icon name='view-dashboard' size={28} color='#e2b052' />
          ),
        }}
        name='DashboardStack'
        component={DashboardStack}
      />
      <Drawer.Screen
        options={{
          title: 'Trips',
          drawerIcon: () => (
            <FontAwesome name='user' size={28} color='#e2b052' />
          ),
        }}
        name='TripStack'
        component={TripStack}
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
};

const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='dashboard' component={Home} />
      <Stack.Screen name='dropoff' component={DropOff} />
      <Stack.Screen name='selectcars' component={SelectCar} />
    </Stack.Navigator>
  );
};

const TripStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Trips' component={Trips} />
      <Stack.Screen name='TripDetails' component={TripDetails} />
    </Stack.Navigator>
  );
};

export default Routes;
