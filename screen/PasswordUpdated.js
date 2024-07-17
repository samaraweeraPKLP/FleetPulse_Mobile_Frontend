import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Header from './components/header';

export default function UPasswordUpdated({ user }) {
    const [passwordUpdated, setPasswordUpdated] = useState(false);
  
    const handleLogin = () => {
      // Add login functionality here
      // For demonstration purposes, we'll just log a message
      console.log('Logged in');
    };
  
    const handlePasswordUpdate = () => {
      // Set the state to indicate that the password has been updated
      setPasswordUpdated(true);
      // Reset the state after 3 seconds
      setTimeout(() => {
        setPasswordUpdated(false);
      }, 3000);
    };
  
    return (
      <View style={styles.container}>
       
        <View style={styles.content}>
          <Image source={require('./assets/Ok-amico.png')} style={styles.okImage} />
          <Text style={styles.passwordUpdatedText}>Password updated!</Text>
          <Text style={styles.UpdatedText}>Your Password has been updated.</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
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
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    okImage: {
      width: 200,
      height: 200,
      marginBottom: 20,
    },
    passwordUpdatedText:{
        fontSize :20,
        fontWeight:'bold',
        color:'#e3b17e',
        marginBottom: 10,
    },
    UpdatedText:{
        color:'gray',
        marginBottom: 10,

    },
    loginButton: {
      backgroundColor: '#393970',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      width: '80%',
    },
    loginButtonText: {
      color: 'white',
      fontSize: 16,
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