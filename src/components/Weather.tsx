import React, { useEffect } from "react";
import { useGetWeather } from "../hooks/useGetWeather";

import { MonitoringData } from "@nzxt/web-integrations-types/v1";
import { useConfig } from "../hooks/useConfig";
import { LottieOptions, useLottie } from "lottie-react";
import { weatherMap } from "../Data/weathercodes";



function Weather() {
  const [cpuTemp, setCpuTemp] = React.useState(0);
  const [gpuTemp, setGpuTemp] = React.useState(0);
  const [liquidTemp, setLiquidTemp] = React.useState(0);
  const [weatherData] = useGetWeather();
  const [windDirection, setWindDirection] = React.useState(0);
  const [weatherDescription, setWeatherDescription] = React.useState("Sunny");
  const [imageOptions, setImageOptions] = React.useState<LottieOptions>({
    loop: true,
    autoplay: true,
    animationData: null,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      hideOnTransparent: true,
    },
  });
  const config = useConfig();
  const { View } = useLottie(imageOptions);

  useEffect(() => {
    if (weatherData!) {
      setWindDirection(weatherData.current.windDirection);
      if (weatherData.current.weatherCode in weatherMap) {
        if (weatherData.current.isDay) {
          setWeatherDescription(
            weatherMap[weatherData.current.weatherCode].day.text
          );
        } else {
          setWeatherDescription(
            weatherMap[weatherData.current.weatherCode].night.text
          );
        }
      }
      var file = require(`../Assets/animations/Day/1.json`);
      try {
        if (weatherData.current.isDay)
          file = require(`../Assets/animations/${
            weatherMap[weatherData.current.weatherCode].day.icon
          }`);
        else
          file = require(`../Assets/animations/${
            weatherMap[weatherData.current.weatherCode].night.icon
          }`);
      } catch (e) {
        if (weatherData.current.isDay)
          file = require(`../Assets/animations/Day/1.json`);
        else file = require(`../Assets/animations/Night/1.json`);
      }
      setImageOptions({
        loop: config.staticImages ? false : true,
        autoplay: config.staticImages ? false : true,
        animationData: file,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
          hideOnTransparent: true,
        },
      });
    }
  }, [weatherData, config]);

  const getTempertureDisplay = () => {  
    if(config.tempertureDisplay === 0){
      return(
        <div className="column">
          <div className="tempTitle">CPU</div>
          <div className="tempReading">{cpuTemp}°C</div>
        </div>
      )
    }
    if(config.tempertureDisplay === 1){
      return(
        <div className="column">
          <div className="tempTitle">GPU</div>
          <div className="tempReading">{gpuTemp}°C</div>
        </div>
      )
    }
    if(config.tempertureDisplay === 2){
      return(
        <div className="column">
          <div className="tempTitle">Liquid</div>
          <div className="tempReading">{liquidTemp}°C</div>
        </div>
      )
    }
  }

  window.nzxt = {
    v1: {
      onMonitoringDataUpdate: (data) => {
        const { cpus,gpus,kraken }: MonitoringData = data;        
        if (cpus.length > 0) {
          let cpu = cpus[0];
          setCpuTemp(cpu.temperature ? Math.round(cpu.temperature) : 0);
        }
        if (gpus.length > 0) {
          let gpu = gpus[0];
          const nvidiaGpus = gpus.filter((gpu) => gpu.name.includes("NVIDIA"));
          const amdGpus = gpus.filter((gpu) => gpu.name.includes("AMD"));
          const intelGpus = gpus.filter((gpu) => gpu.name.includes("Intel"));
          setGpuTemp(gpu.temperature ? Math.round(gpu.temperature) : 0);
          if(nvidiaGpus.length > 0){
            setGpuTemp(nvidiaGpus[0].temperature ? Math.round(nvidiaGpus[0].temperature) : 0);
          }
          else if(amdGpus.length > 0){
            setGpuTemp(amdGpus[0].temperature ? Math.round(amdGpus[0].temperature) : 0);
          }
          else if(intelGpus.length > 0){
            setGpuTemp(intelGpus[0].temperature ? Math.round(intelGpus[0].temperature) : 0);
          }
          
        }

        if (kraken) {
          setLiquidTemp(kraken.liquidTemperature ? Math.round(kraken.liquidTemperature) : 0);
        }
      },
      width: 640,
      height: 640,
      shape: "circle",
      targetFps: 15,
    },
  };
  return (
    <div className="weatherContainer" style={{ color: config.textColour }}>
      <div
        className="background"
        style={{
          backgroundColor: weatherData?.current.isDay ? "skyblue" : "#222222",
        }}
      >
        <div>{View}</div>
      </div>
      <div className="container">
        <div className="row">
          <div className="header">
            <div className="locationName">{config.name}</div>
            <div className="weatherDescription">{weatherDescription}</div>
          </div>
        </div>
        <div className="row" style={{flexGrow:1}}>
          <div className="column">
            <div className="tempTitle">Outside</div>
            <div className="tempReading">
              {Math.round(weatherData ? weatherData?.current.temperature : 0)}°C
            </div>
          </div>
          {getTempertureDisplay()}  
        </div>
        <div className="row">
          <div className="windContainer">
            <div className="windDetails">
              <div className="windTitle">Wind</div>
              <div className="windSpeed">
                {Math.round(weatherData ? weatherData?.current.windSpeed : 0)}{" "}
                km/h
              </div>
            </div>
            <div
              className="windArrow"
              style={{
                transform: "rotate(" + windDirection + "deg)",
                backgroundColor: config.textColour,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Weather;
