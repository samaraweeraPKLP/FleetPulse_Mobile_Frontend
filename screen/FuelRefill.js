import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';

export default function FuelRefillScreen({ navigation }) {
  const [nicNumber, setNicNumber] = useState('');
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
  const [selectedTime, setSelectedTime] = useState(new Date().toLocaleTimeString());
  const [literCount, setLiterCount] = useState('');
  const [refillType, setRefillType] = useState('');
  const [cost, setCost] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    // Reset all input fields
    setNicNumber('');
    setVehicleRegistrationNumber('');
    setLiterCount('');
    setRefillType('');
    setCost('');
  };

  const handleSave = () => {
    // Handle save functionality
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
            <Text style={styles.headerTitle}>Enter Refill Details</Text>

            <Text style={styles.title}>NIC No</Text>
            <TextInput
              style={styles.input}
              placeholder="NIC No"
              onChangeText={text => setNicNumber(text)}
              value={nicNumber}
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

            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <Text style={styles.title}>Date</Text>
                <TextInput
                  style={[styles.input, styles.dateTimeInput]}
                  placeholder="Date (DD/MM/YYYY)"
                  onChangeText={text => setSelectedDate(text)}
                  value={selectedDate}
                />
              </View>
              
              <View style={styles.dateTimeItem}>
                <Text style={styles.title}>Time</Text>
                <TextInput
                  style={[styles.input, styles.dateTimeInput]}
                  placeholder="Time (HH:MM)"
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
            />

            <Text style={styles.title}>Refill Type</Text>
            <Picker
              selectedValue={refillType}
              style={styles.picker}
              onValueChange={(itemValue) => setRefillType(itemValue)}
            >
              <Picker.Item label="Select Refill Type" value="" />
              <Picker.Item label="In station" value="In station" />
              <Picker.Item label="Out Station" value="Out Station" />
            </Picker>

            <Text style={styles.title}>Cost</Text>
            <TextInput
              style={styles.input}
              placeholder="Cost"
              onChangeText={text => setCost(text)}
              value={cost}
            />
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
    width: '90%',
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
