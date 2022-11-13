import { useEffect, useState } from "react";
import { usePenaltyContext } from "../PenaltyContext";

const tInterval = 200;

export default function Maps() {
  const [directionsToRestStop, setDirectionsToRestStop] = useState("");
  const { awareness, setAwareness, deductSpeed, lookedLR, setLookedLR, focus } =
    usePenaltyContext();

  const [curr, setCurr] = useState({
    speed: 0,
    longitude: 0,
    latitude: 0,
    accuracy: 0,
  });

  let stopped = true;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (pos) {
        setCurr(pos.coords);
      });
    }

    if (curr.speed * 2.237 > 3) {
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

    // if (focus > 5) {
    //   setDirectionsToRestStop(
    //     "https://www.google.com/maps/embed/v1/directions?key=AIzaSyATtYqu5IaAmRrD3nXFs5XxIeWto1Tj6uc&origin=" +
    //       curr.latitude +
    //       "," +
    //       curr.longitude +
    //       "&destination=reststop"
    //   );
    // }
  }, []);

  return (
    <div>
      <div>focus: {focus}</div>
      <div>Speed is {curr.speed * 2.237} mph</div>
      <div>
        Coordinates: {curr.latitude}, {curr.longitude}
      </div>
      <div>
        Speeding?{" "}
        {curr.speed * 2.237 > 1
          ? () => {
              deductSpeed();
            }
          : "no"}
      </div>
      <iframe
        src={directionsToRestStop}
        title="Directions to Rest Stop"
      ></iframe>
    </div>
  );
}
