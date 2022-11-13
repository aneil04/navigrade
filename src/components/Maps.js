import { useEffect, useState } from "react";
import { usePenaltyContext } from "../PenaltyContext";

const tInterval = 200;

export default function Maps() {
  const [directionsToRestStop, setDirectionsToRestStop] = useState("");
  const {
    awareness,
    setAwareness,
    deductSpeed,
    lookedLR,
    setLookedLR,
    focus,
  } = usePenaltyContext();

  const [curr, setCurr] = useState({
    speed: 0,
    longitude: 0,
    latitude: 0,
    accuracy: 0,
  });

  const [prev, setPrev] = useState({
    speed: 0,
    longitude: 0,
    latitude: 0,
    accuracy: 0,
  });

  const [latestAcc, setLatestAcc] = useState(0);

  let stopped = true;

  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(success, error, options);

      if (curr.speed * 2.237 > 20) {
        console.log("speeding!");
        deductSpeed();
      }

      if (curr.speed === 0 && !stopped) {
        //stopped after driving
        stopped = true;
        console.log("stopped");
      } else if (stopped && curr.speed > 3) {
        //started to drive from stop
        if (!lookedLR) {
          //didn't look
          console.log("forgot to look!");
          setAwareness(5);
        }
        console.log("looked!");
        stopped = false;
        setLookedLR(false);
      } else if (lookedLR && curr.speed > 3) {
        //driving and looked, which is useless
        setLookedLR(false);
      }

      if (focus > 5) {
        setDirectionsToRestStop(
          "https://www.google.com/maps/embed/v1/directions?key=AIzaSyATtYqu5IaAmRrD3nXFs5XxIeWto1Tj6uc&origin=" +
            curr.latitude +
            "," +
            curr.longitude +
            "&destination=reststop"
        );
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
    setPrev(curr);
    setCurr(pos.coords);

    setLatestAcc((curr.speed - prev.speed) / (200 / 1000));
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  return (
    <div>
      <div>focus: {focus}</div>
      <div>
        Speed is {curr.speed * 2.237} mph
      </div>
      <div>
        Coordinates: {curr.latitude}, {curr.longitude}
      </div>
      <div>+- {curr.accuracy}</div>
      <div>Acceleration: {latestAcc}</div>
      <div>
        Speeding? {curr.speed * 2.237 > 20 ? "yes" : "no"}
      </div>
      <iframe
        src={directionsToRestStop}
        title="Directions to Rest Stop"
      ></iframe>
    </div>
  );
}
