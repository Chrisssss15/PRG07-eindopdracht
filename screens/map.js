// import React, { useEffect, useState, useContext } from 'react';
// import { StyleSheet, Text, View, ActivityIndicator, Image, Animated } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { Magnetometer } from 'expo-sensors';
// import { StatusBar } from 'expo-status-bar';
// import { useRoute } from '@react-navigation/native';
// import { waterStationsData } from '../components/data';
//
// export default function Map() {
//     const [location, setLocation] = useState(null);
//     const [heading, setHeading] = useState(0);
//     const [errorMsg, setErrorMsg] = useState(null);
//     const route = useRoute();
//     const stations = useContext(waterStationsData);
//
//     const { targetLatitude, targetLongitude } = route.params || {};
//
//     useEffect(() => {
//         (async () => {
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 setErrorMsg('Geen toestemming!');
//                 return;
//             }
//
//             Location.watchPositionAsync(
//                 {
//                     accuracy: Location.Accuracy.High,
//                     distanceInterval: 1,
//                     timeInterval: 1000,
//                 },
//                 (newLoc) => {
//                     setLocation(newLoc.coords);
//                 }
//             );
//
//             const sub = Magnetometer.addListener((data) => {
//                 let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
//                 angle = angle >= 0 ? angle : angle + 360;
//                 setHeading(angle);
//             });
//
//             return () => sub.remove();
//         })();
//     }, []);
//
//     const calculateBearing = (lat1, lon1, lat2, lon2) => {
//         const toRad = deg => deg * Math.PI / 180;
//         const toDeg = rad => rad * 180 / Math.PI;
//         const dLon = toRad(lon2 - lon1);
//         const y = Math.sin(dLon) * Math.cos(toRad(lat2));
//         const x =
//             Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
//             Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
//         let brng = toDeg(Math.atan2(y, x));
//         return (brng + 360) % 360;
//     };
//
//     const direction = (location && targetLatitude && targetLongitude)
//         ? (calculateBearing(location.latitude, location.longitude, targetLatitude, targetLongitude) - heading + 360) % 360
//         : 0;
//
//     if (!location && !errorMsg) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator size="large" color="#008484" />
//                 <Text>Locatie ophalen...</Text>
//             </View>
//         );
//     }
//
//     return (
//         <View style={styles.container}>
//             {location && (
//                 <MapView
//                     style={styles.map}
//                     region={{
//                         latitude: location.latitude,
//                         longitude: location.longitude,
//                         latitudeDelta: 0.01,
//                         longitudeDelta: 0.01,
//                     }}
//                     showsUserLocation={true}
//                 >
//                     {/* Huidige tappunten */}
//                     {stations.map((station, index) => {
//                         if (station.latitude && station.longitude) {
//                             return (
//                                 <Marker
//                                     key={`station-${index}`}
//                                     coordinate={{
//                                         latitude: parseFloat(station.latitude),
//                                         longitude: parseFloat(station.longitude),
//                                     }}
//                                     title={station.name || 'Onbekend tappunt'}
//                                     description={`${station.street || ''}, ${station.city || ''}`}
//                                 />
//                             );
//                         }
//                         return null;
//                     })}
//                 </MapView>
//             )}
//
//             {/* Richtingspijl */}
//             {location && targetLatitude && targetLongitude && (
//                 <View style={styles.arrowContainer}>
//                     <Animated.View style={{ transform: [{ rotate: `${direction}deg` }] }}>
//                         <Image source={require('../assets/arrow.png')} style={styles.arrow} />
//                     </Animated.View>
//                     <Text style={styles.arrowText}>Volg de pijl naar het gekozen tappunt</Text>
//                 </View>
//             )}
//             <StatusBar style="auto" />
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     map: {
//         width: '100%',
//         height: '80%',
//     },
//     center: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     arrowContainer: {
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     arrow: {
//         width: 80,
//         height: 80,
//         resizeMode: 'contain',
//     },
//     arrowText: {
//         marginTop: 8,
//         fontSize: 16,
//         fontWeight: '600',
//     },
// });

//
// import React, { useEffect, useState, useContext } from 'react';
// import { StyleSheet, Text, View, ActivityIndicator, Image, Animated } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { Magnetometer } from 'expo-sensors';
// import { StatusBar } from 'expo-status-bar';
// import { useRoute } from '@react-navigation/native';
// import { waterStationsData } from '../components/data';
//
// import { ThemeContext } from '../components/themeContext';  // correcte import
//
// export default function Map() {
//     const [location, setLocation] = useState(null);
//     const [heading, setHeading] = useState(0);
//     const [errorMsg, setErrorMsg] = useState(null);
//     const route = useRoute();
//     const stations = useContext(waterStationsData);
//
//     const { targetLatitude, targetLongitude } = route.params || {};
//
//     const { darkMode } = useContext(ThemeContext);  // dark mode context
//
//     useEffect(() => {
//         (async () => {
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 setErrorMsg('Geen toestemming!');
//                 return;
//             }
//
//             Location.watchPositionAsync(
//                 {
//                     accuracy: Location.Accuracy.High,
//                     distanceInterval: 1,
//                     timeInterval: 1000,
//                 },
//                 (newLoc) => {
//                     setLocation(newLoc.coords);
//                 }
//             );
//
//             const sub = Magnetometer.addListener((data) => {
//                 let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
//                 angle = angle >= 0 ? angle : angle + 360;
//                 setHeading(angle);
//             });
//
//             return () => sub.remove();
//         })();
//     }, []);
//
//     const calculateBearing = (lat1, lon1, lat2, lon2) => {
//         const toRad = deg => deg * Math.PI / 180;
//         const toDeg = rad => rad * 180 / Math.PI;
//         const dLon = toRad(lon2 - lon1);
//         const y = Math.sin(dLon) * Math.cos(toRad(lat2));
//         const x =
//             Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
//             Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
//         let brng = toDeg(Math.atan2(y, x));
//         return (brng + 360) % 360;
//     };
//
//     const direction = (location && targetLatitude && targetLongitude)
//         ? (calculateBearing(location.latitude, location.longitude, targetLatitude, targetLongitude) - heading + 360) % 360
//         : 0;
//
//     if (!location && !errorMsg) {
//         return (
//             <View style={[styles.center, darkMode ? styles.darkBackground : styles.lightBackground]}>
//                 <ActivityIndicator size="large" color="#008484" />
//                 <Text style={darkMode ? styles.darkText : styles.lightText}>Locatie ophalen...</Text>
//             </View>
//         );
//     }
//
//     return (
//         <View style={[styles.container, darkMode ? styles.darkBackground : styles.lightBackground]}>
//             {location && (
//                 <MapView
//                     style={styles.map}
//                     region={{
//                         latitude: location.latitude,
//                         longitude: location.longitude,
//                         latitudeDelta: 0.01,
//                         longitudeDelta: 0.01,
//                     }}
//                     showsUserLocation={true}
//                 >
//                     {stations.map((station, index) => {
//                         if (station.latitude && station.longitude) {
//                             return (
//                                 <Marker
//                                     key={`station-${index}`}
//                                     coordinate={{
//                                         latitude: parseFloat(station.latitude),
//                                         longitude: parseFloat(station.longitude),
//                                     }}
//                                     title={station.name || 'Onbekend tappunt'}
//                                     description={`${station.street || ''}, ${station.city || ''}`}
//                                 />
//                             );
//                         }
//                         return null;
//                     })}
//                 </MapView>
//             )}
//
//             {location && targetLatitude && targetLongitude && (
//                 <View style={styles.arrowContainer}>
//                     <Animated.View style={{ transform: [{ rotate: `${direction}deg` }] }}>
//                         <Image source={require('../assets/arrow.png')} style={styles.arrow} />
//                     </Animated.View>
//                     <Text style={[styles.arrowText, darkMode ? styles.darkText : styles.lightText]}>
//                         Volg de pijl naar het gekozen tappunt
//                     </Text>
//                 </View>
//             )}
//             <StatusBar style={darkMode ? "light" : "dark"} />
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     lightBackground: {
//         backgroundColor: '#fff',
//     },
//     darkBackground: {
//         backgroundColor: '#121212',
//     },
//     map: {
//         width: '100%',
//         height: '80%',
//     },
//     center: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     arrowContainer: {
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     arrow: {
//         width: 80,
//         height: 80,
//         resizeMode: 'contain',
//     },
//     arrowText: {
//         marginTop: 8,
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     lightText: {
//         color: '#000',
//     },
//     darkText: {
//         color: '#ddd',
//     },
// });

import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, Animated, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';
import { useRoute } from '@react-navigation/native';
import { waterStationsData } from '../components/data';
import { ThemeContext } from '../components/themeContext';

export default function Map() {
    const [location, setLocation] = useState(null);
    const [heading, setHeading] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);
    const route = useRoute();
    const stations = useContext(waterStationsData);
    const { darkMode } = useContext(ThemeContext);

    const { targetLatitude, targetLongitude } = route.params || {};
    const [activeTarget, setActiveTarget] = useState(
        targetLatitude && targetLongitude
            ? { lat: targetLatitude, lon: targetLongitude }
            : null
    );

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Geen toestemming!');
                return;
            }

            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 1,
                    timeInterval: 1000,
                },
                (newLoc) => {
                    setLocation(newLoc.coords);
                }
            );

            const sub = Magnetometer.addListener((data) => {
                let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
                angle = angle >= 0 ? angle : angle + 360;
                setHeading(angle);
            });

            return () => sub.remove();
        })();
    }, []);
    useEffect(() => {
        if (targetLatitude && targetLongitude) {
            setActiveTarget({ lat: targetLatitude, lon: targetLongitude });
        }
    }, [targetLatitude, targetLongitude]);


    const calculateBearing = (lat1, lon1, lat2, lon2) => {
        const toRad = deg => deg * Math.PI / 180;
        const toDeg = rad => rad * 180 / Math.PI;
        const dLon = toRad(lon2 - lon1);
        const y = Math.sin(dLon) * Math.cos(toRad(lat2));
        const x =
            Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
        let brng = toDeg(Math.atan2(y, x));
        return (brng + 360) % 360;
    };

    const direction = (location && activeTarget)
        ? (calculateBearing(location.latitude, location.longitude, activeTarget.lat, activeTarget.lon) - heading + 360) % 360
        : 0;

    if (!location && !errorMsg) {
        return (
            <View style={[styles.center, darkMode ? styles.darkBackground : styles.lightBackground]}>
                <ActivityIndicator size="large" color="#008484" />
                <Text style={darkMode ? styles.darkText : styles.lightText}>Locatie ophalen...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, darkMode ? styles.darkBackground : styles.lightBackground]}>
            {location && (
                <MapView
                    style={styles.map}
                    region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsUserLocation={true}
                >
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
            )}

            {location && activeTarget && (
                <View style={styles.arrowContainer}>
                    <Animated.View style={{ transform: [{ rotate: `${direction}deg` }] }}>
                        <Image source={require('../assets/arrow.png')} style={styles.arrow} />
                    </Animated.View>
                    <Text style={[styles.arrowText, darkMode ? styles.darkText : styles.lightText]}>
                        Volg de pijl naar het gekozen tappunt
                    </Text>
                    <View style={{ marginTop: 12 }}>
                        <Button title="Navigatie annuleren" onPress={() => setActiveTarget(null)} />
                    </View>
                </View>
            )}

            <StatusBar style={darkMode ? "light" : "dark"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lightBackground: {
        backgroundColor: '#fff',
    },
    darkBackground: {
        backgroundColor: '#121212',
    },
    map: {
        width: '100%',
        height: '80%',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowContainer: {
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    arrow: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    arrowText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    lightText: {
        color: '#000',
    },
    darkText: {
        color: '#ddd',
    },
});
