// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { ScrollView, ImageBackground, View } from 'react-native';
import ForecastSearch from '../components/ForecastSearch';
import CurrentForecast from '../components/CurrentForecast';
import DailyForecast from '../components/DailyForecast';
import styled from 'styled-components/native';
import config from '../config';
import bgImg from '../assets/4.png';
import PopupMenu from './PopupMenu';

const HomeScreen = ({ navigation }) => {
    const [toggleSearch, setToggleSearch] = useState("city");
    const [city, setCity] = useState("Toronto");
    const [postalCode, setPostalCode] = useState("L4W1S9");
    const [lat, setLat] = useState(43.6532);
    const [long, setLong] = useState(-79.3832);
    const [weather, setWeather] = useState({});
    const [menuVisible, setMenuVisible] = useState(false);
      
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
  
    const fetchByPostalHandler = () => {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_KEY}&components=postal_code:${postalCode}`
      )
        .then((res) => res.json())
        .then((data) => {
          setLat(data.results[0].geometry.location.lat);
          setLong(data.results[0].geometry.location.lng);
        });
    };

    const handleNotificationPress = () => {
        // Navigate to the NotificationsScreen and hide the popup menu
        navigation.navigate('Notifications');
        setMenuVisible(false);
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
          console.log("error", err);
        });
      return () => controller.abort();
    }, [lat, long]);
  
    return (
      <Container>
        <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
          <View style={{ position: "absolute", top: 20, right: 20 }}>
            <PopupMenu
              visible={menuVisible}
              onClose={() => setMenuVisible(false)}
              onNotificationPress={handleNotificationPress}
              onReportIssuePress={() => console.log('Report issue pressed')}
              onUnitsPress={() => console.log('Units pressed')}
            />
          </View>
          <ForecastSearch
            city={city}
            setCity={setCity}
            fetchLatLongHandler={fetchLatLongHandler}
            toggleSearch={toggleSearch}
            setToggleSearch={setToggleSearch}
            fetchByPostalHandler={fetchByPostalHandler}
            setPostalCode={setPostalCode}
            postalCode={postalCode}
          />
          <CurrentForecast currentWeather={weather} timezone={weather.timezone} />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
            <FutureForecastContainer>
              {weather.daily ? (
                weather.daily.map((day, index) => {
                  if (index !== 0) {
                    return <DailyForecast key={day.dt} day={day} index={index} />;
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
