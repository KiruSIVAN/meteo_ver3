import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to check user preferences and send notifications based on weather data
export async function checkAndSendNotifications(currentTemperature, currentWindSpeed, currentPrecipitation) {
  try {          
      const userPreferences = await AsyncStorage.getItem('userPreferences');
      console.log('User Preferences:', userPreferences);

      if (userPreferences) {
          const preferences = JSON.parse(userPreferences);
          const { 
              temperatureThresholdHigh, 
              temperatureThresholdLow, 
              showWindNotification, 
              windSpeedThreshold, 
              showPrecipitationNotification, 
              precipitationThreshold 
          } = preferences;

          if (parseFloat(currentTemperature) > parseFloat(temperatureThresholdHigh)) {
              // Send notification for high temperature alert
              await sendNotification(
                  'High temperature alert!',
                  `Current temperature (${currentTemperature}°C) exceeds the threshold (${temperatureThresholdHigh}°C)`
              );

              console.log('Temperature exceeds threshold. Notification sent.');
          } else if (parseFloat(currentTemperature) < parseFloat(temperatureThresholdLow)) {
              // Send notification for low temperature alert
              await sendNotification(
                  'Low temperature alert!',
                  `Current temperature (${currentTemperature}°C) is below the threshold (${temperatureThresholdLow}°C)`
              );

              console.log('Temperature is below threshold. Low temperature notification sent.');
          }

          if (showWindNotification && parseFloat(currentWindSpeed) > parseFloat(windSpeedThreshold)) {
              // Send notification for high wind speed alert
              await sendNotification(
                  'High wind speed alert!',
                  `Current wind speed (${currentWindSpeed} mph) exceeds the threshold (${windSpeedThreshold} mph)`
              );

              console.log('Wind speed exceeds threshold. Notification sent.');
          }

          if (showPrecipitationNotification && parseFloat(currentPrecipitation) > parseFloat(precipitationThreshold)) {
              // Send notification for high precipitation alert
              await sendNotification(
                  'High precipitation alert!',
                  `Current precipitation (${currentPrecipitation} mm) exceeds the threshold (${precipitationThreshold} mm)`
              );

              console.log('Precipitation exceeds threshold. Notification sent.');
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
