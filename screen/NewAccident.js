import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';
import { USER_PROFILE_ENDPOINT, GET_ALL_VEHICLES_ENDPOINT, ADD_ACCIDENT_ENDPOINT } from '../apiConfig';

export default function NewAccidentScreen({ navigation }) {
  const [nicNumber, setNicNumber] = useState('');
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [venue, setVenue] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [loss, setLoss] = useState('');
  const [driverInjuredStatus, setDriverInjuredStatus] = useState(false);
  const [helperInjuredStatus, setHelperInjuredStatus] = useState(false);
  const [vehicleDamagedStatus, setVehicleDamagedStatus] = useState(false);
  const [images, setImages] = useState([]);
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

        const now = new Date();
        const formattedDateTime = `${now.toISOString().split('T')[0]}  ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;
        setDateTime(formattedDateTime);

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
    const now = new Date();
    const formattedDateTime = `${now.toISOString().split('T')[0]}  ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;
    setDateTime(formattedDateTime);
    setImages([]);
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append('Venue', venue);
      formData.append('DateTime', dateTime.replace('  ', 'T'));
      formData.append('SpecialNotes', specialNotes);
      formData.append('Loss', parseFloat(loss).toString());
      formData.append('DriverInjuredStatus', driverInjuredStatus.toString());
      formData.append('HelperInjuredStatus', helperInjuredStatus.toString());
      formData.append('VehicleDamagedStatus', vehicleDamagedStatus.toString());
      formData.append('VehicleRegistrationNumber', vehicleRegistrationNumber);
      formData.append('DriverNIC', nicNumber);
      formData.append('Status', 'true');

      // Add images to form data
      images.forEach((image, index) => {
        formData.append('Photos', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `image${index}.jpg`,
        });
      });

      const response = await axios.post(ADD_ACCIDENT_ENDPOINT, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Accident data saved successfully.');
        handleCancel();
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to save accident data.');
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'Permission to access the gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0]]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <BackArrow onPress={handleBack} />
      <Text style={styles.headerTitle}>Add Accident Details</Text>

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

        <Text style={styles.title}>Date and Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Date and Time (YYYY-MM-DDTHH:mm:ss)"
          onChangeText={text => setDateTime(text)}
          value={dateTime}
        />

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
          keyboardType="numeric"
        />

        <Text style={styles.title}>Driver Injured Status</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, driverInjuredStatus === false && styles.selectedButton]}
            onPress={() => setDriverInjuredStatus(false)}
          >
            <Text style={[styles.buttonText, driverInjuredStatus === false && styles.selectedButtonText]}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, driverInjuredStatus === true && styles.selectedButton]}
            onPress={() => setDriverInjuredStatus(true)}
          >
            <Text style={[styles.buttonText, driverInjuredStatus === true && styles.selectedButtonText]}>Yes</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Helper Injured Status</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, helperInjuredStatus === false && styles.selectedButton]}
            onPress={() => setHelperInjuredStatus(false)}
          >
            <Text style={[styles.buttonText, helperInjuredStatus === false && styles.selectedButtonText]}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, helperInjuredStatus === true && styles.selectedButton]}
            onPress={() => setHelperInjuredStatus(true)}
          >
            <Text style={[styles.buttonText, helperInjuredStatus === true && styles.selectedButtonText]}>Yes</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Vehicle Damaged Status</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, vehicleDamagedStatus === false && styles.selectedButton]}
            onPress={() => setVehicleDamagedStatus(false)}
          >
            <Text style={[styles.buttonText, vehicleDamagedStatus === false && styles.selectedButtonText]}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, vehicleDamagedStatus === true && styles.selectedButton]}
            onPress={() => setVehicleDamagedStatus(true)}
          >
            <Text style={[styles.buttonText, vehicleDamagedStatus === true && styles.selectedButtonText]}>Yes</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Special Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Special Notes"
          onChangeText={text => setSpecialNotes(text)}
          value={specialNotes}
          multiline
        />

        <Text style={styles.title}>Upload Images</Text>
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.uri }}
              style={styles.image}
            />
          ))}
        </View>
        <View style={[styles.buttonContainer, isKeyboardVisible && styles.buttonContainerSmall]}>
            <Button title="Cancel" onPress={handleCancel} type="cancel" />
            <Button title="Save" onPress={handleSave} />
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
    padding: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 15,
    width: '78%',
    height: 40,
    marginLeft: '12%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#393970',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '#393970',
  },
  buttonText: {
    color: '#393970',
    fontWeight: 'bold',
    
  },
  selectedButtonText: {
    color: '#fff',
  },
  


  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

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
    marginTop: 10, // Adjust as per your spacing preference
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
    marginLeft: '12%',
  },
  image: {
    width: 80,
    height: 80,
    margin: 4,
    borderRadius: 8,
  },
  addButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 4,
    backgroundColor: '#f7f7f7',
    marginLeft: '12%'
  },
  addButtonText: {
    fontSize: 36,
    color: '#393970',
  },
});


const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 14,
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
