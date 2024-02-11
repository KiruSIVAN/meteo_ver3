import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TextInput, Button, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { getData, storeData } from '../utils/asyncStorage';
import { scheduleNotificationAsync } from 'expo-notifications'; // Import scheduleNotificationAsync

const NotificationsScreen = ({ navigation }) => {
  const [userPreferences, setUserPreferences] = useState({
    notificationsEnabled: false,
    showtemperatureHighNotification: false,
    showtemperatureLowNotification: false,
    showWindNotification: false,
    showPrecipitationNotification: false,
    showFloodNotification: false,
    showEarthquakeNotification: false,
    showHurricaneNotification: false,
    showTornadoNotification: false,
    showWildfireNotification: false,
  });
  const [preferencesSaved, setPreferencesSaved] = useState(false);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const storedPreferences = await getData('userPreferences');
        if (storedPreferences) {
          setUserPreferences((storedPreferences));
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };
    
    fetchUserPreferences();
  }, []);

  const savePreferences = async () => {
    try {
      await storeData('userPreferences', JSON.stringify(userPreferences)); // Stringify userPreferences
      console.log('Preferences saved successfully!');
      setPreferencesSaved(true);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  useEffect(() => {
    console.log('Timezone:', 'America/Toronto');
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null}>
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
                    value={userPreferences.showtemperatureHighNotification}
                    onValueChange={(value) =>
                      setUserPreferences({
                        ...userPreferences,
                        showtemperatureHighNotification: value,
                      })
                    }
                    disabled={!userPreferences.notificationsEnabled}
                  />
                </View>
                {userPreferences.showtemperatureHighNotification && (
                  <TextInput
                    style={[
                      styles.input,
                      !userPreferences.notificationsEnabled && styles.disabled,
                    ]}
                    placeholder="High temperature threshold"
                    value={userPreferences.temperatureThresholdHigh}
                    onChangeText={(value) =>
                      setUserPreferences({
                        ...userPreferences,
                        temperatureThresholdHigh: value,
                      })
                    }
                    keyboardType="default"
                    editable={userPreferences.notificationsEnabled}
                  />
                )}
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.thresholdTypeContainer}>
                <View style={[styles.checkboxContainer, { marginRight: 10 }]}>
                  <Text>Low:</Text>
                  <Switch
                    value={userPreferences.showtemperatureLowNotification}
                    onValueChange={(value) =>
                      setUserPreferences({
                        ...userPreferences,
                        showtemperatureLowNotification: value,
                      })
                    }
                    disabled={!userPreferences.notificationsEnabled}
                  />
                </View>
                {userPreferences.showtemperatureLowNotification && (
                  <TextInput
                    style={[
                      styles.input,
                      !userPreferences.notificationsEnabled && styles.disabled,
                    ]}
                    placeholder="Low temperature threshold"
                    value={userPreferences.temperatureThresholdLow}
                    onChangeText={(value) =>
                      setUserPreferences({
                        ...userPreferences,
                        temperatureThresholdLow: value,
                      })
                    }
                    keyboardType="default"
                    editable={userPreferences.notificationsEnabled}
                  />
                )}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Wind Speed Threshold (m/s)</Text>
              <View style={styles.thresholdTypeContainer}>
                <Switch
                  value={userPreferences.showWindNotification}
                  onValueChange={(value) =>
                    setUserPreferences({
                      ...userPreferences,
                      showWindNotification: value,
                    })
                  }
                  disabled={!userPreferences.notificationsEnabled}
                />
                {userPreferences.showWindNotification && (
                  <TextInput
                    style={[
                      styles.input,
                      !userPreferences.notificationsEnabled && styles.disabled,
                    ]}
                    placeholder="Wind speed threshold"
                    value={userPreferences.windSpeedThreshold}
                    onChangeText={(value) =>
                      setUserPreferences({
                        ...userPreferences,
                        windSpeedThreshold: value,
                      })
                    }
                    keyboardType="default"
                    editable={userPreferences.notificationsEnabled}
                  />
                )}
                <Text>m/s</Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Precipitation Threshold (mm)
              </Text>
              <View style={styles.thresholdTypeContainer}>
                <Switch
                  value={userPreferences.showPrecipitationNotification}
                  onValueChange={(value) =>
                    setUserPreferences({
                      ...userPreferences,
                      showPrecipitationNotification: value,
                    })
                  }
                  disabled={!userPreferences.notificationsEnabled}
                />
                {userPreferences.showPrecipitationNotification && (
                  <TextInput
                    style={[
                      styles.input,
                      !userPreferences.notificationsEnabled && styles.disabled,
                    ]}
                    placeholder="Precipitation threshold"
                    value={userPreferences.precipitationThreshold}
                    onChangeText={(value) =>
                      setUserPreferences({
                        ...userPreferences,
                        precipitationThreshold: value,
                      })
                    }
                    keyboardType="default"
                    editable={userPreferences.notificationsEnabled}
                  />
                )}
                <Text>mm</Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Catastrophes
              </Text>
              <View style={[styles.thresholdTypeContainer, { marginBottom: 10 }]}>
                <Text>Flood Alert</Text>
                <Switch
                  value={userPreferences.showFloodNotification}
                  onValueChange={(value) =>
                    setUserPreferences({
                      ...userPreferences,
                      showFloodNotification: value,
                    })
                  }
                  disabled={!userPreferences.notificationsEnabled}
                />
              </View>
              <View style={[styles.thresholdTypeContainer, { marginBottom: 10 }]}>
                <Text>Earthquake Alert</Text>
                <Switch
                  value={userPreferences.showEarthquakeNotification}
                  onValueChange={(value) =>
                    setUserPreferences({
                      ...userPreferences,
                      showEarthquakeNotification: value,
                    })
                  }
                  disabled={!userPreferences.notificationsEnabled}
                />
              </View>
              <View style={[styles.thresholdTypeContainer, { marginBottom: 10 }]}>
                <Text>Hurricane Alert</Text>
                <Switch
                  value={userPreferences.showHurricaneNotification}
                  onValueChange={(value) =>
                    setUserPreferences({
                      ...userPreferences,
                      showHurricaneNotification: value,
                    })
                  }
                  disabled={!userPreferences.notificationsEnabled}
                />
              </View>
              <View style={[styles.thresholdTypeContainer, { marginBottom: 10 }]}>
                <Text>Tornado Alert</Text>
                <Switch
                  value={userPreferences.showTornadoNotification}
                  onValueChange={(value) =>
                    setUserPreferences({
                      ...userPreferences,
                      showTornadoNotification: value,
                    })
                  }
                  disabled={!userPreferences.notificationsEnabled}
                />
              </View>
              <View style={[styles.thresholdTypeContainer, { marginBottom: 10 }]}>
                <Text>Wildfire Alert</Text>
                <Switch
                  value={userPreferences.showWildfireNotification}
                  onValueChange={(value) =>
                    setUserPreferences({
                      ...userPreferences,
                      showWildfireNotification: value,
                    })
                  }
                  disabled={!userPreferences.notificationsEnabled}
                />
              </View>
            </View>
          </>
        )}
        <Button title="Save Preferences" onPress={savePreferences} disabled={!userPreferences.notificationsEnabled} />
        {preferencesSaved && <Text style={styles.message}>Preferences have been saved!</Text>}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  preference: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  thresholdTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Adjusted width
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    width: "70%",
  },
  disabled: {
    backgroundColor: "#f2f2f2",
    color: "#999",
  },
  message: {
    marginTop: 10,
    color: 'green',
  },
});

export default NotificationsScreen;
