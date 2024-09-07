import { useEffect, useState } from "react";
import { ConfigModel } from "../model/ConfigModel";


export function useConfig(): ConfigModel {
    const [config, setConfig] = useState<ConfigModel>({
        lat: 54.99904128072734, 
        lng: -7.316603544015044,
        name: 'Derry',
        country: 'United Kingdom',
        textColour: 'red',
        staticImages: false,
        tempertureDisplay: 0
    });
    useEffect(() => {
        const lat = Number(localStorage.getItem('lat')|| 54.99904128072734);
        const lng = Number(localStorage.getItem('lng')|| -7.316603544015044);
        const name = localStorage.getItem('name') || 'Derry';
        const country = localStorage.getItem('country') || 'United Kingdom';
        const textColour = localStorage.getItem('textColour') || 'red';
        const staticImages = localStorage.getItem('staticImages') === 'true';
        const tempertureDisplay = Number(localStorage.getItem('tempertureDisplay') || 0);
        setConfig({lat,lng,name,country,textColour,staticImages,tempertureDisplay});
    },[]);
    window.addEventListener("storage", (event) => {
        if(event.key === 'lat' || event.key === 'lng' || event.key === 'name' || event.key === 'country'){
            const lat = Number(localStorage.getItem('lat'));
            const lng = Number(localStorage.getItem('lng'));
            const name = localStorage.getItem('name') || '';
            const country = localStorage.getItem('country') || '';
            setConfig({...config,lat,lng,name,country});
        }
        if(event.key === 'textColour'){
            const textColour = localStorage.getItem('textColour') || 'red';
            setConfig({...config,textColour});
        }
        if(event.key === 'staticImages'){
            const staticImages = localStorage.getItem('staticImages') === 'true';
            setConfig({...config,staticImages});
        }
        if(event.key === 'tempertureDisplay'){
            const tempertureDisplay = Number(localStorage.getItem('tempertureDisplay') || 0);
            setConfig({...config,tempertureDisplay});
        }
      });
    window.addEventListener("configChanged", () => {
        const lat = Number(localStorage.getItem('lat'))|| 54.99904128072734;
        const lng = Number(localStorage.getItem('lng'))|| -7.316603544015044;
        const name = localStorage.getItem('name') || 'Derry';
        const country = localStorage.getItem('country') || 'United Kingdom';
        const textColour = localStorage.getItem('textColour') || '#FF0000';
        const staticImages = localStorage.getItem('staticImages') === 'true';
        const tempertureDisplay = Number(localStorage.getItem('tempertureDisplay') || 0);
        setConfig({lat,lng,name,country,textColour,staticImages,tempertureDisplay});
    });

    return config;
}