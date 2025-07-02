import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import languages from "../languages/languages";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("nl");

    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem("language");
            if (saved) setLanguage(saved);
        })();
    }, []);

    const changeLanguage = async (lang) => {
        setLanguage(lang);
        await AsyncStorage.setItem("language", lang);
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                changeLanguage,
                strings: languages[language],
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};
