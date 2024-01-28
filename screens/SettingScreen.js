import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { getData, storeData } from '../utils/asyncStorage'; // Import your AsyncStorage functions

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    // Load notification preference from AsyncStorage when component mounts
    loadNotificationPreference();
  }, []);

  const loadNotificationPreference = async () => {
    try {
      const notificationPreference = await getData('notificationsEnabled');
      if (notificationPreference !== null) {
        setNotificationsEnabled(JSON.parse(notificationPreference));
        // Check weather alerts if notifications are enabled
        if (JSON.parse(notificationPreference)) {
          checkWeatherAlerts();
        }
      }
    } catch (error) {
      console.log('Error loading notification preference: ', error);
    }
  };

  const toggleNotifications = async () => {
    const newNotificationPreference = !notificationsEnabled;
    setNotificationsEnabled(newNotificationPreference);
    await storeNotificationPreference(newNotificationPreference); // Store the new notification preference
    // Check weather alerts if notifications are enabled
    if (newNotificationPreference) {
      checkWeatherAlerts();
    }
  };

  const storeNotificationPreference = async (value) => {
    try {
      await storeData('notificationsEnabled', JSON.stringify(value));
    } catch (error) {
      console.log('Error storing notification preference: ', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.setting}>
        <Text>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      <View style={styles.setting}>
        <Text>Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={toggleDarkMode}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default SettingsScreen;