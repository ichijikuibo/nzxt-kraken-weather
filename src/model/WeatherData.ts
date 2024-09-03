export interface WeatherData {
    current: {
        time: Date;
        temperature: number;
        weatherCode: number;
        windSpeed: number;
        windDirection: number;
        isDay: boolean;
    };
}