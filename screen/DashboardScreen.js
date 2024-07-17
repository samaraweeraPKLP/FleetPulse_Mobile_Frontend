import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { USER_PROFILE_ENDPOINT } from '../apiConfig';
import axios from 'axios';

const DashboardScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        Alert.alert('Error', 'Username not found. Please log in again.');
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found. Please log in again.');
        return;
      }

      const response = await axios.get(`${USER_PROFILE_ENDPOINT}?username=${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to fetch user profile. Please try again.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  const handleUserProfile = () => {
    navigation.navigate('User Profile');
  };

  const handleResetPassword = () => {
    navigation.navigate('Change Password');
  };

  const handleNewTrip = () => {
    navigation.navigate('TripStartAnimationScreen');
  };

  const handleFuelRefill = () => {
    navigation.navigate('Fuel Refill');
  };

  const handleNewAccident = () => {
    navigation.navigate('Accidents');
  };

  const handleMaintenance = () => {
    navigation.navigate('Vehicle Maintenance');
  };

  const { firstName, profilePicture } = userData || {};
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.toLocaleString('default', { month: 'long' })}/${currentDate.getFullYear()}`;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileRectangle}>
          <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleUserProfile}>
            <View style={styles.userProfile}>
              {profilePicture ? (
                <Image
                  source={{ uri: `data:image/png;base64,${profilePicture}` }}
                  style={styles.avatar}
                />
              ) : (
                <Image
                  source={require('../assets/man.png')}
                  style={styles.avatar}
                />
              )}
            </View>
          </TouchableOpacity>
            <TouchableOpacity onPress={handleResetPassword}>
              <Text style={styles.changePasswordText}>Change{'\n'}password</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              Hello, {`${firstName}`}
            </Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>
      </View>
      <View style={styles.midContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.rectangle} onPress={handleNewTrip}>
            <Ionicons name="car" size={50} color="black" />
            <Text style={styles.boxText}>Start Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rectangle} onPress={handleFuelRefill}>
            <Ionicons name="funnel-sharp" size={50} color="black" />
            <Text style={styles.boxText}>Fuel Refill</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.rectangle} onPress={handleNewAccident}>
            <FontAwesome5 name="car-crash" size={50} color="black" />
            <Text style={styles.boxText}>New Accident</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rectangle} onPress={handleMaintenance}>
            <Ionicons name="construct" size={50} color="black" />
            <Text style={styles.boxText}>Maintenance</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  midContainer: {
    flexDirection: 'column',
    marginBottom: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  changePasswordText:{
    marginTop:5,
    textAlign: 'center',
  },
  rectangle: {
    width: 160,
    height: 160,
    backgroundColor: '#f3e3ca',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 5,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileRectangle: {
    flexDirection: 'row',
    width: '90%',
    height: 160,
    backgroundColor: '#f3e3ca',
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 100,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginLeft: 20,
  },
  userInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:"15%"
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  date: {
    fontSize: 16,
    color: 'gray'
  },
  label: {
    margin: 5,
    color: '#393970',
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default DashboardScreen;
