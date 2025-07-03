import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false); // check of dark mode aan staat, standaard is die uit

    useEffect(() => { // check of de gebruiker laatste keer zijn dark mode aan had staan of niet
        (async () => {
            const savedMode = await AsyncStorage.getItem('darkMode');
            if (savedMode !== null) {
                setDarkMode(savedMode === 'true'); // als die aan stond zet darkmode aan anders uit
            }
        })();
    }, []);

    const toggleDarkMode = async (value) => { // functie om dark mode aan of uit te zetten
        setDarkMode(value);
        await AsyncStorage.setItem('darkMode', value.toString());
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
