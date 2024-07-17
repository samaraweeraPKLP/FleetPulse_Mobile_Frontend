import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Image, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { LOGIN_ENDPOINT } from '../apiConfig';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to track error messages
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false); // State to track keyboard visibility
  const [showInputErrors, setShowInputErrors] = useState(false); // State to show input errors

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Function to store the username and token in AsyncStorage
  const storeUserData = async (username, token) => {
    try {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('token', token);
      console.log('User data stored successfully');
    } catch (error) {
      console.error('Failed to store user data', error);
      setErrorMessage('Failed to store user data. Please try again.');
    }
  };

  const handleLogin = async () => {
    setShowInputErrors(true); // Show input errors on login attempt

    if (!username && !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    } else if (!username) {
      setErrorMessage('Please enter your username.');
      return;
    } else if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
  
    try {
      const response = await axios.post(LOGIN_ENDPOINT, {
        username,
        password,
      });
  
      if (response.data.status) {
        const { accessToken, jobTitle } = response.data.data;
  
        if (jobTitle === 'Driver' || jobTitle === 'Helper') {
          await storeUserData(username, accessToken); // Store username and JWT token in AsyncStorage
          setUsername(''); // Clear username input
          setPassword(''); // Clear password input
          setErrorMessage(''); // Clear error message
          navigation.navigate('Main', { username, jobTitle }); // Pass username and jobTitle to next screen
        } else {
          navigation.navigate('NotFound'); // Navigate to 404 screen
        }
      } else {
        setErrorMessage(response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login. Please try again.');
      console.error(error);
    }
  };
  
  const handleAdminResetPassword = () => {
    navigation.navigate('AdminRestPasswordVerification');
  };

  const getBorderColor = (inputValue) => {
    if (showInputErrors && !inputValue) {
      return 'red'; // Red border if input is empty and showInputErrors is true
    }
    return '#f7f7f7'; // Default border color
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        source={require('../assets/splashscreen.png')} // Update this path to your image file
        style={[styles.image, keyboardVisible && styles.inputKeyboardVisible]}
      />
      <Text style={styles.title}>Username</Text>
      <TextInput
        style={[styles.input, { borderColor: getBorderColor(username) }]}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <Text style={styles.title}>Password</Text>
      <View style={[styles.passwordContainer, { borderColor: getBorderColor(password) }]}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
          <Entypo name={isPasswordVisible ? 'eye-with-line' : 'eye'} style={styles.passwordicon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleAdminResetPassword}>
        <Text style={styles.Reset}>Reset Password</Text>
      </TouchableOpacity>

      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#393970',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 50,
    marginBottom: '15%',
    marginTop: '5%',
    resizeMode: 'contain'
  },
  inputKeyboardVisible: {
    marginBottom: '1%',
    marginTop: '1%',
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 20,
    marginTop: 30,
    marginRight: '58%',
    color: '#f7f7f7'
  },
  input: {
    width: '80%',
    height: 35,
    backgroundColor: '#f7f7f7',
    borderColor: '#f7f7f7',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 35,
    marginBottom: 10,
    backgroundColor: '#f7f7f7',
    borderColor: '#f7f7f7',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
  },
  passwordicon: {
    fontSize: 20,
  },
  Reset: {
    fontWeight: '500',
    marginTop: 7,
    marginBottom: 10,
    marginLeft: '50%',
    color: '#adb0c3'
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#e3b17e',
    width: '80%',
    height: 40,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#393970',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
