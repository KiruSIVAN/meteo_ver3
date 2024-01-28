import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TextInput, Button, StyleSheet } from 'react-native';
import { getData, storeData } from '../utils/asyncStorage';
import { checkAndSendNotifications } from './notificationHandler'; // Correct import

const NotificationsScreen = () => {
  const [userPreferences, setUserPreferences] = useState({
    notificationsEnabled: false,
    temperatureThresholdHigh: '',
    temperatureThresholdLow: '',
    showWindNotification: false,
    showPrecipitationNotification: false,
  });

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const storedPreferences = await getData('userPreferences');
        if (storedPreferences) {
          setUserPreferences(JSON.parse(storedPreferences));
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchUserPreferences();
  }, []);

  useEffect(() => {
    console.log('User Preferences:', userPreferences);
    // Call the function to check and send notifications whenever user preferences change
    checkAndSendNotifications();
  }, [userPreferences]); // Run the effect whenever user preferences change

  const savePreferences = async () => {
    try {
      await storeData('userPreferences', JSON.stringify(userPreferences));
      console.log('Preferences saved successfully!');
      // After saving preferences, check and send notifications again
      checkAndSendNotifications();
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <View style={styles.preference}>
        <Text>Enable Notifications</Text>
        <Switch
          value={userPreferences.notificationsEnabled}
          onValueChange={(value) => setUserPreferences({ ...userPreferences, notificationsEnabled: value })}
        />
      </View>
      {userPreferences.notificationsEnabled && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temperature Threshold (°C)</Text>
            <View style={styles.thresholdTypeContainer}>
              <View style={styles.checkboxContainer}>
                <Text>High:</Text>
                <Switch
                  value={!!userPreferences.temperatureThresholdHigh}
                  onValueChange={(value) => setUserPreferences({ ...userPreferences, temperatureThresholdHigh: value ? '0' : '' })}
                  disabled={!userPreferences.notificationsEnabled}
                />
                {!!userPreferences.temperatureThresholdHigh && (
                  <TextInput
                    style={[styles.input, !userPreferences.notificationsEnabled && styles.disabled]}
                    placeholder="High temperature threshold"
                    value={userPreferences.temperatureThresholdHigh}
                    onChangeText={(value) => setUserPreferences({ ...userPreferences, temperatureThresholdHigh: value })}
                    keyboardType="numeric"
                    editable={userPreferences.notificationsEnabled}
                  />
                )}
              </View>
              <Text>°C</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.thresholdTypeContainer}>
              <View style={styles.checkboxContainer}>
                <Text>Low:</Text>
                <Switch
                  value={!!userPreferences.temperatureThresholdLow}
                  onValueChange={(value) => setUserPreferences({ ...userPreferences, temperatureThresholdLow: value ? '0' : '' })}
                  disabled={!userPreferences.notificationsEnabled}
                />
                {!!userPreferences.temperatureThresholdLow && (
                  <TextInput
                    style={[styles.input, !userPreferences.notificationsEnabled && styles.disabled]}
                    placeholder="Low temperature threshold"
                    value={userPreferences.temperatureThresholdLow}
                    onChangeText={(value) => setUserPreferences({ ...userPreferences, temperatureThresholdLow: value })}
                    keyboardType="numeric"
                    editable={userPreferences.notificationsEnabled}
                  />
                )}
              </View>
              <Text>°C</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wind Speed Threshold (mph)</Text>
            <View style={styles.thresholdTypeContainer}>
              <Switch
                value={userPreferences.showWindNotification}
                onValueChange={(value) => setUserPreferences({ ...userPreferences, showWindNotification: value })}
                disabled={!userPreferences.notificationsEnabled}
              />
              {userPreferences.showWindNotification && (
                <TextInput
                  style={[styles.input, !userPreferences.notificationsEnabled && styles.disabled]}
                  placeholder="Wind speed threshold"
                  value={userPreferences.windSpeedThreshold}
                  onChangeText={(value) => setUserPreferences({ ...userPreferences, windSpeedThreshold: value })}
                  keyboardType="numeric"
                  editable={userPreferences.notificationsEnabled}
                />
              )}
              <Text>mph</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Precipitation Threshold (mm)</Text>
            <View style={styles.thresholdTypeContainer}>
              <Switch
                value={userPreferences.showPrecipitationNotification}
                onValueChange={(value) => setUserPreferences({ ...userPreferences, showPrecipitationNotification: value })}
                disabled={!userPreferences.notificationsEnabled}
              />
              {userPreferences.showPrecipitationNotification && (
                <TextInput
                  style={[styles.input, !userPreferences.notificationsEnabled && styles.disabled]}
                  placeholder="Precipitation threshold"
                  value={userPreferences.precipitationThreshold}
                  onChangeText={(value) => setUserPreferences({ ...userPreferences, precipitationThreshold: value })}
                  keyboardType="numeric"
                  editable={userPreferences.notificationsEnabled}
                />
              )}
              <Text>mm</Text>
            </View>
          </View>
        </>
      )}
      <Button title="Save Preferences" onPress={savePreferences} disabled={!userPreferences.notificationsEnabled} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  preference: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  thresholdTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    width: '70%',
  },
  disabled: {
    backgroundColor: '#f2f2f2',
    color: '#999',
  },
});

export default NotificationsScreen;
