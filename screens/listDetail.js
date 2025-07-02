import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';

import { ThemeContext } from '../components/themeContext';  // correcte import

export default function ListDetail({ route }) {
    const { name, latitude, longitude } = route.params;
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const [imageUri, setImageUri] = useState(null);
    const [adres, setAdres] = useState(null);
    const key = `image:${name}`;
    const navigation = useNavigation();
    const { darkMode } = useContext(ThemeContext);  // dark mode context

    // Ophalen afbeelding én adres
    useEffect(() => {
        (async () => {
            const savedUri = await AsyncStorage.getItem(key);
            if (savedUri) {
                setImageUri(savedUri);
            }

            //Coördinaten omzetten naar adres
            try {
                const geo = await Location.reverseGeocodeAsync({
                    latitude: lat,
                    longitude: lon,
                });

                if (geo.length > 0) {
                    const g = geo[0];
                    // const formatted = `${g.street || ''} ${g.name || ''}, ${g.postalCode || ''} ${g.city || ''}`;
                    const formatted = `${g.name || ''}, ${g.postalCode || ''} ${g.city || ''}`;
                    setAdres(formatted);
                } else {
                    setAdres('Adres niet gevonden');
                }
            } catch (error) {
                console.warn('Fout bij ophalen adres:', error);
                setAdres('Adres ophalen mislukt');
            }
        })();
    }, []);

    // Foto Uploaden
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            await AsyncStorage.setItem(key, uri);
        }
    };

    // Foto verwijderen
    const removeImage = async () => {
        const isAvailable = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!isAvailable || !isEnrolled) {
            Alert.alert('Beveiliging niet beschikbaar', 'Authenticatie via Face ID, Touch ID of toegangscode is vereist.');
            return;
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Verifieer om afbeelding te verwijderen',
            fallbackLabel: 'Gebruik toegangscode',
            cancelLabel: 'Annuleer',
        });

        if (auth.success) {
            Alert.alert(
                'Weet je het zeker?',
                'Deze afbeelding wordt verwijderd.',
                [
                    { text: 'Annuleren', style: 'cancel' },
                    {
                        text: 'Verwijder',
                        style: 'destructive',
                        onPress: async () => {
                            await AsyncStorage.removeItem(key);
                            setImageUri(null);
                        },
                    },
                ]
            );
        } else {
            Alert.alert('Verificatie mislukt', 'Afbeelding is niet verwijderd.');
        }
    };

    return (
        <View style={[styles.container, darkMode ? styles.darkBackground : styles.lightBackground]}>
            <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>{name || 'Tappunt'}</Text>
            {adres && <Text style={[styles.adres, darkMode ? styles.darkSubText : styles.lightSubText]}>{adres}</Text>}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{ latitude: lat, longitude: lon }}
                    title={name || 'Tappunt'}
                    description="Hier bevindt zich dit tappunt"
                />
            </MapView>

            <Button
                title="Route via kaart"
                onPress={() =>
                    navigation.navigate('Map', {
                        targetLatitude: lat,
                        targetLongitude: lon,
                    })
                }
            />

            <View style={styles.buttonRow}>
                <Button title="Afbeelding kiezen" onPress={pickImage} />
                {imageUri && (
                    <Button
                        title="Verwijder afbeelding"
                        onPress={removeImage}
                        color="red"
                    />
                )}
            </View>

            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.image} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    lightBackground: {
        backgroundColor: '#fff',
    },
    darkBackground: {
        backgroundColor: 'black',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    lightText: {
        color: '#2B3D25',
    },
    darkText: {
        color: '#ddd',
    },
    adres: {
        fontStyle: 'italic',
        marginBottom: 12,
    },
    lightSubText: {
        color: '#666',
    },
    darkSubText: {
        color: '#aaa',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        gap: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginVertical: 20,
        resizeMode: 'cover',
    },
    map: {
        width: Dimensions.get('window').width - 40,
        height: 250,
        borderRadius: 12,
    },
});
