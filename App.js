import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StatusBar } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import TreinosScreen from './src/screens/TreinosScreen';
import ProgressoScreen from './src/screens/ProgressoScreen';
import NutricaoScreen from './src/screens/NutricaoScreen';
import DesafiosScreen from './src/screens/DesafiosScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Início: '🏠',
  Treinos: '💪',
  Progresso: '📊',
  Nutrição: '🥗',
  Desafios: '🏆',
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d1a" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 18 }}>{ICONS[route.name]}</Text>
          ),
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
            borderTopColor: '#2a2a3e',
            height: 65,
            paddingBottom: 8,
            paddingTop: 4,
          },
          tabBarActiveTintColor: '#e94560',
          tabBarInactiveTintColor: '#555',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Início" component={HomeScreen} />
        <Tab.Screen name="Treinos" component={TreinosScreen} />
        <Tab.Screen name="Progresso" component={ProgressoScreen} />
        <Tab.Screen name="Nutrição" component={NutricaoScreen} />
        <Tab.Screen name="Desafios" component={DesafiosScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
