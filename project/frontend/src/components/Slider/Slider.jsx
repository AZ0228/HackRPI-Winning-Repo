import * as React from 'react';
import Box from '@mui/material/Box';
// import Slider from '@mui/material/Slider';
import Slider from '@mui/joy/Slider';

import './Styles.css';

export default function VerticalSlider() {
  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
  }

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

        />
      </div>

  );
}