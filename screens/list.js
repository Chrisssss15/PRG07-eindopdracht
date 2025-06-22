// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
//
// export default function List() {
//     return (
//         <View style={styles.container}>
//             <Text>Open up App.js to start working on your poep!</Text>
//             <Text>This is the list page</Text>
//             <StatusBar style="auto" />
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });
import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { waterStationsData } from '../components/data';

export default function List() {
    const stations = useContext(waterStationsData);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tappunten ({stations.length})</Text>
            <FlatList
                data={stations}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.name}>{item.name || 'Naam onbekend'}</Text>
                        <Text style={styles.sub}>{item.city || 'Plaats onbekend'} - {item.street || 'Straat onbekend'}</Text>
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
});
