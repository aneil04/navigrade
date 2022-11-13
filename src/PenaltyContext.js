import React, { useContext, useState } from "react";

const PenaltyContext = React.createContext();

export function usePenaltyContext() {
  return useContext(PenaltyContext);
}

export function PenaltyProvider({ children }) {
  const [focus, setFocus] = useState(0);
  const [awareness, setAwareness] = useState(0);
  const [speedPenalty, setSpeedPenalty] = useState(0);

  const [lookedLR, setLookedLR] = useState(false);

  function deductSpeed() {
    setSpeedPenalty((speedPenalty) => speedPenalty + 0.25);
  }

  function deductFocus() {
    setFocus((focus) => focus + 0.5);
    // var map = document.getElementById("Map");
    // if (focus > 5){
    //   map.style.display = "none";
    // }
    // else {
    //   map.style.display = "block";
    // }
  }

  function deductAwareness() {
    setAwareness((awareness) => awareness + 5);
  }

  const value = {
    speedPenalty,
    deductSpeed,
    deductFocus,
    deductAwareness,
    focus,
    awareness,
    setAwareness,
    lookedLR,
    setLookedLR,
  };

  return (
    <PenaltyContext.Provider value={value}>{children}</PenaltyContext.Provider>
  );
}
