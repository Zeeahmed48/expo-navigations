import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../Views/Home';
import Chat from '../../Views/Chat';
import Profile from '../../Views/Profile';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Routes = () => {
  return (
    <Drawer.Navigator>
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

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen name='Chat' component={Chat} />
    </Stack.Navigator>
  );
};

export default Routes;
