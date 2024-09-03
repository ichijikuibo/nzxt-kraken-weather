import React, { useEffect } from "react";
import Config from "./components/WeatherConfig";

import "./App.css";
import Weather from "./components/Weather";

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const krakenParam = searchParams.get("kraken");
  const [isKraken, setIsKraken] = React.useState(false);

  useEffect(() => {
    if (krakenParam && krakenParam === "1") {
      setIsKraken(true);
    }
  }, [krakenParam]);


  if (isKraken) {
    return (
      <div className="App">
        <Weather />
      </div>
    );
  }
  else{
    return (
      <div className="App">
        <Config />
        <hr/>
        <div className="preview">
          <Weather />
        </div>
      </div>
    );
  }
}

export default App;
