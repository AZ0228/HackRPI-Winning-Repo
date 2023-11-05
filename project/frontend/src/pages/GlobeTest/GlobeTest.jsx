import { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import data from '../../assets/data.geojson';
import earthBlueGreen from '../../assets/earth-blue-marble.jpeg';
import earthDark from '../../assets/earth-dark.jpeg';
import earthDay from '../../assets/earth-day.jpeg'
import * as d3 from "d3";

const GlobeTest = () => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: []});
  const [altitude, setAltitude] = useState(0.03);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;
    globeEl.current.controls().enableZoom = false;
    globeEl.current.pointOfView({ altitude: 2.7 }, 3000);
  }, []);

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
      <div className="globe" style={{ margin: 'auto auto' }}>
        <Globe
            ref={globeEl}
            showAtmosphere={true}
            atmosphereColor={'rgb(40,40,40)'}
            globeImageUrl={earthDark}
            backgroundColor={'rgb(65,65,65)'}
            polygonsData={countries.features.filter((d) => d.properties.ISO_A2 !== 'AQ')}
            polygonAltitude={altitude}
            polygonCapColor={() => baseAvg_cap}
            polygonSideColor={() => baseAvg_side}
            polygonLabel={({ properties: d }) => `
              <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
              Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
            `}
            onPolygonClick={(polygon,event, {polyLat, polyLng, polyAlt}) => {
              console.log("Polygon clicked: ", polygon.properties.ADMIN, polygon);
              // console.log("Poly Coords: LAT-" + polyLat + "| LNG-" + polyLng + "| ALT-" + polyAlt);
            }}
            polygonsTransitionDuration={transitionDuration}
        />
      </div>
  );
}
export default GlobeTest;