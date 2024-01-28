import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to check user preferences and send notifications based on weather data
export async function checkAndSendNotifications(currentTemperature) {
    try {
        // Request permission to send notifications if not already granted
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
    
        if (finalStatus !== 'granted') {
          console.log('Notification permissions not granted');
          return; // Exit the function if permissions are not granted
        }    
    const userPreferences = await AsyncStorage.getItem('userPreferences');
    console.log('User Preferences:', userPreferences);

    if (userPreferences) {
      const preferences = JSON.parse(userPreferences);
      const { temperatureThresholdHigh } = preferences;

      if (parseFloat(currentTemperature) > parseFloat(temperatureThresholdHigh)) {
        // Send notification for high temperature alert
        await sendNotification(
          'High temperature alert!',
          `Current temperature (${currentTemperature}°C) exceeds the threshold (${temperatureThresholdHigh}°C)`
        );

        console.log('Temperature exceeds threshold. Notification sent.');
      } else {
        console.log('Temperature is below threshold. No notification sent.');
      }
    }
  } catch (error) {
    console.error('Error occurred while checking and sending notifications:', error);
  }
}

// Function to send a notification
async function sendNotification(title, body) {
  try {
    // Request permission to send notifications if not already granted
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== 'granted') {
      console.log('Notification permissions not granted');
      return; // Exit the function if permissions are not granted
    }

    // Permissions are granted, proceed to send notification
    await Notifications.presentNotificationAsync({
      title,
      body,
      ios: {
        sound: true,
      },
      android: {
        channelId: 'default',
        sound: true,
      },
    });
    console.log('Notification sent successfully!');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
