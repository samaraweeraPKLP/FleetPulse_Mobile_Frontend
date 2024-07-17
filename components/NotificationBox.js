import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationRectangle = ({ type, title, body, onClose }) => {
  // Function to get the current date and time
  const getCurrentDateTime = () => {
    const currentDate = new Date();
    return `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close-circle" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.type}>{type}Notification Type</Text>
      <Text style={styles.title}>Notification Title :{title}Notification Title show here.</Text>
      <Text style={styles.body}>Notification Body :{body}Notification Message Will appear here</Text>
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTime}>{getCurrentDateTime()}</Text>
        <Ionicons name="time" size={16} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width:'100',
    height:'auto'
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'#393970',
    marginTop:20
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  body: {
    fontSize: 13,
    marginBottom: 5,
    fontWeight:'400',
    color:'gray'
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 'auto',
  },
  dateTime: {
    fontSize: 14,
    marginRight: 5,
  },
});

export default NotificationRectangle;
