import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

const AnimationScreen = ({navigation}) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('New Trip'); // Navigate to EndTripScreen with tripData
    }, 1000); // Navigate to EndTripScreen after 1 second
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      
      <Image
        source={require('../assets/Address-cuate.png')}
        style={styles.image}
      />
      
      <Animatable.Text 
        animation="bounce" // Choose the animation you like
        iterationCount="infinite" // Repeat the animation infinitely
        style={styles.message}
      >
        Starting New Trip...
      </Animatable.Text>
      
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e8ee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#393970',
    height: 70,
  },
  message: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#393970',
    alignSelf: 'center',
  },
  image: {
    width: '60%',
    height: '30%',
    marginBottom: '10%',
    marginTop: '40%',
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
});

export default AnimationScreen;
