import React, { useEffect } from "react";
import { useGetWeather } from "../hooks/useGetWeather";

import { MonitoringData } from "@nzxt/web-integrations-types/v1";
import { useConfig } from "../hooks/useConfig";
import Lottie from "react-lottie";

function Weather() {
  const [cpuTemp, setcpuTemp] = React.useState(0);
  const [weatherData] = useGetWeather();
  const [windDirection, setWindDirection] = React.useState(0);
  const [isStopped,setIsStopped] =  React.useState(false);
  const [imageOptions, setImageOptions] = React.useState({loop: true,
    autoplay: true,
    animationData: null,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  });
  const config = useConfig();




  useEffect(() => {
    if (weatherData!) {
      setWindDirection(weatherData.current.windDirection);
      setIsStopped(config.staticImages);
      setImageOptions({
        loop: config.staticImages ? false : true,
        autoplay: config.staticImages ? false : true,
        animationData:require(`../Assets/animations/${weatherData.current.isDay?'Day':'Night'}/${weatherData.current.weatherCode}.json`),
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      });
    }
  }, [weatherData,config]);


  window.nzxt = {
    v1: {
      onMonitoringDataUpdate: (data) => {
        const { cpus }:MonitoringData = data;
        if (cpus.length > 0) {
          console.log("CPUs", cpus);
          let cpu = cpus[0];
          setcpuTemp(cpu.temperature ? Math.round(cpu.temperature) : 0);
        }
      },
      width: 600,
      height: 600,
      shape: "circle",
      targetFps: 60,
    },
  };
  return (
    <div className="weatherContainer" style={{color:config.textColour}}>
      <div className="background" style={{backgroundColor: weatherData?.current.isDay?'skyblue':'#222222'}}>    <Lottie 
        options={imageOptions}
        height={600}
        width={600}
        isStopped={isStopped}
      />
    </div>
      <div className="container">
        <div className="row">
          <p className="locationName">
            {config.name}, {config.country}
          </p>
        </div>
        <div className="row">
          <div className="column">
            <div className="tempTitle">Outside</div>
            <div className="tempReading">
              {Math.round(weatherData ? weatherData?.current.temperature : 0)}°C
            </div>
          </div>
          <div className="column">
            <div className="tempTitle">CPU</div>
            <div className="tempReading">{cpuTemp}°C</div>
          </div>
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
              style={{ transform: "rotate(" + windDirection + "deg)", backgroundColor:config.textColour }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Weather;
