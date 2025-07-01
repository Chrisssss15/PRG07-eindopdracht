import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { waterStationsData } from '../components/data';

export default function Map() {
    const [locations, setLocations] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [trackingReady, setTrackingReady] = useState(false);
    const stations = useContext(waterStationsData);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Toestemming geweigerd', 'locatie toestemming geven is nodig om deze functie te gebruiken.');
                setErrorMsg('Geen toestemming!');
                return;
            }

            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 1,
                    timeInterval: 1000,
                },
                (newLocation) => {
                    setLocations((prev) => [...prev, newLocation]);
                    setTrackingReady(true);
                }
            );
        })();
    }, []);

    if (!trackingReady && !errorMsg) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#008484" />
                <Text>Locatie aan het volgen...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {locations.length > 0 ? (
                <MapView
                    style={styles.map}
                    region={{
                        latitude: locations[locations.length - 1].coords.latitude,
                        longitude: locations[locations.length - 1].coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsUserLocation={true}
                >
                    {/* Huidige & vorige locaties */}
                    {locations.map((loc, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: loc.coords.latitude,
                                longitude: loc.coords.longitude,
                            }}
                            title={`Locatie ${index + 1}`}
                            description="Hier ben je geweest"
                        />
                    ))}

                    {/* Tappunten markers */}
                    {stations.map((station, index) => {
                        if (station.latitude && station.longitude) {
                            return (
                                <Marker
                                    key={`station-${index}`}
                                    coordinate={{
                                        latitude: parseFloat(station.latitude),
                                        longitude: parseFloat(station.longitude),
                                    }}
                                    title={station.name || 'Onbekend tappunt'}
                                    description={`${station.street || ''}, ${station.city || ''}`}
                                />
                            );
                        }
                        return null;
                    })}
                </MapView>
            ) : (
                <Text style={styles.center}>Wachten op eerste locatie...</Text>
            )}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

