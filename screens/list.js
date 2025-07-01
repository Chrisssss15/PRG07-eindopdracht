import React, { useEffect, useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { waterStationsData } from '../components/data';
import * as Location from 'expo-location';

// Afstand berekenen (dichtsbijzijnde tappunt)
function getAfstandInKm(lat1, lon1, lat2, lon2) {
    const kmPerGraad = 111; // 1 graad ≈ 111 km
    const deltaLat = lat2 - lat1;
    const deltaLon = (lon2 - lon1) * Math.cos(lat1 * Math.PI / 180);
    const afstand = Math.sqrt(deltaLat ** 2 + deltaLon ** 2) * kmPerGraad;
    return afstand;
}

// de lijst van tappunten wordt toont
export default function List() {
    const stations = useContext(waterStationsData); // haal alle tappunten op uit context
    const [sortedStations, setSortedStations] = useState([]); // stations gesorteerd op afstand
    const [loading, setLoading] = useState(true); // laadstatus

    // 📝 useEffect haalt locatie op & sorteert tappunten op afstand
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                alert('Locatie toestemming geven!');
                setSortedStations(stations);
                setLoading(false);
                return;
            }

            // 🧭 Huidige locatie gebruiker ophalen
            let loc = await Location.getCurrentPositionAsync({});
            const userLat = loc.coords.latitude;
            const userLon = loc.coords.longitude;

            // 🧮 Voeg afstand toe aan elk tappunt
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

            // 📊 Sorteer tappunten op afstand
            const sorted = withDistance.sort((a, b) => a.distance - b.distance);
            setSortedStations(sorted);
            setLoading(false);
        })();
    }, [stations]);

    // Laat zien wanneer het bezig is met laden
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#008484" />
                <Text>Locatie ophalen...</Text>
            </View>
        );
    }

    // 📝 Render gesorteerde lijst van tappunten
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tappunten (gesorteerd op afstand)</Text>
            <FlatList
                data={sortedStations}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.name}>{item.name || 'Naam onbekend'}</Text>
                        <Text style={styles.sub}>
                            {item.city || 'Plaats onbekend'} - {item.street || 'Straat onbekend'}
                        </Text>
                        {item.distance !== undefined && item.distance !== Infinity && (
                            <Text style={styles.sub}>
                                {item.distance.toFixed(2)} km
                            </Text>
                        )}
                    </View>
                )}
            />
            <StatusBar style="auto" />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
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
        color: '#2B3D25',
    },
    sub: {
        fontSize: 14,
        color: '#666',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
