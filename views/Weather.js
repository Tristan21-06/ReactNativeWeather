import {buildGeoPosUrl, buildWeatherUrl} from "../utils/URL";
import {fetchData} from "../utils/functions";
import {formatDate} from "../utils/Date";
import Spacer from "../component/Spacer";
import process from "../.env.local.js"

import {useEffect, useState} from "react";
import {Alert, Dimensions, Image, StyleSheet, Text, View, ActivityIndicator} from "react-native";
import * as Location from 'expo-location';

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

function Weather(setLoading, setImageUrl) {
    const [city, setCity] = useState('');
    const [cityData, setCityData] = useState(null);

    useEffect(() => {
        getCurrentLocation()
    }, []);

    async function getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        setLoading(true);

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

    useEffect(() => {
        if (city.length) {
            getCityData(city)
        }
    }, [city]);

    async function getCityData(cityName) {
        let weatherUrl = buildWeatherUrl("https://api.openweathermap.org/data/2.5/weather", cityName);

        const weatherResult = await fetchData(weatherUrl);
        const openaiResult = await getImageAndDescription(cityName);

        const data = {
            cityName: cityName,
            temperature: weatherResult.main.temp,
            weather: weatherResult.weather[0].description[0].toUpperCase() + weatherResult.weather[0].description.slice(1),
            weatherIcon: `https://openweathermap.org/img/wn/${weatherResult.weather[0].icon}.png`,
            dt_txt_custom: formatDate((new Date(weatherResult.dt*1000)).toUTCString()),
            description: openaiResult.description,
        };

        setImageUrl(openaiResult.imageUrl);

        setCityData({
            ...data
        });

        setLoading(false);
    }

    async function getImageAndDescription (cityName) {
        let openaiData = {};

        try {
            const imageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: `Generate a real image that represent the city ${cityName}`,
                n: 1,
                size: `1024x1024`,
            });

            const descriptionResponse = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: `Generate in french a description fitting the city "${cityName}"` }],
            });

            openaiData.imageUrl = imageResponse.data[0].url;
            openaiData.description = descriptionResponse.choices[0].message.content;
        } catch (e) {
            console.error(e)
        }



        return openaiData;
    }


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