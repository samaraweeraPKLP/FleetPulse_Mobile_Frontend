import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import axios from 'axios';
import { RESET_PASSWORD_ADMIN } from '../apiConfig';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';

export default function AdminRestPasswordVerification({ navigation }) {
  const [resetPasswordVerification, setResetPasswordVerification] = useState('');
  const [emailError, setEmailError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Keyboard is shown
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleAdminVerification = async () => {
    if (!resetPasswordVerification) {
      setEmailError('Please enter an email address.');
      return;
    }
  
    // Email validation regex
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(resetPasswordVerification)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
  
    try {
      const response = await axios.post(RESET_PASSWORD_ADMIN, {
        emailAddress: resetPasswordVerification,
        // Add other required fields if necessary
      });
  
      if (response.status === 200) {
        Alert.alert('Request Sent', 'Password reset request sent successfully.');
        navigation.navigate('AdminResetPasswordVerificationCode');
      } else if (response.status === 404) {
        Alert.alert('Email Not Found', 'The entered email address was not found in the database.');
      } else {
        Alert.alert('Error', 'Failed to send password reset request.');
      }
    } catch (error) {
      Alert.alert('Email Not Found', 'The entered email address was not found');
    }
  };
  

  const handleBack = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.container2}></View>
          <View style={styles.BackArrowcontainer}>
            <BackArrow onPress={handleBack} />
            <Text style={styles.headerTitle}>Reset Password Verification</Text>
          </View>
          
          <Image
            source={require('../assets/Email campaign-pana.png')}
            style={[styles.image,keyboardVisible && styles.inputKeyboardVisible]}
          />
          <Text style={[styles.message,keyboardVisible && styles.inputKeyboardVisible]}>Please enter your email address to continue.</Text>
          <Text style={[styles.title,keyboardVisible && styles.inputKeyboardVisible]}>Email</Text>
          <TextInput
            style={[styles.input, emailError && styles.inputError, keyboardVisible && styles.inputKeyboardVisible]}
            placeholder="Enter your email"
            onChangeText={text => {
              setResetPasswordVerification(text);
              setEmailError('');
            }}
            value={resetPasswordVerification}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <View style={[styles.buttonContainer,keyboardVisible && styles.inputKeyboardVisible]}>
            <Button title="Request to Reset Password" onPress={handleAdminVerification} style={styles.button} />
          </View>
          
          {/* Spacer to push content above the footer */}
          <View style={{ height: 60 }} />
        </View>
      </TouchableWithoutFeedback>

      {/* Conditional rendering of footer based on keyboard visibility */}
      {!keyboardVisible && (
        <View style={styles.footer}></View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e8ee',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#393970',
    height: 70,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 60, // Ensure there is space for the footer
  },
  BackArrowcontainer: {
    marginTop: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#393970',
    alignSelf: 'center',
    marginBottom: 30,
  },
  image: {
    width: 230,
    height: 200,
    alignSelf: 'center',
    marginTop: '5%',
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 15,
    marginHorizontal: '12%',
    color: '#494873',
    textAlign: 'center',
    marginTop: '8%',
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: '12%',
    color: '#494873',
    marginTop: '10%',
  },
  input: {
    width: '75%',
    height: 30,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontWeight: '500',
    marginBottom: '5%',
    backgroundColor: '#f7f7f7',
    alignSelf: 'center',
    marginTop: '12%',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  inputKeyboardVisible: {
    marginBottom: '1%', 
    marginTop: '1%', 
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginLeft: '12%',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '55%',
    alignSelf: 'center',
    marginBottom: '20%',
    marginTop: '10%',
  },
  button: {
    width: '100%',
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});
