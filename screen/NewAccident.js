import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert, Keyboard, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { GET_ALL_VEHICLES_ENDPOINT, CREATE_ACCIDENT_ENDPOINT } from '../apiConfig'; // Add your API endpoint for creating an accident

export default function NewAccidentScreen({ navigation }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState('');
  const [nic, setNic] = useState('');
  const [loss, setLoss] = useState('');
  const [driverInjuredStatus, setDriverInjuredStatus] = useState('');
  const [helperInjuredStatus, setHelperInjuredStatus] = useState('');
  const [vehicleDamagedStatus, setVehicleDamagedStatus] = useState('');
  const [specialNotes, setSpecialNotes] = useState(''); // Added state for special notes
  const [images, setImages] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(GET_ALL_VEHICLES_ENDPOINT);
        setVehicles(response.data.map(vehicle => ({
          label: vehicle.vehicleRegistrationNo,
          value: vehicle.vehicleRegistrationNo
        })));
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', `An error occurred while fetching vehicles: ${error.message}`);
        setLoading(false);
      }
    };

    fetchVehicles();

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
    // Reset all input fields
    setDate(new Date().toISOString().split('T')[0]);
    setLocation('');
    setVehicleRegistrationNumber('');
    setNic('');
    setLoss('');
    setDriverInjuredStatus('');
    setHelperInjuredStatus('');
    setVehicleDamagedStatus('');
    setSpecialNotes(''); // Reset special notes
    setImages([]);
  };

  const handleSave = async () => {
    if (!date || !location || !vehicleRegistrationNumber || !nic || !loss || !driverInjuredStatus || !helperInjuredStatus || !vehicleDamagedStatus) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('Venue', location);
    formData.append('DateTime', date);
    formData.append('SpecialNotes', specialNotes); // Add special notes
    formData.append('Loss', loss);
    formData.append('DriverInjuredStatus', driverInjuredStatus);
    formData.append('HelperInjuredStatus', helperInjuredStatus);
    formData.append('VehicleDamagedStatus', vehicleDamagedStatus);
    formData.append('NIC', nic);
    formData.append('VehicleRegistrationNo', vehicleRegistrationNumber);

    images.forEach((image, index) => {
      formData.append('Photos', {
        uri: image.uri,
        type: 'image/jpeg', // Update if needed based on image type
        name: `photo${index}.jpg`,
      });
    });

    try {
      const response = await axios.post(CREATE_ACCIDENT_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Accident report saved successfully.');
        handleCancel(); // Reset form fields
        navigation.goBack(); // Navigate back after successful save
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred while saving the accident report: ${error.message}`);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.selected]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <BackArrow onPress={handleBack} />
        <Text style={styles.headerTitle}>New Accident Report</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            
            <View style={styles.dateTimeItem}>
              <Text style={styles.title}>Date</Text>
              <TextInput
                style={[styles.input, styles.dateTimeInput]}
                placeholder="Date (YYYY-MM-DD)"
                onChangeText={text => setDate(text)}
                value={date}
              />
            </View>

            <Text style={styles.title}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              onChangeText={text => setLocation(text)}
              value={location}
            />

            <Text style={styles.title}>Vehicle Registration Number</Text>
            <RNPickerSelect
              onValueChange={value => setVehicleRegistrationNumber(value)}
              items={vehicles}
              placeholder={{ label: 'Select Vehicle Registration Number', value: null }}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              value={vehicleRegistrationNumber}
            />

            <Text style={styles.title}>NIC</Text>
            <TextInput
              style={styles.input}
              placeholder="NIC"
              onChangeText={text => setNic(text)}
              value={nic}
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
              style={[styles.input, styles.specialNotesInput]}
              placeholder="Special Notes (Optional)"
              onChangeText={text => setSpecialNotes(text)}
              value={specialNotes}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.title}>Upload Images</Text>
            <View style={styles.imageContainer}>
              {images.map((image, index) => (
                <Image key={index} source={{ uri: image.uri }} style={styles.image} />
              ))}
              {images.length < 5 && (
                <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
                  <Text style={styles.imageUploadButtonText}>+</Text>
                </TouchableOpacity>
              )}
            </View>
            

            <View style={[styles.buttonContainer, isKeyboardVisible && styles.buttonContainerSmall]}>
              <Button title="Cancel" onPress={handleCancel} type="cancel" />
              <Button title="Save" onPress={handleSave} />
            </View>
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
    paddingBottom: 120, // Ensure there's enough space at the bottom for the buttons
  },
  innerContainer: {
    paddingBottom: 20,
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
  dateTimeItem: {
    marginBottom: 15,
  },
  dateTimeInput: {
    width: '75%',
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
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: '12%',
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  imageUploadButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e8ee',
    borderColor: '#494873',
    borderWidth: 1,
    borderRadius: 5,
  },
  imageUploadButtonText: {
    fontSize: 24,
    color: '#494873',
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
  specialNotesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 18,
    fontWeight: '500',
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
