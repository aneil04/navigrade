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
  const directionsToRestStop =
    "https://www.google.com/maps/embed/v1/directions?key=AIzaSyDdvIYGkXBiOBdN01vPypfSbkFyWcU5jNY&origin=" +
    curr.latitude +
    "," +
    curr.longitude +
    "&destination=reststop";

  let roadSpeedLimit = 0;
  fetch(
    "	https://dev.virtualearth.net/REST/v1/Routes/SnapToRoad?key=ArB1-6SE_k8SauLXg6AH_ffgFFjaZyid7tlT9sOe08cnxyyP0aUYuKqCFyG543Tf",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        points: [{ latitude: curr.latitude, longitude: curr.longitude }],
        includeSpeedLimit: true,
        includeTruckSpeedLimit: true,
        speedUnit: "MPH",
        travelMode: "driving",
      }),
    }
  )
    .then((response) => response.json())
    .then((response) => {
      roadSpeedLimit =
        response.resourceSets[0].resources[0].snappedPoints[0].speedLimit;
    });

  const previousSpeed = curr.speed;
  return (
    <div>
      <div>
        Speed is:{" "}
        {curr.speed === undefined ? "undefined" : curr.speed * 2.237 + "mph"}
      </div>
      <div>
        Coordinates: {curr.latitude}, {curr.longitude}
      </div>
      <div>+- {curr.accuracy}</div>
      <div>Acceleration: {latestAcc}</div>
      <div>Speed Limit: {roadSpeedLimit}</div>
      <div>Speeding? {curr.speed > roadSpeedLimit + 5 ? "yes" : "no"}</div>
      <iframe
        src={directionsToRestStop}
        title="W3Schools Free Online Web Tutorials"
      ></iframe>
    </div>
  );
}
