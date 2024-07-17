import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import NotificationBox from '../components/NotificationBox';
import BackArrow from '../components/BackArrow';

export default function NotificationScreen({ navigation }) {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BackArrow onPress={handleBack} />
      <Text style={styles.HeaderTitle}>Notification Details</Text>

      <ScrollView style={styles.scrollContainer}>
        <NotificationBox />
        <NotificationBox />
        <NotificationBox />
        <NotificationBox />
        <NotificationBox />
        <NotificationBox />
      </ScrollView>
      
      <View style={styles.footer}></View>
    </View>
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
    marginBottom: 30,
  },
  scrollContainer: {
    flex: 1,
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
