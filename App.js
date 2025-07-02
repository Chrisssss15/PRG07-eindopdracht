import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import ListScreen from './screens/list';
import ListDetailScreen from './screens/listDetail';
import MapScreen from './screens/map';
import SettingScreen from './screens/setting';
import { DataProvider } from './components/data';

import { ThemeProvider } from './components/themeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ListStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="List" component={ListScreen} options={{ title: 'ListScreen' }} />
            <Stack.Screen name="ListDetail" component={ListDetailScreen} options={{ title: 'ListDetailScreen' }} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <DataProvider>
                <NavigationContainer>
                    <Tab.Navigator initialRouteName="Map">
                        <Tab.Screen name="List" component={ListStack} options={{ headerShown: false }} />
                        <Tab.Screen name="Map" component={MapScreen} />
                        <Tab.Screen name="Settings" component={SettingScreen} />
                    </Tab.Navigator>
                </NavigationContainer>
            </DataProvider>
        </ThemeProvider>
    );
}