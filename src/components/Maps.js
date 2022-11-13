import { useEffect, useState } from "react";
import { usePenaltyContext } from "../PenaltyContext";

let looked;
const tInterval = 200;

export default function Maps() {
  const {
    awareness,
    setAwareness,
    deductSpeed,
    lookedLR,
    setLookedLR,
    speedPenalty,
    setSpeedPenalty,
    deductAwareness,
  } = usePenaltyContext();

  let stopped = false;
  const [curr, setCurr] = useState({
    speed: 0,
    longitude: 0,
    latitude: 0,
    accuracy: 0,
  });
  let stop = false;
  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(success, error, options);
      looked = lookedLR;
    }, tInterval);
    return () => {
      clearInterval(interval);
    };
  }, [lookedLR]);

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    // if (pos.coords.speed === 0 && !stopped) {
    //   //stopped after driving
    //   stopped = true;
    //   console.log("stopped");
    // } else if (stopped && pos.coords.speed > 0) {
    //   //started to drive from stop
    //   if (!looked) {
    //     //didn't look
    //     console.log("forgot to look!");
    //     deductAwareness();
    //     // setAwareness(5);
    //   }
    //   console.log("looked!");
    //   stopped = false;
    //   looked = false;
    // } else if (looked && !stopped) {
    //   //driving and looked, which is useless
    //   looked = false;
    // }

    if (pos.coords.speed === 0 && !stop) {
      stop = true;
      looked = false;
    }
    if (stop && pos.coords.speed > 1) {
      stop = false;
      if (!looked) {
        deductAwareness();
      }
      setLookedLR(false);
    }

    if (pos.coords.speed * 2.237 > 25) {
      deductSpeed();
    }
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
      {/* <div>
        Speed is{" "}
        {curr.speed === undefined ? "undefined" : curr.speed * 2.237 + "mph"}
      </div>
      <div>
        Coordinates: {curr.latitude}, {curr.longitude}
      </div>
      <div>Speeding? {curr.speed * 2.237 > 25 ? "yes" : "no"}</div> */}

      <iframe
        src={directionsToRestStop}
        title="Directions to Rest Stop"
        style={{ width: "100%", height: "100%" }}
      ></iframe>
      {/* <div>Stopped: {curr.speed === 0 ? "yes" : "no"}</div>
      <div>Looked left and right: {looked ? "yes" : "no"}</div> */}
    </div>
  );
}
