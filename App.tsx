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
import { initLocalDb } from './src/services/db/localDb';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const { sesion, cargando, cargarSesion } = useAuthStore();

  useEffect(() => {
    const iniciarApp = async () => {
      try {
        // Prepara la base local (modo offline) sin bloquear el resto del arranque
        initLocalDb().catch((err) => console.error('Error al iniciar la base local:', err));

        // Al iniciar la aplicación, verificar si hay sesión activa
        await cargarSesion();

        // El seeding solo debe ejecutarse en desarrollo local para desarrolladores
        // para evitar sobrecargar la base de datos y acelerar el inicio en producción
        if (__DEV__) {
          console.log('🚧 Modo desarrollo: Verificando datos de base de datos...');
          ejecutarSeed().catch(err => console.error('Error en ejecutarSeed:', err));
          poblarContenidoFaltante().catch(err => console.error('Error en poblarContenidoFaltante:', err));
        }
      } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
      }
    };

    iniciarApp();
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
