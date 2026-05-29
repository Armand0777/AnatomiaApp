import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/useAuthStore';
import { COLORS } from './src/constants/colors';
import { ejecutarSeed } from './src/services/seedService';
import { poblarContenidoFaltante } from './src/services/forceSeed';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const { sesion, cargando, cargarSesion } = useAuthStore();

  useEffect(() => {
    // Al iniciar la aplicación, verificar si hay sesión activa
    cargarSesion();
    ejecutarSeed();
    poblarContenidoFaltante();
  }, []);

  if (cargando && !sesion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          {/* Renderizado condicional: si hay sesión va al AppNavigator, si no al AuthNavigator */}
          {sesion ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
