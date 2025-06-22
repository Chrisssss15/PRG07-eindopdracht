import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import ListScreen from './screens/list';
import StationDetailScreen from './screens/stationDetail';
import MapScreen from './screens/map';
import SettingScreen from './screens/setting';
import { DataProvider } from './components/data';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ListStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="List" component={ListScreen} options={{ title: 'List' }} />
            <Stack.Screen name="Station" component={StationDetailScreen} options={{ title: 'Details' }} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <DataProvider>
            <NavigationContainer>
                <Tab.Navigator initialRouteName="List">
                    <Tab.Screen name="List" component={ListStack} options={{ headerShown: false }} />
                    <Tab.Screen name="Map" component={MapScreen} />
                    <Tab.Screen name="Settings" component={SettingScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        </DataProvider>
    );
}
