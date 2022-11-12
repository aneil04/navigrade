import { useState } from "react";

export function DataTest() {
    const [crd, setCrd] = useState({speed: 0, longitude: 0, latitude: 0, accuracy: 0});

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      function success(pos) {
        const crd = pos.coords;
        setCrd(crd);
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      
      navigator.geolocation.getCurrentPosition(success, error, options);

    return (
        <div>
            <div>Speed is: {crd.speed === undefined ? "undefined" : crd.speed}</div>
            <div>Longitude: {crd.longitude} + Latitude: {crd.latitude}</div>
            <div>+-{crd.accuracy}</div>
        </div>
    )
}