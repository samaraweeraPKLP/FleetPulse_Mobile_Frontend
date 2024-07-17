import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';

export default function MaintenanceScreen({ navigation }) {
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [costforMaintenanceendDate, setCostforMaintenance] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [replaceParts, setReplaceParts] = useState('');
  
  const handleBack = () => {
    navigation.goBack();
  };
  const handleCancel = () => {
    // Reset all input fields
    setVehicleRegistrationNumber('');
    setMaintenanceDate('');
    setCostforMaintenance('');
    setServiceProvider('');
    setReplaceParts(''); // Clear error message
  };
  const handleSave = () => {
  };
  return (
    <View style={styles.container}>
   
      
      <BackArrow onPress={handleBack} />
      
      <Text style={styles.HeaderTitle}>Vehicle Maintenance</Text>

      <Text style={styles.title}>Vehicle Registration Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Vehicle Registration Number"
        onChangeText={text => setVehicleRegistrationNumber(text)}
        value={vehicleRegistrationNumber}
      />
      <Text style={styles.title}>Maintenance Date</Text>
      <TextInput
        style={styles.input}
        placeholder="Maintenance Date (DD/MM/YYY)"
        onChangeText={text => setMaintenanceDate(text)}
        value={maintenanceDate}
      />
      <Text style={styles.title}>Cost for Maintenance</Text>
      <TextInput
        style={styles.input}
        placeholder="Rs.xxxxx"
        onChangeText={text => setCostforMaintenance(text)}
        value={costforMaintenanceendDate}
      />
      <Text style={styles.title}>Service Provider</Text>
      <TextInput
        style={styles.input}
        placeholder="Service Provider"
        onChangeText={text => setServiceProvider(text)}
        value={serviceProvider}
      />
      <Text style={styles.title}>Replace Parts</Text>
      <TextInput
        style={styles.input2}
        placeholder="Replace Parts"
        onChangeText={text => setReplaceParts(text)}
        value={replaceParts}
      />
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={handleCancel} style={[styles.button, styles.cancelButton]} />
        <Button title="Save" onPress={handleSave} style={styles.button} />
      </View>
      <View style={styles.footer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e8ee',
  },
  HeaderTitle: {
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
  input2: {
    width: '75%',
    height: 100,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontWeight: '500',
    marginBottom: 20,
    backgroundColor: '#f7f7f7',
    marginLeft: '12%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '14%',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
