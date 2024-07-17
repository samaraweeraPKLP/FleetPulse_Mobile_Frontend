import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, TextInput, View, Image, KeyboardAvoidingView, Platform, Keyboard, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Button from '../components/Button'; // Assuming you have a Button component defined
import BackArrow from '../components/BackArrow'; // Assuming you have a BackArrow component defined
import { USER_PROFILE_ENDPOINT, CHANGE_ENDPOINT } from '../apiConfig'; // Assuming you have API endpoint constants defined in apiConfig.js
import Entypo from 'react-native-vector-icons/Entypo';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const resetForm = useCallback(() => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const response = await axios.get(`${USER_PROFILE_ENDPOINT}?username=${username}`);
      
      if (response.data) {
        if (response.data.profilePicture) {
          setProfilePicture(`data:image/png;base64,${response.data.profilePicture}`);
        } else {
          setProfilePicture(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetForm();
      fetchUserProfile();
    }, [resetForm, fetchUserProfile])
  );

  useEffect(() => {
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

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
  
    try {
      const username = await AsyncStorage.getItem('username');
      const response = await axios.post(CHANGE_ENDPOINT, {
        Username: username,
        OldPassword: oldPassword,
        NewPassword: newPassword,
      });
  
      if (response.data.status) {
        Alert.alert('Success', 'Password changed successfully');
        navigation.navigate('Login');
      } else {
        setErrorMessage(response.data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while trying to change the password');
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <BackArrow onPress={handleBack} />
      <Text style={styles.HeaderTitle}>Change Password</Text>
      <View style={[styles.avatarContainer, isKeyboardVisible && styles.avatarContainerSmall]}>
        <Image
          source={profilePicture ? { uri: profilePicture } : require('../assets/man.png')}
          style={[styles.avatar, isKeyboardVisible && styles.avatarZoomOut]}
        />
      </View>
      <View style={[styles.inputsPlace, isKeyboardVisible && styles.inputsPlaceSmall]}>
        <Text style={styles.title}>Old Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Old Password"
            onChangeText={text => setOldPassword(text)}
            value={oldPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Entypo name={isPasswordVisible ? 'eye-with-line' : 'eye'} style={styles.passwordIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>New Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            onChangeText={text => setNewPassword(text)}
            value={newPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Entypo name={isPasswordVisible ? 'eye-with-line' : 'eye'} style={styles.passwordIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Confirm New Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            onChangeText={text => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Entypo name={isPasswordVisible ? 'eye-with-line' : 'eye'} style={styles.passwordIcon} />
          </TouchableOpacity>
        </View>
      </View>
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      <View style={[styles.buttonContainer, isKeyboardVisible && styles.buttonContainerSmall]}>
        <Button title="Cancel" onPress={handleCancel} type="cancel" />
        <Button title="Save" onPress={handleResetPassword} style={styles.button} />
      </View>
      <View style={[styles.footer, isKeyboardVisible && styles.footerHidden]}></View>
    </KeyboardAvoidingView>
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
    marginBottom: 10,
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerHidden: {
    display: 'none',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '14%',
    marginTop: '5%',
    alignItems: 'center',
  },
  buttonContainerSmall: {
    marginTop: '1%',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: '10%',
    marginBottom: '10%',
  },
  avatarContainerSmall: {
    marginTop: '5%',
    marginBottom: '5%',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  avatarZoomOut: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 5,
    marginLeft: '12%',
    color: '#494873',
  },
  input: {
    flex: 1,
    height: 30,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontWeight: '500',
    backgroundColor: '#f7f7f7',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: '12%',
    width: '75%',
  },
  passwordIcon: {
    fontSize: 20,
    color: '#494873',
    marginLeft: 10,
  },
  errorMessage: {
    color: 'red',
    marginLeft: '12%',
    marginTop: 5,
  },
  inputsPlace: {
    marginBottom: 10,
  },
  inputsPlaceSmall: {
    marginBottom: 5,
  },
  button: {
    marginVertical: 5,
  },
});
