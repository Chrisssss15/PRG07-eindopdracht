import React, { useEffect, useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { waterStationsData } from '../components/data';
import * as Location from 'expo-location';
import { ThemeContext } from '../components/themeContext';

// Afstand berekenen (dichtsbijzijnde tappunt)
function getAfstandInKm(lat1, lon1, lat2, lon2) {
    const kmPerGraad = 111;
    const deltaLat = lat2 - lat1;
    const deltaLon = (lon2 - lon1) * Math.cos(lat1 * Math.PI / 180);
    const afstand = Math.sqrt(deltaLat ** 2 + deltaLon ** 2) * kmPerGraad;
    return afstand;
}

export default function List() {
    const stations = useContext(waterStationsData);
    const [sortedStations, setSortedStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { darkMode } = useContext(ThemeContext);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                alert('Locatie toestemming geven!');
                setSortedStations(stations);
                setLoading(false);
                return;
            }

            //Huidige locatie ophalen
            let loc = await Location.getCurrentPositionAsync({});
            const userLat = loc.coords.latitude;
            const userLon = loc.coords.longitude;

            //Voeg afstand toe aan elk tappunt
            const withDistance = stations.map(station => {
                if (station.latitude && station.longitude) {
                    const dist = getAfstandInKm(
                        userLat,
                        userLon,
                        parseFloat(station.latitude),
                        parseFloat(station.longitude)
                    );
                    return { ...station, distance: dist };
                } else {
                    return { ...station, distance: Infinity };
                }
            });

            //Sorteer tappunten op afstand
            const sorted = withDistance.sort((a, b) => a.distance - b.distance);
            setSortedStations(sorted); // Zet gesorteerde lijst in state
            setLoading(false);
        })();
    }, [stations]);

    // Laat zien wanneer het bezig is met laden
    if (loading) {
        return (
            <View style={[styles.center, darkMode ? styles.darkBackground : styles.lightBackground]}>
                <ActivityIndicator size="large" color="#008484" />
                <Text style={darkMode ? styles.darkText : styles.lightText}>Locatie ophalen...</Text>
            </View>
        );
    }

    // fetch lijst van tappunten
    return (
        <View style={[styles.container, darkMode ? styles.darkBackground : styles.lightBackground]}>
            <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
                Tappunten (gesorteerd op afstand)
            </Text>
            <FlatList
                data={sortedStations}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() =>
                            navigation.navigate('ListDetail', {
                                name: item.name,
                                latitude: item.latitude,
                                longitude: item.longitude,
                            })
                        }
                        style={({ pressed }) => [
                            styles.item,
                            darkMode
                                ? pressed
                                    ? { backgroundColor: 'rgba(255,255,255,0.75)' }
                                    : { backgroundColor: '#121212' }
                                : pressed
                                    ? { backgroundColor: '#f0f0f0' }
                                    : { backgroundColor: '#fff' }
                        ]}
                    >
                        <Text style={[styles.name, darkMode ? styles.darkText : styles.lightText]}>{item.name || 'Naam onbekend'}</Text>
                        <Text style={[styles.sub, darkMode ? styles.darkSubText : styles.lightSubText]}>
                            {item.city || 'Plaats onbekend'} - {item.street || 'Straat onbekend'}
                        </Text>
                        {item.distance !== undefined && item.distance !== Infinity && (
                            <Text style={[styles.sub, darkMode ? styles.darkSubText : styles.lightSubText]}>
                                {item.distance.toFixed(2)} km
                            </Text>
                        )}
                    </Pressable>
                )}
            />
            <StatusBar style={darkMode ? "light" : "dark"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
    },
    lightBackground: {
        backgroundColor: '#fff',
    },
    darkBackground: {
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    sub: {
        fontSize: 14,
    },
    lightText: {
        color: '#2B3D25',
    },
    darkText: {
        color: '#ddd',
    },
    lightSubText: {
        color: '#666',
    },
    darkSubText: {
        color: '#aaa',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
