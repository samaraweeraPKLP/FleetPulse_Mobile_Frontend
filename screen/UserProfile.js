import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { USER_PROFILE_ENDPOINT, UPLOAD_PROFILE_PICTURE_ENDPOINT } from '../apiConfig';
import BackArrow from '../components/BackArrow';

export default function UserProfileScreen({ navigation, triggerRefresh }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageBase64, setImageBase64] = useState(null);
  const [selectedImage, setSelectedImage] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        console.log('Username from AsyncStorage:', username);

        if (!username) {
          setLoading(false);
          Alert.alert('Error', 'Username not found. Please log in again.');
          return;
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setLoading(false);
          Alert.alert('Error', 'Token not found. Please log in again.');
          return;
        }

        console.log('Fetching user profile with:', { username, token });

        const response = await axios.get(`${USER_PROFILE_ENDPOINT}?username=${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('User profile fetched successfully:', response.data);
        setUserProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', `An error occurred while fetching user profile: ${error.message}`);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageBase64(result.assets[0].base64);
      setSelectedImage(true);
    }
  };

  const removeProfileImage = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        Alert.alert('Error', 'Username not found. Please log in again.');
        return;
      }
  
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found. Please log in again.');
        return;
      }
  
      const profilePictureDTO = {
        UserName: username,
        ProfilePicture: null, // Explicitly set to null
      };
  
      console.log('Removing profile picture with:', profilePictureDTO);
  
      const response = await axios.put(UPLOAD_PROFILE_PICTURE_ENDPOINT, profilePictureDTO, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Response:', response);
  
      if (response.status === 200) {
        Alert.alert('Profile picture removed successfully');
        setUserProfile({ ...userProfile, profilePicture: null });
        triggerRefresh();// Trigger refresh after removing profile picture
      } else {
        console.log('Response data:', response.data);
        Alert.alert('Failed to remove profile picture');
      }
    } catch (error) {
      console.error('Error removing profile picture:', error.response ? error.response.data : error.message);
      Alert.alert('An error occurred while removing the profile picture');
    }
  };
  

  const uploadImage = async () => {
    if (!imageBase64) {
      Alert.alert('Please select an image first');
      return;
    }

    const username = await AsyncStorage.getItem('username');
    if (!username) {
      Alert.alert('Error', 'Username not found. Please log in again.');
      return;
    }

    const profilePictureDTO = {
      UserName: username,
      ProfilePicture: imageBase64,
    };

    try {
      const response = await fetch(UPLOAD_PROFILE_PICTURE_ENDPOINT, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profilePictureDTO),
      });

      console.log('Request Body:', JSON.stringify(profilePictureDTO));
      console.log('Response:', response);

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        if (response.ok) {
          Alert.alert('Profile picture updated successfully');
          setUserProfile({ ...userProfile, profilePicture: imageBase64 });
          setSelectedImage(false);
          triggerRefresh(); // Trigger refresh after updating profile picture
        } else {
          Alert.alert(`Failed to update profile picture: ${data}`);
        }
      } else {
        const text = await response.text();
        if (response.ok) {
          Alert.alert('Profile picture updated successfully');
          setUserProfile({ ...userProfile, profilePicture: imageBase64 });
          setSelectedImage(false);
          triggerRefresh(); // Trigger refresh after updating profile picture
        } else {
          Alert.alert(`Failed to update profile picture: ${text}`);
        }
      }
    } catch (error) {
      console.error('Error updating profile picture:', error.response ? error.response.data : error.message);
      Alert.alert('An error occurred while updating the profile picture');
    }
  };


  return (
    <View style={styles.container}>
      <BackArrow onPress={handleBack} />

      <Text style={styles.header}>User Profile</Text>

      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {userProfile && userProfile.profilePicture ? (
          <Image
            source={{ uri: `data:image/png;base64,${userProfile.profilePicture}` }}
            style={styles.avatar}
          />
        ) : (
          <Image
            source={require('../assets/man.png')}
            style={styles.avatar}
          />
        )}
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.inputsPlace}>
        <TouchableOpacity style={styles.removeTextContainer} onPress={removeProfileImage}>
          <Text style={styles.removeText}>Remove Profile Image</Text>
        </TouchableOpacity>
        <Text style={styles.label}>First Name:</Text>
        <Text style={styles.value}>{userProfile?.firstName}</Text>

        <Text style={styles.label}>Last Name:</Text>
        <Text style={styles.value}>{userProfile?.lastName}</Text>

        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.value}>{userProfile?.dateOfBirth.split('T')[0]}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userProfile?.emailAddress}</Text>

        <Text style={styles.label}>Contact Number:</Text>
        <Text style={styles.value}>{userProfile?.phoneNo}</Text>

        <Text style={styles.label}>NIC:</Text>
        <Text style={styles.value}>{userProfile?.nic}</Text>

        {selectedImage && (
          <TouchableOpacity style={styles.saveButton} onPress={uploadImage}>
            <Text style={styles.saveButtonText}>Update Profile Picture</Text>
          </TouchableOpacity>
        )}
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#494873',
    alignSelf: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: '2%',
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: '40%',
    backgroundColor: '#393970',
    borderRadius: 15,
    padding: 5,
  },
  removeTextContainer: {
    marginTop: '1%',
  },
  removeText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'gray',
    alignSelf: 'center',
  },
  footer: {
    backgroundColor: '#393970',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
    color: '#393970',
  },
  value: {
    fontSize: 18,
    width: '100%',
    height: 35,
    borderRadius: 5,
    padding: '1.5%',
    marginBottom: 10,
    backgroundColor: '#f7f7f7',
    fontWeight: '400',
  },
  inputsPlace: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#494873',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});
