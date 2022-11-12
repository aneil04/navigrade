import { useEffect, useState } from "react";

export function DataTest() {
  const [curr, setCurr] = useState({
    speed: 0,
    longitude: 0,
    latitude: 0,
    accuracy: 0,
  });

  const [prev, setPrev] = useState(0);

  const [latestAcc, setLatestAcc] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrev(curr);
      navigator.geolocation.getCurrentPosition(success, error, options);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const curr = pos.coords;
    setCurr(curr);

    //calc acceleration
    setLatestAcc((curr.speed - prev.speed) / 1000);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  return (
    <div>
      <div>Speed is: {curr.speed === undefined ? "undefined" : curr.speed}</div>
      <div>
        Coordinates: {curr.latitude}, {curr.longitude}
      </div>
      <div>+- {curr.accuracy}</div>
      <div>Acceleration: {latestAcc}</div>
    </div>
  );
}
