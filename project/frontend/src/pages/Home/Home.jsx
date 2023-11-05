import { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import data from '../../assets/data.geojson';
import earthBlueGreen from '../../assets/earth-blue-marble.jpeg';
import earthDark from '../../assets/earth-dark.jpeg';
import earthDay from '../../assets/earth-day.jpeg'
import {useFetchEmissions} from "../../hooks/useFetchEmissions";
import {useFetchYear} from "../../hooks/useFetchYear";
import VerticalSlider from "../../components/Slider/Slider";
import {currentSliderYear} from '../../components/Slider/Slider';
// import {currentYear, setCurrentYear} from 'VerticalSlider';

const Home = () => {
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
  // const [year, setYear] = useState(currentSliderYear);

  const {countryEmissions,loading,error} =  useFetchEmissions(clickedCountry);
  const {yearEmissions, yearLoading, yearError} = useFetchYear(VerticalSlider.currentYear);

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
  let initialCenter = { latitude: 23.0, longitude: -80.0, altitude: 2.7 };
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
        firstCenter = false;
      }
      console.log("POV ran...")
    }
  });

  const handleResize = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const polygon = (d) => {
    if(d.properties.ADMIN === clickedCountry) {
      return altitude * 2;
    }
    return altitude
  }

  const capColor = (d) => {
    if(d.properties.ADMIN === clickedCountry) {
      return 'rgba(255,0,0,0.55)';
    }
    return 'rgba(232,121,41,0.55)'
  }

  const sideColor = (d) => {
    if(d.properties.ADMIN === clickedCountry) {
      return 'rgba(170,0,0,0.55)';
    }
    return 'rgba(138,59,0,0.3)'
  }

  function countryCenter(country) {
    const country_coords = country.geometry.coordinates[0];
    console.log(country_coords.length);
    let nestedCountryCoords = false;
    if (country_coords.length <= 1) {
      console.log(country_coords[0].length);
      nestedCountryCoords = true;
    }

    const numCoordinates =  nestedCountryCoords ? country_coords[0].length: country_coords.length;
    let x = 0;
    let y = 0;
    let z = 0;

    let realCoords = nestedCountryCoords ? country_coords[0]: country_coords;

    for (const [lat, lon] of realCoords) {
      const latRad = (lat * Math.PI) / 180;
      const lonRad = (lon * Math.PI) / 180;

      x += Math.cos(latRad) * Math.cos(lonRad);
      y += Math.cos(latRad) * Math.sin(lonRad);
      z += Math.sin(latRad);
    }

    x /= numCoordinates;
    y /= numCoordinates;
    z /= numCoordinates;

    const centerLon = Math.atan2(y, x);
    const hyp = Math.sqrt(x * x + y * y);
    const centerLat = Math.atan2(z, hyp);

    // if (nestedCountryCoords) {return [centerLat * (180 / Math.PI), centerLon * (180 / Math.PI), 1.6]; }
    return [centerLon * (180 / Math.PI), centerLat * (180 / Math.PI),  1.6];
  }

  const baseGreen_cap = 'rgba(7,120,0,0.55)';
  const baseGreen_side = 'rgba(0,54,0,0.3)';

  const baseAvg_cap = 'rgba(232,121,41,0.55)';
  const baseAvg_side = 'rgba(138,59,0,0.3)';

  return (
      <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center', alignItems: 'center', backgroundColor: 'rgb(65,65,65)'}}>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          zIndex: '50',
          position: 'absolute',
          left: '10px',
          height: '100%'}}>
          <VerticalSlider />
        </div>

        <div className="globe">
          <Globe style={{position: 'absolute'}}
              ref={globeEl}
              showAtmosphere={true}
              atmosphereColor={'rgb(40,40,40)'}
              globeImageUrl={earthDark}
              backgroundColor={'rgb(65,65,65)'}
              polygonsData={countries.features.filter((d) => d.properties.ISO_A2 !== 'AQ')}
              polygonAltitude={polygon}
              polygonCapColor={capColor}
              polygonSideColor={sideColor}
              polygonLabel={({ properties: d }) => `
                <b>${d.ADMIN} `}
              onGlobeClick={(coords, e) => {
                if (focusState !== 'globe') {
                  const mapCenter = {
                    lat: initialCenter.latitude,
                    lng: initialCenter.longitude,
                    altitude: initialCenter.altitude
                  };
                  globeEl.current.pointOfView(mapCenter, transitionSpeed);
                  globeEl.current.controls().autoRotate = true;
                  setFocusState('globe')
                }
              }}
              onPolygonClick={(polygon, e, coords)  => {
                const centerCoords = countryCenter(polygon)
                console.log("focus state is globe, focusing country... lat-" + coords.lat + "| lng-" + coords.lng + " || " +
                    "centerLat-" + centerCoords[0] + "centerLng-" + centerCoords[1])

                const latDifference = coords.lat - centerCoords[0]
                const lngDifference = coords.lng - centerCoords[1]
                let mapCenter;
                if ( Math.abs(latDifference) >= 20.0 || Math.abs(lngDifference) >= 20.0) {
                  mapCenter = {
                    lat: coords.lat,
                    lng: coords.lng,
                    altitude: centerCoords[2]
                  };
                } else {
                  mapCenter = {
                    lat: centerCoords[0],
                    lng: centerCoords[1],
                    altitude: centerCoords[2]
                  };
                }
                if (focusState === polygon.properties.ADMIN) {
                  mapCenter = {
                    lat: initialCenter.latitude,
                    lng: initialCenter.longitude,
                    altitude: initialCenter.altitude
                  };
                  globeEl.current.pointOfView(mapCenter, transitionSpeed);
                  globeEl.current.controls().autoRotate = true;
                  setFocusState('globe')
                  setClickedCountry(null)
                } else {
                  if (focusState !== 'globe' && focusState !== polygon.properties.ADMIN) {
                    setTimeout(() => {
                      globeEl.current.pointOfView(mapCenter, transitionSpeed);
                    }, 1500)
                    globeEl.current.pointOfView({altitude: 2.3}, 1700);
                  } else {
                    globeEl.current.pointOfView(mapCenter, transitionSpeed);
                  }
                  globeEl.current.controls().autoRotate = false;
                  setFocusState(polygon.properties.ADMIN)
                  setClickedCountry(polygon.properties.ADMIN);
                }
              }
              }
              polygonsTransitionDuration={transitionDuration}
          />
        </div>
      </div>
  );
}
export default Home;
