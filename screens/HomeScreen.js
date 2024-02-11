import React, { useState, useEffect } from 'react';
import { ScrollView, ImageBackground, View } from 'react-native';
import ForecastSearch from '../components/ForecastSearch';
import CurrentForecast from '../components/CurrentForecast';
import DailyForecast from '../components/DailyForecast';
import styled from 'styled-components/native';
import config from '../config';
import bgImg from '../assets/4.png';
import PopupMenu from './PopupMenu';
import { getData } from '../utils/asyncStorage';

const HomeScreen = ({ route, navigation }) => {
  const [toggleSearch, setToggleSearch] = useState('city');
  const [city, setCity] = useState('Toronto');
  const [postalCode, setPostalCode] = useState('L4W1S9');
  const [lat, setLat] = useState(43.6532);
  const [long, setLong] = useState(-79.3832);
  const [weather, setWeather] = useState({});
  const [menuVisible, setMenuVisible] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius'); // Add state for temperature unit

  const controller = new AbortController();
  const signal = controller.signal;

  const fetchLatLongHandler = () => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLat(data.coord.lat);
        setLong(data.coord.lon);
      });
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
    setMenuVisible(false); // Hide the popup menu
  };

  const handleUnitsPress = () => {
    navigation.navigate('Unités');
    setMenuVisible(false); // Hide the popup menu
  };

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric&appid=${config.API_KEY}`,
      { signal }
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
      })
      .catch((err) => {
        console.log('Error', err);
      });
    return () => controller.abort();
  }, [lat, long]);

  return (
    <Container>
      <ImageBackground source={bgImg} style={{ width: '100%', height: '100%' }}>
        <PopupMenu
          menuVisible={menuVisible} // Pass menuVisible state
          setMenuVisible={setMenuVisible} // Pass setMenuVisible function
          onNotificationPress={handleNotificationPress}
          onReportIssuePress={() => console.log('Report issue pressed')}
          onUnitsPress={handleUnitsPress}
        />
        <ForecastSearch
          city={city}
          setCity={setCity}
          fetchLatLongHandler={fetchLatLongHandler}
          toggleSearch={toggleSearch}
          setToggleSearch={setToggleSearch}
          setPostalCode={setPostalCode}
          postalCode={postalCode}
        />
        <CurrentForecast
          currentWeather={weather}
          timezone={weather.timezone}
          temperatureUnit={route.params?.temperatureUnit || temperatureUnit} // Pass temperatureUnit state
        />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
          <FutureForecastContainer>
            {weather.daily ? (
              weather.daily.map((day, index) => {
                if (index !== 0) {
                  return <DailyForecast key={day.dt} day={day} index={index} temperatureUnit={route.params?.temperatureUnit || temperatureUnit} />;
                }
              })
            ) : (
              <NoWeather>No Weather to show</NoWeather>
            )}
          </FutureForecastContainer>
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: dodgerblue;
`;

const NoWeather = styled.Text`
  text-align: center;
  color: white;
`;

const FutureForecastContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default HomeScreen;
