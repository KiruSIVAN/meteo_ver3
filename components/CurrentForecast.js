import React, { useEffect, useState } from 'react';
import styled from "styled-components/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../utils/asyncStorage';
import { checkAndSendNotifications } from '../screens/notificationHandler';

const CurrentForecast = ({ currentWeather }) => {
  const [temperatureUnit, setTemperatureUnit] = useState('');
  const [windSpeedUnit, setWindSpeedUnit] = useState('');
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    if (currentWeather && currentWeather.current) {
      const currentTemperature = currentWeather.current.temp;
      const currentWindSpeed = currentWeather.current.wind_speed; 
      const currentPrecipitation = currentWeather.current.humidity; 

      checkAndSendNotifications(currentTemperature, currentWindSpeed, currentPrecipitation );
    }
  }, [currentWeather]);

  useEffect(() => {
    loadTemperatureUnit();
    loadWindSpeedUnit();
  }, []);

  useEffect(() => {
    if (currentWeather && currentWeather.timezone) {
      setTimezone(currentWeather.timezone);
      storeTimezone(currentWeather.timezone); // Store timezone when it updates
    }
  }, [currentWeather]);

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

  const storeTimezone = async (timezone) => {
    try {
      await AsyncStorage.setItem('timezone', timezone);
      console.log('Timezone : ', timezone,' stored successfully.');
    } catch (error) {
      console.log('Error storing timezone: ', error);
    }
  };

  const convertToFahrenheit = (celsius) => {
    return (celsius * 9 / 5) + 32;
  };

  const renderTemperature = (temperature) => {
    if (temperatureUnit === 'Celsius') {
      return Math.round(temperature) + '°C';
    } else {
      const Fahrenheit = convertToFahrenheit(temperature);
      return Math.round(Fahrenheit) + '°F';
    }
  };

  const convertToMilesPerHour = (metersPerSecond) => {
    return metersPerSecond * 2.23694; // 1 m/s is approximately 2.23694 mph
  };

  const renderWindSpeed = (windSpeed) => {
    if (windSpeedUnit === 'm/s') {
      return windSpeed + ' m/s';
    } else {
      const milesPerHour = convertToMilesPerHour(windSpeed);
      return Math.round(milesPerHour) + ' mph';
    }
  };
  
  return (
    <CurrentView>
      <Timezone>{currentWeather.timezone}</Timezone>
      <MainInfoContainer>
        <CurrentTempView>
          {currentWeather.current && (
            <WeatherIcon
              source={{
                uri: `http://openweathermap.org/img/wn/${currentWeather.current.weather[0].icon}@2x.png`,
              }}
              resizeMode={"contain"}
            />
          )}
          <CurrentDegrees>
            {currentWeather.current && renderTemperature(currentWeather.current.temp)}
          </CurrentDegrees>
        </CurrentTempView>
        <Description>
          {currentWeather.current && currentWeather.current.weather[0].description}
        </Description>
      </MainInfoContainer>
      <SecondaryInfoContainer>
        <Row>
          <DetailsBox>
            <Label>Feels</Label>
            <Details>
              {currentWeather.current && renderTemperature(currentWeather.current.feels_like)}
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Low</Label>
            <Details>
              {currentWeather.daily && renderTemperature(currentWeather.daily[0].temp.min)}
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>High</Label>
            <Details>
              {currentWeather.daily && renderTemperature(currentWeather.daily[0].temp.max)}
            </Details>
          </DetailsBox>
        </Row>
        <Row>
          <DetailsBox>
            <Label>Wind</Label>
            <Details>
              {currentWeather.current && renderWindSpeed(currentWeather.current.wind_speed)}
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Humidity</Label>
            <Details>
              {currentWeather.current && currentWeather.current.humidity}%
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Rain</Label>
            <Details>
              {currentWeather.daily > 0 ? currentWeather.daily[0].rain : "0"} MM
            </Details>
          </DetailsBox>
        </Row>
      </SecondaryInfoContainer>
    </CurrentView>
  );
};

const CurrentView = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CurrentTempView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const MainInfoContainer = styled.View`
  display: flex;
  align-items: center;
`;

const Description = styled.Text`
  color: white;
  font-size: 15px;
  text-transform: capitalize;
`;

const SecondaryInfoContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 10px;
  width: 95%;
  max-width: 478px;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const Timezone = styled.Text`
  color: white;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 15px;
`;

const CurrentDegrees = styled.Text`
  color: white;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 60px;
`;

const Row = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  color: black;
  padding: 10px 30px;
`;

const DetailsBox = styled.View`
  display: flex;
`;

const Label = styled.Text`
  font-size: 18px;
`;

const Details = styled.Text`
  color: black;
  font-size: 15px;
`;

export default CurrentForecast;
