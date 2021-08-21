import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Drawer } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome } from '@expo/vector-icons';
import { signOut } from '../../Config/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerContent = (props) => {
  const { setSignedIn, user } = props;
  const { name, picture } = user;

  const logOut = async () => {
    try {
      await signOut();
      await AsyncStorage.removeItem('loginToken');
      console.log('signOut successfully');
      setSignedIn(false);
    } catch ({ message }) {
      console.log('logout error ===>', message);
    }
  };

  return (
    <View style={styles.root}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfo}>
            <Avatar.Image
              source={{
                uri: picture ? picture : null,
              }}
              size={50}
            />
            <Title style={styles.title}>{name}</Title>
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              inactiveTintColor='#e2b052'
              icon={() => (
                <Icon name='view-dashboard' size={28} color='#e2b052' />
              )}
              label='Home'
              onPress={() => {
                props.navigation.navigate('DashboardStack');
              }}
            />
            <DrawerItem
              inactiveTintColor='#e2b052'
              icon={() => <FontAwesome name='user' size={28} color='#e2b052' />}
              label='Trips'
              onPress={() => {
                props.navigation.navigate('TripStack');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section>
        <DrawerItem
          inactiveTintColor='#e2b052'
          icon={() => <Icon name='exit-to-app' size={28} color='#e2b052' />}
          label='Log Out'
          onPress={logOut}
        />
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#383838',
    marginTop: 15,
  },
  drawerContent: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  title: {
    color: '#e2b052',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  drawerSection: {
    marginTop: 15,
  },
});

export default DrawerContent;
