import React, { useEffect, useState } from "react"; // Import useState and useEffect
import { Text } from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const DailyForecast = ({ day, index }) => {
  const [temperatureUnit, setTemperatureUnit] = useState('');

  useEffect(() => {
    // Load temperature unit when component mounts
    loadTemperatureUnit();
  }, []);

  const loadTemperatureUnit = async () => {
    try {
      const savedUnit = await AsyncStorage.getItem('temperatureUnit');
      // Set the temperature unit retrieved from AsyncStorage
      setTemperatureUnit(savedUnit || 'Celsius'); // Set default unit if none saved
    } catch (error) {
      console.error('Error loading temperature unit:', error);
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

  return (
    <DayContainer>
      <DateContainer>
        <WeekDay>{moment(day.dt * 1000).format("ddd")}</WeekDay>
      </DateContainer>
      <IconTempView>
        <WeatherIcon
          source={{
            uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
          }}
          resizeMode={"contain"} // cover or contain its upto you view look
        />
        <Text>{day.weather[0].description}</Text>
      </IconTempView>
      <DegreeView>
        <Degree>{renderTemperature(day.temp.max)}</Degree>
        <FeelsLike>Feels {renderTemperature(day.feels_like.day)}</FeelsLike>
      </DegreeView>
    </DayContainer>
  );
};

const DayContainer = styled.View`
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 95%;
  max-width: 478px;
`;

const DateContainer = styled.View`
  text-align: right;
  flex: 1;
`;

const WeekDay = styled.Text`
  font-size: 24px;
  text-align: center;
  margin: 3px;
`;

const IconTempView = styled.View`
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  flex: 2;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const DegreeView = styled.View`
  text-align: center;
  flex: 1;
`;

const Degree = styled.Text`
  font-size: 24px;
`;

const FeelsLike = styled.Text`
  font-size: 14px;
`;

export default DailyForecast;
