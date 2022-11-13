import React, { useContext, useState } from 'react'

const PenaltyContext = React.createContext();

export function usePenaltyContext() {
    return useContext(PenaltyContext);
}

export function PenaltyProvider({ children }) {
    const [focus, setFocus] = useState(0)
    const [awareness, setAwareness] = useState(0)
    const [speed, setSpeed] = useState(0)

    const [lookedLR, setLookedLR] = useState(false)

    function deductSpeed() {
        setSpeed(speed => speed - 0.25)
        alert("deduct")
    }

    function deductFocus() {
        setFocus(focus => focus + 0.5)
    }

    const value = {
        deductSpeed,
        deductFocus,
        focus, 
        awareness,
        setAwareness,
        lookedLR,
        setLookedLR
    }

    return (
        <PenaltyContext.Provider value={value}>
            {children}
        </PenaltyContext.Provider>
    )
}