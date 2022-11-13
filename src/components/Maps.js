import { useEffect, useState } from "react";
import { usePenaltyContext } from "../PenaltyContext";

const tInterval = 200;

export default function Maps() {
  const { awareness, setAwareness, speedPenalty, setSpeedPenalty } =
    usePenaltyContext();

  const [curr, setCurr] = useState({
    speed: 0,
    longitude: 0,
    latitude: 0,
    accuracy: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(success, error, options);

      if (curr.speed * 2.237 > 25) {
        console.log("speeding!");
        setSpeedPenalty((speedPenalty) => speedPenalty - 0.25);
      }
    }, tInterval);

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
    setCurr(pos.coords);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const directionsToRestStop =
    "https://www.google.com/maps/embed/v1/directions?key=AIzaSyDHELU80v3hvP7to-fr5jNbNYMFL6e3f30&origin=" +
    curr.latitude +
    "," +
    curr.longitude +
    "&destination=reststop";

  return (
    <div>
      <div>
        Speed is{" "}
        {curr.speed === undefined ? "undefined" : curr.speed * 2.237 + "mph"}
      </div>
      <div>
        Coordinates: {curr.latitude}, {curr.longitude}
      </div>
      <div>+- {curr.accuracy}</div>
      <div>Speeding? {curr.speed * 2.237 > 25 ? "yes" : "no"}</div>
      <iframe
        src={directionsToRestStop}
        title="Directions to Rest Stop"
      ></iframe>
    </div>
  );
}
