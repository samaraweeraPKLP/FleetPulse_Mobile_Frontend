import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const BackArrow = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
    <AntDesign name="arrowleft" size={30} color="#393970" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '3%',
    left: 20,
    zIndex: 1, // Ensure the arrow is above other components
  },
});

export default BackArrow;
