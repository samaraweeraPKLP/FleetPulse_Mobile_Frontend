import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  const onPressMenu = () => {
    navigation.openDrawer(); // Opens the drawer
  };

  const onPressNotification = () => {
    navigation.navigate('Notification');
  };

  const onPressProfile = () => {
    navigation.navigate('UserProfile');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressMenu} style={styles.menuIconContainer}>
        <Icon name="menu-outline" size={28} color="white" />
      </TouchableOpacity>
      <View style={styles.rightIconsContainer}>
        <TouchableOpacity onPress={onPressProfile} style={styles.iconContainer}>
          <Icon name="person-circle-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressNotification} style={styles.iconContainer}>
          <Icon name="notifications-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#393970',
    height: 70,
  },
  menuIconContainer: {
    padding: 8,
    marginTop: 20,
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  iconContainer: {
    padding: 8,
  },
});

export default Header;
