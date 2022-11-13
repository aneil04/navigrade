import { useState } from "react";
import { PenaltyProvider } from "../PenaltyContext";
import { usePenaltyContext } from "../PenaltyContext";

import Maps from "./Maps";
import FaceTrack from "./FaceTrack";

import "../styles.css"

export default function App() {
    return (
        <div style={{ width: '60%', flexGrow: '1', margin:'auto'}}>
            <div style={{ width: '60%', flexGrow: '1', margin:'auto', backgroundColor:'blue'}}>
                <PenaltyProvider>
                    <Score></Score>
                    <FaceTrack></FaceTrack>
                    <Maps></Maps>
                </PenaltyProvider>
            </div>
        </div>
    );
}

function Score() {
    const { focus, speedPenalty, awareness } = usePenaltyContext();

    return (
        <div>
            <div id="score">{100 - focus - speedPenalty - awareness}</div>
            <div id="stack">
                <StackElement text={"SPEED"} value={speedPenalty}></StackElement>
                <StackElement text={"FOCUS"} value={focus}></StackElement>
                <StackElement text={"AWARENESS"} value={awareness}></StackElement>
            </div>
        </div>
    );
}

function StackElement({ text, value }) {
    return (
        <div className="stack-element">
            <div className="stack-txt1">{text}</div>
            <div className="stack-txt2">{value}</div>
        </div>
    )
}