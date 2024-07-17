import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Button from '../components/Button';

export default function UnauthorizedScreen({ navigation }) {
  const handleBack = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}></View>
      
      <View style={styles.BackArrowcontainer}>
        <Text style={styles.headerTitle}>Whoops !</Text>
      </View>
      
      <Image
        source={require('../assets/NotFound404.png')}
        style={styles.image}
      />
      
      <Text style={styles.message}>You are not authorized to access this page</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Go Back to Login" onPress={handleBack} style={styles.button} />
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
  BackArrowcontainer: {
    marginTop: 25,
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#393970',
    alignSelf: 'center',
    marginBottom: 30,
  },
  image: {
    width: '60%',
    height: '30%',
    marginBottom: '20%',
    marginTop: '20%',
    marginLeft: '20%',
  },
  message: {
    fontSize: 16,
    fontWeight: '400',
    marginLeft: '12%',
    marginRight: '12%',
    color: '#494873',
    textAlign: 'center',
  },
  button: {
    width: '55%',
    marginLeft: '20%',
  },
  buttonContainer: {
    marginTop: '10%',
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
