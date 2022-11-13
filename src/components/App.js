import { useState } from "react";
import { PenaltyProvider } from "../PenaltyContext";
import { usePenaltyContext } from "../PenaltyContext";

import Maps from "./Maps";
import FaceTrack from "./FaceTrack";

export default function App() {
  return (
    <div>
      <PenaltyProvider>
        <Score></Score>
        <FaceTrack></FaceTrack>
        <Maps></Maps>
      </PenaltyProvider>
    </div>
  );
}

function Score() {
  const { focus, speedPenalty, awareness } = usePenaltyContext();

  return (
    <div>
      <div>f{focus}</div>
      <div>s{speedPenalty}</div>
      <div>a{awareness}</div>
    </div>
  );
}
