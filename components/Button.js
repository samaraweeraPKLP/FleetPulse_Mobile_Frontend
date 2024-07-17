import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, style, type }) => {
  const buttonStyle = type === 'cancel' ? styles.cancelButton : styles.button;

  return (
    <TouchableOpacity style={[buttonStyle, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#393970',
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'gray',
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#e3e8ee',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
