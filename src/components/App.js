import { useState } from "react";
import { PenaltyProvider } from "../PenaltyContext";
import { usePenaltyContext } from "../PenaltyContext";

import Maps from "./Maps";
import FaceTrack from "./FaceTrack";

import "../styles.css"

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
      <div id="score">{100 - focus - speedPenalty - awareness}</div>
      <StackElement text={"SPEED"} value={speedPenalty}></StackElement>
      <StackElement text={"SPEED"} value={speedPenalty}></StackElement>
      <StackElement text={"SPEED"} value={speedPenalty}></StackElement>
    </div>
  );
}

function StackElement({text, value}) {
    return (
        <div className="stack-element">
            <div className="stack-txt1">{text}</div>
            <div className="stack-txt2">{value}</div>
        </div>
    )
}