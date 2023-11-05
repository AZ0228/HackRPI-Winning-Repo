import * as React from 'react';
import Box from '@mui/material/Box';
// import Slider from '@mui/material/Slider';
import Slider from '@mui/joy/Slider';
import './Styles.css';
import {useEffect, useState} from "react";
import data from "../../assets/data.geojson";
import { useFectchYear } from '../../hooks/useFetchYear.js';

const VerticalSlider = () => {
  const [currentYear, setCurrentYear] = useState(valToYear(226));

  function valToYear(currentValue) {
    if (0 <= currentValue && currentValue <= 5) {
      return (1750 + 10*currentValue);
    } else {
      return (1800 + (currentValue - 5));
    }
  }

  useEffect(() => {
    console.log(currentYear);
  });


  return (
      <div style={{height: '60%', width:"fit-content"}}>
        <Slider
            color="danger"
            orientation="vertical"
            size="lg"
            valueLabelDisplay="off"
            variant="solid"
            max={226}
            min={0}
            defaultValue={226}
            onChange={(event, value) => {
              setCurrentYear(valToYear(value));
            }
            }

        />
      </div>

  );
}
export default VerticalSlider;