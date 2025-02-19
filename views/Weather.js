import {buildGeoPosUrl, buildWeatherUrl} from "../utils/URL";
import {fetchData} from "../utils/functions";
import {formatDate} from "../utils/Date";
import Spacer from "../component/Spacer";

import {useEffect, useState} from "react";
import {Alert, Image, StyleSheet, Text, View} from "react-native";

import * as Location from 'expo-location';



function Weather() {
    const [city, setCity] = useState('');
    const [cityData, setCityData] = useState(null);

    useEffect(() => {
        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            const position = await Location.getCurrentPositionAsync({});
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            let geoUrl = buildGeoPosUrl(
                "https://api.openweathermap.org/geo/1.0/reverse",
                {lat, lon}
            );

            const geoData = await fetchData(geoUrl);

            setCity(geoData[0].name);
        }

        getCurrentLocation()
    }, []);

    useEffect(() => {
        async function getCityData(cityName) {
            let weatherUrl = buildWeatherUrl("https://api.openweathermap.org/data/2.5/weather", city);

            const weatherResult = await fetchData(weatherUrl);
            const data = {
                cityName: city,
                temperature: weatherResult.main.temp,
                weather: weatherResult.weather[0].description[0].toUpperCase() + weatherResult.weather[0].description.slice(1),
                weatherIcon: `https://openweathermap.org/img/wn/${weatherResult.weather[0].icon}.png`,
                dt_txt_custom: formatDate((new Date(weatherResult.dt*1000)).toUTCString()),
            };

            setCityData({
                ...data
            });
        }

        if (city.length) {
            getCityData(city)
        }
    }, [city]);

    return (
        <>
            <View>
                {cityData && (
                    <>
                        <Text style={styles.city}>{cityData.cityName}</Text>
                        <Text style={styles.date}>{cityData.dt_txt_custom}</Text>
                        <View style={styles.weather}>
                            <Text style={styles.weatherText}>
                                {Math.floor(cityData.temperature)} °C - {cityData.weather}
                            </Text>
                            <Image source={{uri: cityData.weatherIcon}} style={styles.weatherIcon}  />
                        </View>
                        <Spacer horizontal={false} size={100} />
                        <Text>{cityData.description}</Text>
                    </>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    city: {
        fontSize: 28,
        fontWeight: "500",
    },
    date: {
        fontSize: 14,
        fontWeight: "300",
    },
    weather: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    weatherText: {
        fontSize: 18,
        fontWeight: 400,
    },
    weatherIcon: {
        width: 30,
        height: 30,
    },
})

export default Weather;