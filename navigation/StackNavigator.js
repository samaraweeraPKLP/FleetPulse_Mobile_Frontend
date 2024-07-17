import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screen/LoginScreen';
import DrawerNavigator from './DrawerNavigator';
import AdminRestPasswordVerificationScreen from '../screen/AdminRestPasswordVerification'
import AdminResetPasswordVerificationCodeScreen from '../screen/AdminRestPasswordVerificationCode';
import EndTripScreen from '../screen/EndTrip'
import NewTripScreen from '../screen/NewTrip';
import AnimationScreen from '../screen/AnimationScreen';
import ChangePasswordScreen from '../screen/ChangePassword';
import UnauthorizedScreen from '../screen/Unauthorize';
import TripStartAnimationScreen from '../screen/TripStartAnimation';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name="AdminRestPasswordVerification" component={AdminRestPasswordVerificationScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="AdminResetPasswordVerificationCode" component={AdminResetPasswordVerificationCodeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="New Trip" component={NewTripScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="End Trip" component={EndTripScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="AnimationScreen" component={AnimationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Change Password" component={ChangePasswordScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="NotFound" component={UnauthorizedScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="TripStartAnimationScreen" component={TripStartAnimationScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default StackNavigator;
