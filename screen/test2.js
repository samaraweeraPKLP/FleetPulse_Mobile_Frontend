import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { TRIP_ENDPOINT } from '../apiConfig'; // Adjust path as needed
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';

const EndTripScreen = ({ route, navigation }) => {
  const { NIC, VehicleRegistrationNo, StartDate, StartTime, StartMeterValue, Status } = route.params.tripData;

  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [endMeterValue, setEndMeterValue] = useState('');

  useEffect(() => {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
  
    // Determine AM/PM and format hours
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Handle midnight (0) as 12 AM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    // Construct the formatted end time
    const formattedEndTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
  
    // Initialize state variables
    setEndDate(today.toISOString().split('T')[0]); // YYYY-MM-DD format for endDate
    setEndTime(formattedEndTime); // HH:mm AM/PM format for endTime
  }, []);
  

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    // Reset all input fields
    setEndMeterValue('');
  };

  const handleAddTrip = async () => {
    try {
      const formattedEndTime = endTime + ':00';

      const tripData = {
        NIC: NIC,
        VehicleRegistrationNo: VehicleRegistrationNo,
        StartDate: StartDate,
        StartTime: StartTime,
        StartMeterValue: StartMeterValue,
        EndDate: endDate,
        EndTime: formattedEndTime,
        EndMeterValue: parseFloat(endMeterValue),
        Status: Status,
      };

      console.log('Sending trip data:', tripData);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found. Please log in again.');
        return;
      }

      await axios.post(TRIP_ENDPOINT, tripData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Alert.alert('Success', 'Trip added successfully');
      navigation.navigate('Dashboard'); // Navigate to Dashboard after successful trip addition
    } catch (error) {
      console.error('Error adding trip:', error);
      Alert.alert('Error', 'Failed to add trip. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <BackArrow onPress={handleBack} />
      <Text style={styles.headerTitle}>Enter Trip Details (End)</Text>

      <Text style={styles.title}>NIC No</Text>
      <Text style={styles.detail}>{NIC}</Text>

      <Text style={styles.title}>Vehicle Registration Number</Text>
      <Text style={styles.detail}>{VehicleRegistrationNo}</Text>

      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeItem}>
          <Text style={styles.title}>End Date</Text>
          <TextInput
            style={[styles.input, styles.dateTimeInput]}
            placeholder="End Date (DD/MM/YYYY)"
            onChangeText={text => setEndDate(text)}
            value={endDate}
          />
        </View>
        
        <View style={styles.dateTimeItem}>
          <Text style={styles.title}>End Time</Text>
          <TextInput
            style={[styles.input, styles.dateTimeInput]}
            placeholder="End Time (HH:MM)"
            onChangeText={text => setEndTime(text)}
            value={endTime}
          />
        </View>
      </View>

      <Text style={styles.title}>Final Meter Value</Text>
      <TextInput
        style={styles.input}
        placeholder="Final Meter Value"
        onChangeText={text => setEndMeterValue(text)}
        value={endMeterValue}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button title="End" onPress={handleAddTrip} style={styles.button} />
        <Button title="Cancel" onPress={handleCancel} style={[styles.button, styles.cancelButton]} />
      </View>

      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e8ee',
    justifyContent: 'space-between', // Ensure space between content and footer
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
  detail: {
    fontSize:18,
    fontWeight: '500',
    width: '75%',
    height: 30,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: '5%',
    backgroundColor: '#f7f7f7',
    marginLeft: '12%',
  
  },
  value: {
    fontSize:18,
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
    fontSize:18,
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
    width: '50%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '14%',
    alignItems: 'center',
    marginTop:"50%"
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
  },
});

export default EndTripScreen;
