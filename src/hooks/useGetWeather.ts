import { fetchWeatherApi } from 'openmeteo';
import { WeatherData } from '../model/WeatherData';
import React, { useEffect } from 'react';
import { LatLng } from '../model/LatLng';
import { useConfig } from './useConfig';



export const useGetWeather = () => {
    const [weatherData, setWeatherData] = React.useState<WeatherData>();
    const [currentLatLng, setCurrentLatLng] = React.useState<LatLng|null>(null);
    const config = useConfig();


    useEffect(()=>{
        if(currentLatLng !== null){
            const intervalId = setInterval(() => {
                getCurrentWeather(currentLatLng);
            }, 360000);
            getCurrentWeather(currentLatLng);
            return () => clearInterval(intervalId)
        }
    },[currentLatLng]);

    useEffect(() => {
        if(currentLatLng === null || config.lat !== currentLatLng.lat || config.lng !== currentLatLng.lng){
            setCurrentLatLng({lat:config.lat,lng:config.lng});            
        }
    }, [config,currentLatLng])
    
    
    const getCurrentWeather = async (currentLatLng:LatLng) => {    
        const params = {
            latitude: [currentLatLng.lat],
            longitude: [currentLatLng.lng],
            current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day'
        };

        const url = 'https://api.open-meteo.com/v1/forecast';
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];
        const current = response.current()!;
        const utcOffsetSeconds = response.utcOffsetSeconds();

        setWeatherData( {
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature: current.variables(0)!.value(), // Current is only 1 value, therefore `.value()`
                weatherCode: current.variables(1)!.value(),
                windSpeed: current.variables(2)!.value(),
                windDirection: current.variables(3)!.value(),
                isDay: current.variables(4)!.value()===0?false:true
            }
        });
    };
    return [weatherData];
};