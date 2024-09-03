import React, { useEffect,useState } from 'react';
import SearchResults from './SearchResults';
import { SearchResult } from '../model/SearchResult';
import { useConfig } from '../hooks/useConfig';

function Config() {
   const [searchQuery, setSearchQuery] = useState('');
   const [currentInput, setCurrentInput] = useState('');
   const [colour,setColour] = useState('black');
   const [staticImages,setStaticImages] = useState(false);
   const config = useConfig();

   const saveLatLng = (result: SearchResult) => {
        console.log(result);
         localStorage.setItem('lat',result.latitude.toString());
         localStorage.setItem('lng',result.longitude.toString());
         localStorage.setItem('name',result.name);
         localStorage.setItem('country',result.country);

         window.dispatchEvent(new Event("configChanged"));
   }
   useEffect(() => {
    var initialValue = config.name + ', ' + config.country;
    setCurrentInput(initialValue);
    setColour(config.textColour);
    setSearchQuery(initialValue);
    setStaticImages(config.staticImages);
   }, [config])
   const updateColour = () => {
         localStorage.setItem('textColour',colour);
         window.dispatchEvent(new Event("configChanged"));
   }
   const updateStaticImages = (e:React.ChangeEvent<HTMLInputElement>) => {
        setStaticImages(e.target.checked);
        localStorage.setItem('staticImages',e.target.checked.toString());
        window.dispatchEvent(new Event("configChanged"));
   }


    
    return (
        <div className="config">
            <h2>Weather Configuration</h2>
            <div className='configRow'>
                <div className='configLabel'>Text Colour:</div>
                <div className='configValue' >{colour}</div>
                <input className='configButton' type='color' value={colour} onChange={(e)=>setColour(e.target.value)} onBlur={()=>updateColour()}></input>
                <div className='configLabel'>Static Images:</div>
                <input className='' type='checkbox' checked={staticImages} onChange={updateStaticImages} />
            </div>
            <div className='configRow'>
                <div className='configLabel'>Current Location:</div>
                <div className='configValue'>{config.name}, {config.country}</div>
            </div>
            <div className='configRow'>
                <div className='configLabel'>Update Location:</div>
                <input className='configValue' type='text' value={currentInput} onChange={(e)=>setCurrentInput(e.target.value)}></input> 
                <button className='configButton' onClick={()=>setSearchQuery(currentInput)}>Search</button>
            </div>
            
            <SearchResults searchQuery={searchQuery} resultSelcted={saveLatLng}></SearchResults>
        </div>
      );
}
export default Config;