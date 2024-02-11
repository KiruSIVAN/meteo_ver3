import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function checkAndSendNotifications(currentTemperature, currentWindSpeed, currentPrecipitation) {
  try {         

    const userPreferences = await AsyncStorage.getItem('userPreferences');
    console.log('User Preferences:', userPreferences);
    
    if (!userPreferences) {
      console.log('User preferences not found in AsyncStorage.');
      return;
    }
    const preferences = JSON.parse(userPreferences);
    
    const { 
      temperatureThresholdHigh, 
      temperatureThresholdLow, 
      windSpeedThreshold, 
      precipitationThreshold 
    } = preferences;
    
    const timezone = await AsyncStorage.getItem('timezone');
    console.log('Timezone : ', timezone);
    
    if (parseFloat(currentTemperature) > parseFloat(temperatureThresholdHigh)) {
      await sendNotification(
        'High temperature alert!',
        `Current temperature (${currentTemperature}°C) exceeds the threshold (${temperatureThresholdHigh}°C) in (${timezone})`
      );
      console.log('Temperature exceeds threshold. Notification sent.');
    }

    if (parseFloat(currentTemperature) < parseFloat(temperatureThresholdLow)) {
      await sendNotification(
        'Low temperature alert!',
        `Current temperature (${currentTemperature}°C) is below the threshold (${temperatureThresholdLow}°C) in (${timezone})`
      );
      console.log('Temperature is below threshold. Low temperature notification sent.');
    }

    if (parseFloat(currentWindSpeed) > parseFloat(windSpeedThreshold)) {
      await sendNotification(
        'High wind speed alert!',
        `Current wind speed (${currentWindSpeed} mph) exceeds the threshold (${windSpeedThreshold} mph) in (${timezone})`
      );
      console.log('Wind speed exceeds threshold. Notification sent.');
    }

    if (parseFloat(currentPrecipitation) > parseFloat(precipitationThreshold)) {
      await sendNotification(
        'High precipitation alert!',
        `Current precipitation (${currentPrecipitation} mm) exceeds the threshold (${precipitationThreshold} mm) in (${timezone})`
      );
      console.log('Precipitation exceeds threshold. Notification sent.');
    }

  } catch (error) {
    console.error('Error occurred while checking and sending notifications:', error);
  }
}

async function sendNotification(title, body) {
  try {
    let { status } = await Notifications.getPermissionsAsync();

    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      status = newStatus;
    }

    if (status !== 'granted') {
      console.log('Notification permissions not granted');
      return;
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    const content = { title, body };
    await Notifications.scheduleNotificationAsync({ content, trigger: null });

    console.log('Notification sent successfully!');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
