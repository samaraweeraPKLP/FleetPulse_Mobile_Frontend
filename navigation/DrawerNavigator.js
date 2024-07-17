import React, { useState, useEffect, useCallback } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import {View,StyleSheet,TouchableOpacity,Image  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { USER_PROFILE_ENDPOINT } from '../apiConfig';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

import DashboardScreen from '../screen/DashboardScreen';
import MaintenanceScreen from '../screen/Maintenance';
import NewTripScreen from '../screen/NewTrip';
import FuelRefillScreen from '../screen/FuelRefill';
import NewAccidentScreen from '../screen/NewAccident';
import UserProfileScreen from '../screen/UserProfile';
import EndTripScreen from '../screen/EndTrip';
import ChangePasswordScreen from '../screen/ChangePassword';
import AnimationScreen from '../screen/AnimationScreen';
import TripStartAnimationScreen from '../screen/TripStartAnimation';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState('');
  const [shouldRefresh, setShouldRefresh] = useState(false);

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername);

      const response = await axios.get(USER_PROFILE_ENDPOINT, {
        params: {
          username: storedUsername,
        },
      });

      if (response.data.profilePicture) {
        setProfilePicture(response.data.profilePicture);
      } else {
        setProfilePicture(null); // No profile picture, use default
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfilePicture(null); // Handle error state
    }
  };

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Use useFocusEffect to refetch profile data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [shouldRefresh])
  );

  // Callback to trigger refresh
  const triggerRefresh = () => {
    setShouldRefresh(prev => !prev);
  };
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerActiveTintColor: '#e3b17e',
        drawerInactiveTintColor: '#fff',
        drawerStyle: styles.drawerContent,
        headerStyle: {
          backgroundColor: '#393970',
        },
        headerTintColor: '#fff',
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('User Profile')}>
              {profilePicture ? (
                <Image
                  key={profilePicture} // Adding key to force re-render
                  source={{ uri: `data:image/jpeg;base64,${profilePicture}` }}
                  style={styles.avatar}
                />
              ) : (
                <Image
                  source={require('../assets/man.png')}
                  style={styles.avatar}
                />
              )}
            </TouchableOpacity>
          </View>
        ),
      })}
    >
      {/* Drawer screens */}
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="New Trip" component={NewTripScreen} />
      <Drawer.Screen name="Fuel Refill" component={FuelRefillScreen} />
      <Drawer.Screen name="Accidents" component={NewAccidentScreen} />
      <Drawer.Screen name="Vehicle Maintenance" component={MaintenanceScreen} />
      {/* Pass username, profilePicture, and triggerRefresh to UserProfileScreen */}
      <Drawer.Screen name="User Profile">
        {(props) => <UserProfileScreen {...props} username={username} profilePicture={profilePicture} triggerRefresh={triggerRefresh} />}
      </Drawer.Screen>
      <Drawer.Screen name="Change Password" component={ChangePasswordScreen} />
      {/* Use options to hide End Trip screen label */}
      <Drawer.Screen name="End Trip" component={EndTripScreen} options={{ drawerLabel: () => null }} />
      <Drawer.Screen name="AnimationScreen" component={AnimationScreen} options={{ drawerLabel: () => null, headerShown: false }} />
      <Drawer.Screen name="TripStartAnimationScreen" component={TripStartAnimationScreen} options={{ drawerLabel: () => null, headerShown: false }} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#393970',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    padding: 10,
  },
  avatar: {
    height: 28,
    width: 28,
    borderRadius: 14, // Ensure the avatar is circular
  },
});

export default DrawerNavigator;