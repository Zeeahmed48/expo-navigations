import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Trips from '../../Views/Trips';
import TripDetails from '../../Views/TripDetails';

const TripStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Trips' component={Trips} />
      <Stack.Screen name='TripDetails' component={TripDetails} />
    </Stack.Navigator>
  );
};

export default TripStack;
