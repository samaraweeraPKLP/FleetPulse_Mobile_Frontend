import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, useDrawerStatus } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { USER_PROFILE_ENDPOINT } from '../apiConfig';

const DrawerContent = (props) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const drawerStatus = useDrawerStatus();

  const fetchUserProfile = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const token = await AsyncStorage.getItem('token');

      if (!username || !token) {
        setLoading(false);
        Alert.alert('Error', 'Username or token not found. Please log in again.');
        return;
      }

      const response = await axios.get(`${USER_PROFILE_ENDPOINT}?username=${username}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUserProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', `An error occurred while fetching user profile: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (drawerStatus === 'open') {
      triggerRefresh();
    }
  }, [drawerStatus]);

  const triggerRefresh = () => {
    setLoading(true);
    fetchUserProfile();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      Alert.alert('Error', 'An error occurred while logging out. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#494873" />
      </View>
    );
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/splashscreen.png')}
          style={styles.drawerImage}
        />
        <Image
          source={userProfile && userProfile.profilePicture
            ? { uri: `data:image/png;base64,${userProfile.profilePicture}` }
            : require('../assets/man.png')}
          style={styles.avatar}
        />
        <Text style={styles.email}>{userProfile ? userProfile.emailAddress : 'Email not available'}</Text>
      </View>

      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  drawerImage: {
    width: '80%',
    height: 30,
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  drawerItemsContainer: {
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 10,
    marginTop: 30,
  },
  email: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 20,
    marginTop: 10,
    color: '#e3e1e1',
  },
  logoutButton: {
    backgroundColor: '#393970',
    borderWidth: 2,
    borderColor: '#e3e8ee',
    borderRadius: 5,
    paddingVertical: 5,
    alignItems: 'center',
    height:40,
    width:280,
  },
  logoutButtonText: {
    color: '#e3e8ee',
    fontWeight: 'bold',
    fontSize:16
  }
});

export default DrawerContent;
