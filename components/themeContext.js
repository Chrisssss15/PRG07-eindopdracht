import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        (async () => {
            const savedMode = await AsyncStorage.getItem('darkMode');
            if (savedMode !== null) {
                setDarkMode(savedMode === 'true');
            }
        })();
    }, []);

    const toggleDarkMode = async (value) => {
        setDarkMode(value);
        await AsyncStorage.setItem('darkMode', value.toString());
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
