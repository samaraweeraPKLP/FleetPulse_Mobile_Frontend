import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert ,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';
import { USER_PROFILE_ENDPOINT, GET_ALL_VEHICLES_ENDPOINT, ADD_ACCIDENT_ENDPOINT } from '../apiConfig';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

export default function NewAccidentScreen({ navigation }) {
  const [nicNumber, setNicNumber] = useState('');
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [venue, setVenue] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [loss, setLoss] = useState('');
  const [driverInjuredStatus, setDriverInjuredStatus] = useState(false);
  const [helperInjuredStatus, setHelperInjuredStatus] = useState(false);
  const [vehicleDamagedStatus, setVehicleDamagedStatus] = useState(false);
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

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
        const formattedTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
        setSelectedTime(formattedTime);

        setLoading(false);
      } catch (error) {
        Alert.alert('Error', `An error occurred while fetching user profile: ${error.message}`);
        setLoading(false);
      }
    };

    fetchUserProfileAndVehicles();

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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    setVehicleRegistrationNumber('');
    setVenue('');
    setSpecialNotes('');
    setLoss('');
    setDriverInjuredStatus(false);
    setHelperInjuredStatus(false);
    setVehicleDamagedStatus(false);
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
    const formattedTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
    setSelectedTime(formattedTime);
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found. Please log in again.');
        return;
      }

      const accidentData = {
        NIC: nicNumber,
        VehicleRegistrationNo: vehicleRegistrationNumber,
        Date: selectedDate,
        Time: selectedTime,
        Venue: venue,
        SpecialNotes: specialNotes,
        Loss: loss,
        DriverInjuredStatus: driverInjuredStatus ? 1 : 0,
        HelperInjuredStatus: helperInjuredStatus ? 1 : 0,
        VehicleDamagedStatus: vehicleDamagedStatus ? 1 : 0,
        Status: true
      };

      console.log('Accident Data:', accidentData);

      const response = await axios.post(ADD_ACCIDENT_ENDPOINT, accidentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Accident data saved successfully.');
        handleCancel(); // Reset form fields
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to save accident data.');
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <BackArrow onPress={handleBack} />
      <Text style={styles.headerTitle}>Enter Accident Details</Text>

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

        <Text style={styles.title}>Venue</Text>
        <TextInput
          style={styles.input}
          placeholder="Venue"
          onChangeText={text => setVenue(text)}
          value={venue}
        />

        <Text style={styles.title}>Loss</Text>
        <TextInput
          style={styles.input}
          placeholder="Loss"
          onChangeText={text => setLoss(text)}
          value={loss}
        />

<Text style={styles.title}>Driver Injured Status</Text>
            <View style={styles.buttonGroup}>
              
              <TouchableOpacity
                style={[styles.button, driverInjuredStatus === '0' && styles.selectedButton]}
                onPress={() => setDriverInjuredStatus('0')}
              >
                <Text style={[styles.buttonText, driverInjuredStatus === '0' && styles.selectedButtonText]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, driverInjuredStatus === '1' && styles.selectedButton]}
                onPress={() => setDriverInjuredStatus('1')}
              >
                <Text style={[styles.buttonText, driverInjuredStatus === '1' && styles.selectedButtonText]}>Yes</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Helper Injured Status</Text>
            <View style={styles.buttonGroup}>
              
              <TouchableOpacity
                style={[styles.button, helperInjuredStatus === '0' && styles.selectedButton]}
                onPress={() => setHelperInjuredStatus('0')}
              >
                <Text style={[styles.buttonText, helperInjuredStatus === '0' && styles.selectedButtonText]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, helperInjuredStatus === '1' && styles.selectedButton]}
                onPress={() => setHelperInjuredStatus('1')}
              >
                <Text style={[styles.buttonText, helperInjuredStatus === '1' && styles.selectedButtonText]}>Yes</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Vehicle Damaged Status</Text>
            <View style={styles.buttonGroup}>
             
              <TouchableOpacity
                style={[styles.button, vehicleDamagedStatus === '0' && styles.selectedButton]}
                onPress={() => setVehicleDamagedStatus('0')}
              >
                <Text style={[styles.buttonText, vehicleDamagedStatus === '0' && styles.selectedButtonText]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, vehicleDamagedStatus === '1' && styles.selectedButton]}
                onPress={() => setVehicleDamagedStatus('1')}
              >
                <Text style={[styles.buttonText, vehicleDamagedStatus === '1' && styles.selectedButtonText]}>Yes</Text>
              </TouchableOpacity>
            </View>

        <Text style={styles.title}>Special Notes</Text>
        <TextInput
          style={styles.input}
          placeholder="Special Notes"
          onChangeText={text => setSpecialNotes(text)}
          value={specialNotes}
        />

        <Text style={styles.title}>Upload Images</Text>
        <View style={[styles.buttonContainer, isKeyboardVisible && styles.buttonContainerSmall]}>
          <Button title="Cancel" onPress={handleCancel} type="cancel" />
          <Button title="Save" onPress={handleSave} type="primary" />
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
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '77%',
    marginLeft: '11%',
  },
  button: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    height: 40,
  },
  selectedButton: {
    backgroundColor: '#393970',
  },
  buttonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 18,
  },
  selectedButtonText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '14%',
    alignItems: 'center',
    marginTop: '5%',
    marginBottom: 20, // Space for the footer
  },
  buttonContainerSmall: {
    marginTop: 10,
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
    paddingRight: 30,
    backgroundColor: '#f7f7f7',
    marginLeft: '12%',
    marginBottom: 20,
    width: '75%',
    height: 35,
  }
});
