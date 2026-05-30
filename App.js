import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StatusBar, View, ActivityIndicator } from 'react-native';

import HomeScreen      from './src/screens/HomeScreen';
import TreinosScreen   from './src/screens/TreinosScreen';
import ProgressoScreen from './src/screens/ProgressoScreen';
import NutricaoScreen  from './src/screens/NutricaoScreen';
import DesafiosScreen  from './src/screens/DesafiosScreen';
import PerfilScreen    from './src/screens/PerfilScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { carregar } from './src/utils/storage';

const Tab = createBottomTabNavigator();

const ICONS = {
  Início:    '🏠',
  Treinos:   '💪',
  Progresso: '📊',
  Nutrição:  '🥗',
  Desafios:  '🏆',
  Perfil:    '👤',
};

export default function App() {
  const [carregando, setCarregando] = useState(true);
  const [perfil, setPerfil]         = useState(null);

  useEffect(() => { verificarPerfil(); }, []);

  async function verificarPerfil() {
    const p = await carregar('perfil_usuario');
    setPerfil(p);
    setCarregando(false);
  }

  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0d0d1a', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  if (!perfil) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#0d0d1a" />
        <OnboardingScreen onConcluir={(p) => setPerfil(p)} />
      </>
    );
  }

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
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Início"    component={HomeScreen} />
        <Tab.Screen name="Treinos"   component={TreinosScreen} />
        <Tab.Screen name="Progresso" component={ProgressoScreen} />
        <Tab.Screen name="Nutrição"  component={NutricaoScreen} />
        <Tab.Screen name="Desafios"  component={DesafiosScreen} />
        <Tab.Screen name="Perfil"    component={PerfilScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
