import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput } from 'react-native';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';

export default function AdminRestPasswordLogin({ navigation }) {
  const [resetPasswordVerification, setResetPasswordVerification] = useState('');

  const handleBack = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}></View>
        
      <View style={styles.BackArrowcontainer}>
      <BackArrow onPress={handleBack} />
      <Text style={styles.headerTitle}>Reset Password </Text>
      </View>
      
      
      <Image
        source={require('../assets/Email campaign-rafiki.png')}
        style={styles.image}
      />
      
      <Text style={styles.successMessage}>Password Update Successfully</Text>
      <Text style={styles.message}>Your new password has been dispatched to your email. Please verify and log in.</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleBack} style={styles.button} />
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
  BackArrowcontainer:{
    marginTop:15,
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#393970',
    height: 70,
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
    marginBottom: '20%',
    marginTop: '20%',
    marginLeft: '20%',
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 15,
    marginLeft: '12%',
    marginRight: '12%',
    color: '#494873',
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#393970',
    alignSelf: 'center',
    marginBottom: 10,
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
  button: {
    width: '55%',
    marginLeft: '20%',
  },
  buttonContainer:{
    marginTop:'15%'
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
