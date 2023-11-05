import { useState, useEffect, useRef } from 'react';
import './Popup.css';
import '../../assets/fonts.css'





function Popup({state, name, year, cumulative, capita}){
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
                    <p>Per Capita C02 emissions in {year}: <b>{Number(capita).toFixed(2)}</b> tons of C02</p>
                </div>
        </div>
    );
}

export default Popup;
