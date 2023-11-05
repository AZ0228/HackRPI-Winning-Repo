import { useState, useEffect, useRef } from 'react';
import './Popup.css';
import '../../assets/fonts.css'





function Popup({state, name, year, cumulative}){
    const [popupClass,setPopupClass] = useState("hidden");

    useEffect(() => {
        if (state === "globe") {
            setPopupClass("hidden");
        } else {
            setPopupClass("show");
        }
    }, [state]);

    return (
        <div className="popup">
                <div className={`popup-window ${popupClass}`}>
                    <h1>{name}</h1>
                    <p>Cumulative c02 emissions in {year}: <b>{cumulative}</b></p>
                </div>
        </div>
    );
}

export default Popup;
