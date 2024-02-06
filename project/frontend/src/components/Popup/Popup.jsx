import { useState, useEffect, useRef } from 'react';
import './Popup.css';
import '../../assets/fonts.css'
import {useFetchGPT} from "../../hooks/useFetchGPT";


function Popup({state, name, year, cumulative, capita}){
    const [popupClass,setPopupClass] = useState("hidden");

    const {data, loading, error } = useFetchGPT(name);     



    useEffect(() => {
        if (state === "globe") {
            setPopupClass("hidden");
        } else {
            setPopupClass("show");
        }
    }, [state]);
    
    if(name === null){
        return (            
        <div className="popup">
        <div className={`popup-window ${popupClass}`}>
            <p>Generating ideas...</p>
        </div>
        </div>);

    }

    if (loading) {
        return(
            <div className="popup">
                    <div className={`popup-window ${popupClass}`}>
                        <h1>{name}</h1>
                        <p>Per Capita C02 emissions in {year}:<br></br> <b>{Number(capita).toFixed(2)}</b> tons of C02</p>
                        <br></br>
                        <p>What could the {name} do to decrease their carbon footprint?</p>
                        <br></br>
                        <p className="loader"></p>
                    </div>
            </div>);
    }
    

    return (
        <div className="popup">
                <div className={`popup-window ${popupClass}`}>
                    <h1>{name}</h1>
                    <p>Per Capita C02 emissions in {year}:<br></br> <b>{Number(capita).toFixed(2)}</b> tons of C02</p>
                    <br></br>
                    <p>What could the {name} do to decrease their carbon footprint?</p>
                    <br></br>
                    <p>{data['result']}</p>
                </div>
        </div>
    );
}

export default Popup;
