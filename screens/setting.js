import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import {StyleSheet, Text, View, Switch, ScrollView,} from 'react-native';

import { ThemeContext } from '../components/themeContext';


export default function Setting() {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    const containerStyle = [
        styles.container,
        { backgroundColor: darkMode ? '#121212' : '#fff' },
    ];
    const textStyle = {
        color: darkMode ? '#fff' : '#000',
    };

    return (
        <ScrollView contentContainerStyle={containerStyle}>
            <Text style={[styles.title, textStyle]}>Over deze app</Text>
            <Text style={[styles.paragraph, textStyle]}>
                tekst over de app, wat het doet en waarom het is gemaakt.
            </Text>

            <View style={styles.switchRow}>
                <Text style={[styles.label, textStyle]}>Dark Mode</Text>
                <Switch
                    value={darkMode}
                    onValueChange={toggleDarkMode}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={darkMode ? '#ffffff' : '#f4f3f4'}
                />
            </View>

            <StatusBar style={darkMode ? 'light' : 'dark'} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 24,
        lineHeight: 22,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    label: {
        fontSize: 16,
    },
});
