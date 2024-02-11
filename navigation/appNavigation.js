// appNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NotificationPreferences from '../screens/NotificationPreferences';
import UnitsSettings from '../screens/UnitSettings';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
        <Stack.Screen name="Notifications" component={NotificationPreferences} />
        <Stack.Screen name="Unités" component={UnitsSettings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
