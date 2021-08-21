import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Facebook from 'expo-facebook';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { loginUsingToken } from '../Firebase';
//Screens
import Login from '../../Views/Auth/Login';
import Home from '../../Views/Home';
import Trips from '../../Views/Trips';
import TripDetails from '../../Views/TripDetails';
import DropOff from '../../Views/DropOff';
import SelectCar from '../../Views/SelectCar';
import CustomDrawer from '../../Components/CustomDrawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Routes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState({
    name: '',
    picture: '',
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('loginToken');
      if (token) {
        setIsLoading(false);
        setSignedIn(true);
        const facebookProfileData = await loginUsingToken(token);
        ///// DO SOMETHING WITH FACEBOOK PROFILE DATA /////
        const { name, picture } =
          facebookProfileData?.additionalUserInfo?.profile;
        setUser({
          ...user,
          name,
          picture: picture?.data?.url,
        });
      }
    })();
  }, []);

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
              setSignedIn={setSignedIn}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              {...props}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name='drawernavigator'>
          {(props) => (
            <DrawerNavigator setSignedIn={setSignedIn} user={user} {...props} />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const DrawerNavigator = ({ setSignedIn, user }) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#e2b052' },
        headerTintColor: '#383838',
      }}
      drawerContent={(props) => (
        <CustomDrawer {...props} setSignedIn={setSignedIn} user={user} />
      )}
    >
      <Drawer.Screen
        options={{
          title: 'Dashboard',
        }}
        name='DashboardStack'
        component={DashboardStack}
      />
      <Drawer.Screen
        options={{
          title: 'Trips',
        }}
        name='TripStack'
        component={TripStack}
      />
    </Drawer.Navigator>
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
