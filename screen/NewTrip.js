import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';
import { USER_PROFILE_ENDPOINT, GET_ALL_VEHICLES_ENDPOINT } from '../apiConfig';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

export default function NewTripScreen({ navigation }) {
  const [nicNumber, setNicNumber] = useState('');
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [meterValue, setMeterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const token = await AsyncStorage.getItem('token');
  
        if (!username || !token) {
          setLoading(false);
          Alert.alert('Error', 'Username or token not found. Please log in again.');
          return;
        }

        const [userResponse, vehiclesResponse] = await Promise.all([
          axios.get(`${USER_PROFILE_ENDPOINT}?username=${username}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(GET_ALL_VEHICLES_ENDPOINT, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setNicNumber(userResponse.data?.nic);
        setVehicles(vehiclesResponse.data.map(vehicle => ({
          label: vehicle.vehicleRegistrationNo,
          value: vehicle.vehicleRegistrationNo
        })));

        // Automatically set start date to today's date (YYYY-MM-DD)
        const today = new Date();
        const formattedStartDate = today.toISOString().split('T')[0];
        setSelectedDate(formattedStartDate);

        // Automatically set start time to current time in 24-hour format (HH:mm:ss)
        const formattedStartTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}:${today.getSeconds().toString().padStart(2, '0')}`;
        setSelectedTime(formattedStartTime);
  
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', `An error occurred while fetching user profile: ${error.message}`);
        setLoading(false);
      }
    };
  
    fetchUserProfile();

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setVehicleRegistrationNumber('');
      setMeterValue('');
    });

    return unsubscribe;
  }, [navigation]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    setVehicleRegistrationNumber('');
    setMeterValue('');
  };

  const handleStart = async () => {
    if (!vehicleRegistrationNumber || !selectedDate || !selectedTime || !meterValue) {
      Alert.alert('Error', 'Please fill in all fields to start the trip.');
      return;
    }
  
    try {
      const tripData = {
        NIC: nicNumber,
        VehicleRegistrationNo: vehicleRegistrationNumber,
        Date: selectedDate,
        StartTime: selectedTime,
        StartMeterValue: parseFloat(meterValue),
        Status: true,
      };
  
      // Optionally, you can log the trip data
      console.log('Sending trip data:', tripData);
  
      // Navigate to the AnimationScreen with tripData as a parameter
      navigation.navigate('AnimationScreen', { tripData });
    } catch (error) {
      console.error('Error starting trip:', error);
      Alert.alert('Error', 'Failed to start trip. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <BackArrow onPress={handleBack} />
      <Text style={styles.headerTitle}>Enter Trip Details</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>NIC No</Text>
        <Text style={styles.value}>{nicNumber}</Text>

        <Text style={styles.title}>Vehicle Registration Number</Text>
        <RNPickerSelect
          onValueChange={value => setVehicleRegistrationNumber(value)}
          items={vehicles}
          placeholder={{ label: 'Select Vehicle Registration Number', value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false} // Ensure iOS and Android styles match
          value={vehicleRegistrationNumber} // Set the default selected value here
        />

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeItem}>
            <Text style={styles.title}>Date</Text>
            <TextInput
              style={[styles.input, styles.dateTimeInput]}
              placeholder="Date (YYYY-MM-DD)"
              onChangeText={text => setSelectedDate(text)}
              value={selectedDate}
            />
          </View>

          <View style={styles.dateTimeItem}>
            <Text style={styles.title}>Time</Text>
            <TextInput
              style={[styles.input, styles.dateTimeInput]}
              placeholder="Time (HH:mm:ss)"
              onChangeText={text => setSelectedTime(text)}
              value={selectedTime}
            />
          </View>
        </View>

        <Text style={styles.title}>Meter Value</Text>
        <TextInput
          style={styles.input}
          placeholder="Meter Value"
          onChangeText={text => setMeterValue(text)}
          value={meterValue}
          keyboardType="numeric"
        />

        <View style={[styles.buttonContainer, isKeyboardVisible && styles.buttonContainerSmall]}>
          <Button title="Cancel" onPress={handleCancel} type="cancel" />
          <Button title="Start" onPress={handleStart} style={styles.button} />
        </View>
      </ScrollView>
      {!isKeyboardVisible && <View style={styles.footer}><Text style={styles.footerText}>© 2024 G3 Technology. All Rights Reserved.</Text></View>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e8ee',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#393970',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 15,
    marginLeft: '12%',
    color: '#494873',
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    width: '75%',
    height: 30,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: '5%',
    backgroundColor: '#f7f7f7',
    marginLeft: '12%',
  },
  input: {
    fontSize: 18,
    width: '75%',
    height: 30,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontWeight: '500',
    marginBottom: '5%',
    backgroundColor: '#f7f7f7',
    marginLeft: '12%',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5%',
    marginLeft: '6%',
  },
  dateTimeItem: {
    flex: 1,
    marginRight: '2%',
  },
  dateTimeInput: {
    width: '62%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '14%',
    alignItems: 'center',
    marginTop: '30%'
  },
  buttonContainerSmall: {
    marginTop: 10,
    marginBottom: 5
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#e3e8ee',
    textAlign: 'center',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e8ee',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#f7f7f7',
    borderRadius: 5,
    paddingRight: 30,
    backgroundColor: '#f7f7f7',
    marginLeft: '12%',
    marginBottom: 20,
    width: '75%',
    height: 35,
  }
});
