import { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import data from '../../assets/data.geojson';
import earthBlueGreen from '../../assets/earth-blue-marble.jpeg';
import earthDark from '../../assets/earth-dark.jpeg';
import earthDay from '../../assets/earth-day.jpeg'
import * as d3 from "d3";
import {useFetchEmissions} from "../../hooks/useFetchEmissions";
import {useFetchYear} from "../../hooks/useFetchYear";
import VerticalSlider from "../../components/Slider/Slider";
import Popup from "../../components/Popup/Popup";

const Earth = () => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: []});
  const [altitude, setAltitude] = useState(0.03);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [focusState, setFocusState] = useState('globe');

  const [clickedCountry, setClickedCountry] = useState(null);
  const [year, setYear] = useState(2021);

  const {countryEmissions,loading,error} =  useFetchEmissions(clickedCountry);
  const {yearEmissions, yearLoading, yearError} = useFetchYear(year);

  useEffect(() => {
    // load data
    fetch(data)
        .then((res) => res.json())
        .then((countries) => {
          setCountries(countries);
          // setTimeout(() => {
          //   setTransitionDuration(1000);
          //   setAltitude(() => feat => Math.max(0.05, Math.sqrt(+feat.properties.POP_EST) * 2e-5));
          // }, 3000); use max for emissions color gradient????
        });
  }, []);

  const transitionSpeed = 3000;
  let initialCenter = { latitude: 23.0, longitude: -80.0, altitude: 1.7 };
  let firstCenter = true;

  useEffect(() => {
    if (globeEl.current && focusState === 'globe') {
      // Auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableZoom = false;
      // globeEl.current.pointOfView({ altitude: 2.7 }, 3000);
      if (firstCenter) {
        const mapCenter = {
          lat: initialCenter.latitude,
          lng: initialCenter.longitude,
          altitude: initialCenter.altitude
        };

        globeEl.current.pointOfView(mapCenter, transitionSpeed);
      }
      console.log("POV ran...")
    }
  });

  setTimeout(() =>{
    document.querySelector('#title1').style.display = 'none'
    document.querySelector('#earth').style.display = 'none'
    document.querySelector('#title2').style.display = 'flex'
    document.querySelector('#fire').style.display = 'flex'
  }, 5000)

  setTimeout(() =>{
    document.querySelector('#title2').style.display = 'none'
    document.querySelector('#fire').style.display = 'none'
  }, 5000)



  const handleResize = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const baseGreen_cap = 'rgba(7,120,0,0.55)';
  const baseGreen_side = 'rgba(0,54,0,0.3)';

  const baseAvg_cap = 'rgba(232,121,41,0.55)';
  const baseAvg_side = 'rgba(138,59,0,0.3)';

  return (
      <div style={{ display: 'flex', justifyItems: 'center', position: 'absolute', width: '100%', height: '100vh', overflow:'hidden'}}>
        <div id="title2" style={{ display: 'none',width: '100%', fontSize: '120px', marginTop: '80px', textAlign: 'center' }}>Is On <a>Fire</a>.</div>
        <img id='fire' style={{display: 'none'}} src='../../assets/Main%20Flame.png' alt='fire'></img>
        <div id="title1" style={{ width: '100%', display: 'flex', fontSize: '120px', marginTop: '80px', textAlign: 'center' }}>Our Beautiful World...</div>
      <div className="globe" style={{width: '100%', height: 'auto', position: 'fixed', marginTop: '470px', overflow:'hidden'}}>
        <Globe id='earth'
            ref={globeEl}
            showAtmosphere={true}
            atmosphereColor={'rgb(40,40,40)'}
            globeImageUrl={earthDay}
            backgroundColor={'rgb(255,255,255)'}
            polygonsData={countries.features.filter((d) => d.properties.ISO_A2 !== 'AQ')}
            polygonAltitude={altitude}
            polygonCapColor={() => baseGreen_cap}
            polygonSideColor={() => baseGreen_side}
            polygonsTransitionDuration={transitionDuration}
        />

      </div>
      </div>
  );
}
export default Earth;

