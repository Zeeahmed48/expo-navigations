import React from 'react';
import DriverDashboard from '../../Views/DriverDashboard';
import Home from '../../Views/Home';
import DropOff from '../../Views/DropOff';
import SelectCar from '../../Views/SelectCar';
import TripStarted from '../../Views/TripStarted';
import { createStackNavigator } from '@react-navigation/stack';

const DashboardStack = ({ user }) => {
  const Stack = createStackNavigator();

  console.log('Role based screens***', user?.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user?.role === 'driver' ? (
        <>
          <Stack.Screen name='dashboard'>
            {(props) => <DriverDashboard driver={user} {...props} />}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name='dashboard'>
            {(props) => <Home user={user} {...props} />}
          </Stack.Screen>
          <Stack.Screen name='dropoff' component={DropOff} />
          <Stack.Screen name='selectcars'>
            {(props) => <SelectCar {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen name='tripStarted' component={TripStarted} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default DashboardStack;
