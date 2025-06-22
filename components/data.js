import React, { createContext, useState, useEffect } from 'react';

// Context aanmaken
export const waterStationsData = createContext();

// Provider component
export function DataProvider({ children }) {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        async function fetchStations() {
            try {
                const result = await fetch('https://raw.githubusercontent.com/Chrisssss15/watertappunten/refs/heads/main/public_water_taps.json');
                const data = await result.json();
                setStations(data);
            } catch (error) {
                console.error('Fout bij het ophalen van stations:', error);
            }
        }
        fetchStations();
    }, []);

    return (
        <waterStationsData.Provider value={stations}>
            {children}
        </waterStationsData.Provider>
    );
}
