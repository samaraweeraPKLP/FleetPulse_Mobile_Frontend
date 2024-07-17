import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { TRIP_ENDPOINT } from '../apiConfig';
import axios from 'axios';

const EndTripScreen = ({ route, navigation }) => {
  const { NIC, VehicleRegistrationNo, StartDate, StartTime, StartMeterValue, Status } = route.params.tripData;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [endMeterValue, setEndMeterValue] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedEndDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format for endDate
    setEndDate(formattedEndDate);

    const formattedEndTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}:${today.getSeconds().toString().padStart(2, '0')}`; // HH:mm:ss format for endTime
    setEndTime(formattedEndTime);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  const handleCancel = () => {
    setEndMeterValue('');
  };

  const handleAddTrip = async () => {
    // Check if any required field is empty
    if (!endDate || !endTime || !endMeterValue) {
      Alert.alert('Error', 'Please fill in all fields to end the trip.');
      return;
    }
  
    try {
      const tripData = {
        NIC: NIC,
        VehicleRegistrationNo: VehicleRegistrationNo,
        StartDate: StartDate,
        StartTime: StartTime,
        StartMeterValue: StartMeterValue,
        EndDate: endDate,
        EndTime: endTime,
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
  
      // Clear input fields
      setEndMeterValue('');
  
      Alert.alert('Success', 'Trip added successfully');
      navigation.navigate('Dashboard'); // Navigate to Dashboard after successful trip addition
    } catch (error) {
      console.error('Error adding trip:', error);
      Alert.alert('Error', 'Failed to add trip. Please try again.');
    }
  };
  
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      
      <Text style={styles.headerTitle}>Enter Trip Details (End)</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>NIC No</Text>
        <Text style={styles.detail}>{NIC}</Text>

        <Text style={styles.title}>Vehicle Registration Number</Text>
        <Text style={styles.detail}>{VehicleRegistrationNo}</Text>

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeItem}>
            <Text style={styles.title}>End Date</Text>
            <TextInput
              style={[styles.input, styles.dateTimeInput]}
              placeholder="End Date (YYYY-MM-DD)"
              onChangeText={text => setEndDate(text)}
              value={endDate}
            />
          </View>
          
          <View style={styles.dateTimeItem}>
            <Text style={styles.title}>End Time</Text>
            <TextInput
              style={[styles.input, styles.dateTimeInput]}
              placeholder="End Time (HH:mm:ss)"
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

        <View style={[styles.buttonContainer, isKeyboardVisible && styles.buttonContainerSmall]}>
        <Button title="Cancel" onPress={handleCancel} type="cancel" />
          <Button title="End" onPress={handleAddTrip} style={styles.button} />
          
        </View>
      </ScrollView>

      {!isKeyboardVisible && <View style={styles.footer}></View>}
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
    justifyContent: 'space-between', // Ensure space between content and footer
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
  detail: {
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
    marginTop: '30%',
  },
  buttonContainerSmall: {
    marginTop: 10, // Adjust as per your spacing preference
    marginBottom: 5,
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e8ee',
  },
});

export default EndTripScreen;
