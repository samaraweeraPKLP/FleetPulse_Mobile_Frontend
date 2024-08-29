import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { USER_PROFILE_ENDPOINT, GET_ALL_VEHICLES_ENDPOINT } from '../apiConfig';

export default function FuelRefillScreen({ navigation }) {
  const [nicNumber, setNicNumber] = useState('');
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [literCount, setLiterCount] = useState('');
  const [refillType, setRefillType] = useState('');
  const [cost, setCost] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const fetchUserProfileAndVehicles = async () => {
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

        // Automatically set date and time to the current values
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        setSelectedDate(formattedDate);
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        setSelectedTime(formattedTime);
  
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', `An error occurred while fetching user profile: ${error.message}`);
        setLoading(false);
      }
    };
  
    fetchUserProfileAndVehicles();

    // Add listeners for keyboard events
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    // Reset all input fields
    setVehicleRegistrationNumber('');
    setLiterCount('');
    setRefillType('');
    setCost('');
  };

  const handleSave = () => {
    // Handle save functionality
    // You can add the logic to save the fuel refill data here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <BackArrow onPress={handleBack} />
        <Text style={styles.headerTitle}>Enter Fule Refill Details</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>NIC No</Text>
          <Text style={styles.value}>{nicNumber}</Text>

          <Text style={styles.title}>Vehicle Registration Number</Text>
          <RNPickerSelect
            onValueChange={value => setVehicleRegistrationNumber(value)}
            items={vehicles}
            placeholder={{ label: 'Select Vehicle Registration Number', value: null }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            value={vehicleRegistrationNumber}
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
                placeholder="Time (HH:mm)"
                onChangeText={text => setSelectedTime(text)}
                value={selectedTime}
              />
            </View>
          </View>

          <Text style={styles.title}>Liter Count</Text>
          <TextInput
            style={styles.input}
            placeholder="Liter Count"
            onChangeText={text => setLiterCount(text)}
            value={literCount}
            keyboardType="numeric"
          />

          <Text style={styles.title}>Refill Type</Text>
          <RNPickerSelect
            onValueChange={value => setRefillType(value)}
            items={[
              { label: 'In Station', value: 'In Station' },
              { label: 'Out Station', value: 'Out Station' }
            ]}
            placeholder={{ label: 'Select Refill Type', value: null }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            value={refillType}
          />

          <Text style={styles.title}>Cost</Text>
          <TextInput
            style={styles.input}
            placeholder="Cost"
            onChangeText={text => setCost(text)}
            value={cost}
            keyboardType="numeric"
          />

          <View style={[styles.buttonContainer, isKeyboardVisible && styles.buttonContainerSmall]}>
            <Button title="Cancel" onPress={handleCancel} type="cancel" />
            <Button title="Save" onPress={handleSave} style={styles.button} />
          </View>
        </ScrollView>

        {!isKeyboardVisible && <View style={styles.footer}></View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e3e8ee',
  },
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
    marginBottom: 10,
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
  },
  buttonContainerSmall: {
    marginTop: 5, // Adjust as per your spacing preference
    marginBottom: 5
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
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
    paddingRight: 30, // to ensure the text is not overlapping the dropdown icon
    backgroundColor: '#f7f7f7',
    marginLeft: '12%',
    marginBottom: '5%',
    color: '#000',
    width: '75%',
    height: 35,
  },
});

export { FuelRefillScreen };
