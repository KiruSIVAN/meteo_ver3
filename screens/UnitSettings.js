import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UnitsSettings = () => {
  const [temperatureUnit, setTemperatureUnit] = useState('');
  const [windSpeedUnit, setWindSpeedUnit] = useState('');

  useEffect(() => {
    loadTemperatureUnit();
    loadWindSpeedUnit();
  }, []);

  const toggleTemperatureUnit = async () => {
    const newUnit = temperatureUnit === 'Celsius' ? 'Fahrenheit' : 'Celsius';
    try {
      await AsyncStorage.setItem('temperatureUnit', newUnit);
      setTemperatureUnit(newUnit);
      console.log('Current temperature unit:', newUnit);
    } catch (error) {
      console.error('Error saving temperature unit:', error);
    }
  };

  const toggleWindSpeedUnit = async () => {
    const newUnit = windSpeedUnit === 'm/s' ? 'mph' : 'm/s';
    try {
      await AsyncStorage.setItem('windSpeedUnit', newUnit);
      setWindSpeedUnit(newUnit);
      console.log('Current wind speed unit:', newUnit);
    } catch (error) {
      console.error('Error saving wind speed unit:', error);
    }
  };

  const loadTemperatureUnit = async () => {
    try {
      const savedUnit = await AsyncStorage.getItem('temperatureUnit');
      setTemperatureUnit(savedUnit || 'Celsius'); // Set default unit if none saved
    } catch (error) {
      console.error('Error loading temperature unit:', error);
    }
  };

  const loadWindSpeedUnit = async () => {
    try {
      const savedUnit = await AsyncStorage.getItem('windSpeedUnit');
      setWindSpeedUnit(savedUnit || 'm/s'); // Set default unit if none saved
    } catch (error) {
      console.error('Error loading wind speed unit:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Unit Settings</Text>

      <View style={styles.setting}>
        <Text>Temperature Unit</Text>
        <Switch
          value={temperatureUnit === 'Fahrenheit'}
          onValueChange={toggleTemperatureUnit}
        />
        <Text>{temperatureUnit}</Text>
      </View>

      <View style={styles.setting}>
        <Text>Wind Speed Unit</Text>
        <Switch
          value={windSpeedUnit === 'mph'}
          onValueChange={toggleWindSpeedUnit}
        />
        <Text>{windSpeedUnit}</Text>
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

export default UnitsSettings;
