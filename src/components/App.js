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
    const {focus, speed, awareness} = usePenaltyContext();

    return (
        <div>{100 - focus - awareness - speed}</div>
    )
}