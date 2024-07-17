import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';

export default function NewAccidentScreen({ navigation }) {
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [location, setLocation] = useState('');
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState('');
  const [driverNic, setDriverNic] = useState('');
  const [helperNic, setHelperNic] = useState('');
  const [loss, setLoss] = useState('');
  const [images, setImages] = useState([]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    // Reset all input fields
    setDate(new Date().toLocaleDateString());
    setLocation('');
    setVehicleRegistrationNumber('');
    setDriverNic('');
    setHelperNic('');
    setLoss('');
    setImages([]);
  };

  const handleSave = () => {
    // Handle save functionality
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            <BackArrow onPress={handleBack} />
            <Text style={styles.headerTitle}>New Accident Report</Text>

            <View style={styles.dateTimeItem}>
              <Text style={styles.title}>Date</Text>
              <TextInput
                style={[styles.input, styles.dateTimeInput]}
                placeholder="Date (DD/MM/YYYY)"
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
            <Picker
              selectedValue={vehicleRegistrationNumber}
              style={styles.picker}
              onValueChange={(itemValue) => setVehicleRegistrationNumber(itemValue)}
            >
              <Picker.Item label="Select Vehicle" value="" />
              <Picker.Item label="ABC-1234" value="ABC-1234" />
              <Picker.Item label="DEF-5678" value="DEF-5678" />
              <Picker.Item label="GHI-9012" value="GHI-9012" />
            </Picker>

            <Text style={styles.title}>Driver NIC</Text>
            <TextInput
              style={styles.input}
              placeholder="Driver NIC"
              onChangeText={text => setDriverNic(text)}
              value={driverNic}
            />

            <Text style={styles.title}>Helper NIC</Text>
            <TextInput
              style={styles.input}
              placeholder="Helper NIC"
              onChangeText={text => setHelperNic(text)}
              value={helperNic}
            />

            <Text style={styles.title}>Loss</Text>
            <TextInput
              style={styles.input}
              placeholder="Loss"
              onChangeText={text => setLoss(text)}
              value={loss}
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

            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={handleCancel} style={[styles.button, styles.cancelButton]} />
              <Button title="Save" onPress={handleSave} style={styles.button} />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}></View>
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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 60, // Ensure content does not overlap footer
  },
  innerContainer: {
    paddingBottom: 20, // Ensure content does not overlap footer
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
    width: '75%',
    height: 30,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontWeight: '500',
    marginBottom: '5%',
    backgroundColor: '#f7f7f7',
    marginLeft: '12%',
  },
  picker: {
    width: '75%',
    height: 40,
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
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
