"use client"
import { useState } from "react";

export default function RadioSwitch({ onSwitch }) {
    const [isCustomImport, setIsCustomImport] = useState(false);

    const handleSwitch = (event) => {
        const isCustom = event.target.checked;
        setIsCustomImport(isCustom);
        onSwitch(isCustom); // Inform parent component of switch change
    };

    return (
        <div className="form-check form-switch">
            <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                id="importSwitch" 
                checked={isCustomImport} 
                onChange={handleSwitch} 
            />
        </div>
    );
}
