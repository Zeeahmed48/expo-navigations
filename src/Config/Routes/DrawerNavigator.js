import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../../Components/CustomDrawer';
import DashboardStack from './DashboardStack';
import TripStack from './TripStack';

const DrawerNavigator = ({ setSignedIn, user }) => {
  const Drawer = createDrawerNavigator();

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
      >
        {() => <DashboardStack user={user} />}
      </Drawer.Screen>
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

export default DrawerNavigator;
