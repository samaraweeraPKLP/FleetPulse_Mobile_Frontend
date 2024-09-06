import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';
import { GET_ALL_VEHICLES_ENDPOINT, USER_PROFILE_ENDPOINT, GET_MAINTENANCE_TYPES_ENDPOINT, ADD_VEHICLE_MAINTENANCE_ENDPOINT } from '../apiConfig';

export default function MaintenanceScreen({ navigation }) {
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [costForMaintenance, setCostForMaintenance] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [replaceParts, setReplaceParts] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [selectedMaintenanceType, setSelectedMaintenanceType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const fetchUserProfileAndData = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const token = await AsyncStorage.getItem('token');

        if (!username || !token) {
          setLoading(false);
          Alert.alert('Error', 'Username or token not found. Please log in again.');
          return;
        }

        const [userResponse, vehiclesResponse, maintenanceTypesResponse] = await Promise.all([
          axios.get(`${USER_PROFILE_ENDPOINT}?username=${username}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(GET_ALL_VEHICLES_ENDPOINT, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(GET_MAINTENANCE_TYPES_ENDPOINT, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setVehicles(vehiclesResponse.data.map(vehicle => ({
          label: vehicle.vehicleRegistrationNo,
          value: vehicle.vehicleRegistrationNo,
          id: vehicle.vehicleId,
        })));

        setMaintenanceTypes(maintenanceTypesResponse.data.map(type => ({
          label: type.typeName,
          value: type.id,
        })));

        // Set the maintenance date to the current date
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        setMaintenanceDate(formattedDate);

        setLoading(false);
      } catch (error) {
        Alert.alert('Error', `An error occurred while fetching data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchUserProfileAndData();

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
    setMaintenanceDate('');
    setCostForMaintenance('');
    setServiceProvider('');
    setReplaceParts('');
    setSpecialNote('');
    setSelectedMaintenanceType(null);
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'Token not found. Please log in again.');
        return;
      }

      const selectedVehicle = vehicles.find(vehicle => vehicle.value === vehicleRegistrationNumber);
      const vehicleId = selectedVehicle?.id;

      if (!vehicleId) {
        Alert.alert('Error', 'Vehicle ID not found for the selected registration number.');
        return;
      }

      const maintenanceData = {
        maintenanceId: 0,
        maintenanceDate: new Date(maintenanceDate).toISOString(),
        cost: parseFloat(costForMaintenance),
        partsReplaced: replaceParts,
        serviceProvider: serviceProvider,
        specialNotes: specialNote,
        vehicleId: vehicleId,
        vehicleRegistrationNo: vehicleRegistrationNumber,
        vehicleMaintenanceTypeId: selectedMaintenanceType,
        typeName: maintenanceTypes.find(type => type.value === selectedMaintenanceType)?.label || '',
        status: true,
      };

      console.log('Sending the following data to the backend:', maintenanceData);

      const response = await axios.post(ADD_VEHICLE_MAINTENANCE_ENDPOINT, maintenanceData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        Alert.alert('Success', 'Vehicle maintenance added successfully.');
        handleCancel();
      } else {
        Alert.alert('Error', `Failed to add vehicle maintenance: ${response.data.message}`);
      }
    } catch (error) {
      console.error('An error occurred while saving vehicle maintenance:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `An error occurred: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <BackArrow onPress={handleBack} />
        <Text style={styles.headerTitle}>Vehicle Maintenance</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Vehicle Registration Number</Text>
          <RNPickerSelect
            onValueChange={value => setVehicleRegistrationNumber(value)}
            items={vehicles}
            placeholder={{ label: 'Select Vehicle Registration Number', value: null }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            value={vehicleRegistrationNumber}
          />

          <Text style={styles.title}>Maintenance Date</Text>
          <TextInput
            style={[styles.input, styles.dateTimeInput]}
            placeholder="Date (YYYY-MM-DD)"
            onChangeText={text => setMaintenanceDate(text)}
            value={maintenanceDate}
          />

          <Text style={styles.title}>Cost for Maintenance</Text>
          <TextInput
            style={styles.input}
            placeholder="Rs.xxxxx"
            onChangeText={text => setCostForMaintenance(text)}
            value={costForMaintenance}
            keyboardType="numeric"
          />

          <Text style={styles.title}>Service Provider</Text>
          <TextInput
            style={styles.input}
            placeholder="Service Provider"
            onChangeText={text => setServiceProvider(text)}
            value={serviceProvider}
          />

          <Text style={styles.title}>Maintenance Type</Text>
          <RNPickerSelect
            onValueChange={value => setSelectedMaintenanceType(value)}
            items={maintenanceTypes}
            placeholder={{ label: 'Select Maintenance Type', value: null }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            value={selectedMaintenanceType}
          />

          <Text style={styles.title}>Replace Parts</Text>
          <TextInput
            style={styles.input2}
            placeholder="Replace Parts"
            onChangeText={text => setReplaceParts(text)}
            value={replaceParts}
          />

          <Text style={styles.title}>Special Note</Text>
          <TextInput
            style={styles.input2}
            placeholder="Enter any special notes"
            onChangeText={text => setSpecialNote(text)}
            value={specialNote}
          />

          <View style={[styles.buttonContainer, isKeyboardVisible && styles.buttonContainerSmall]}>
            <Button title="Cancel" onPress={handleCancel} type="cancel" />
            <Button title="Save" onPress={handleSave} />
          </View>
        </ScrollView>

        {!isKeyboardVisible && <View style={styles.footer}><Text style={styles.footerText}>© 2024 G3 Technology. All Rights Reserved.</Text></View>}
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
    paddingBottom: 120,
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
  input2: {
    fontSize: 18,
    width: '75%',
    height: 100,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontWeight: '500',
    marginBottom: '5%',
    backgroundColor: '#f7f7f7',
    marginLeft: '12%',
  },
  dateTimeInput: {
    width: '62%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '14%',
    alignItems: 'center',
    marginTop: '2%',
    marginBottom: 20,
  },
  buttonContainerSmall: {
    marginTop: 10,
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center',
  },
  footerText: {
    color: '#e3e8ee',
    textAlign: 'center',
    fontSize: 12,
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
    marginBottom: '5%',
    color: '#000',
    width: '75%',
    height: 35,
  },
});
