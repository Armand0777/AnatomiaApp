import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';

// Pantallas del Tab
import HomeScreen from '../screens/home/HomeScreen';
import BuscarScreen from '../screens/home/BuscarScreen';
import FavoritosScreen from '../screens/home/FavoritosScreen';
import PerfilScreen from '../screens/home/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -2,
          marginBottom: 2,
        },
        tabBarStyle: styles.floatingTabBar,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name={focused ? "home" : "home-outline"} 
              size={size + 2} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Buscar"
        component={BuscarScreen}
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name={focused ? "magnify" : "magnify"} 
              size={size + 2} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritosScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name={focused ? "heart" : "heart-outline"} 
              size={size + 2} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name={focused ? "account" : "account-outline"} 
              size={size + 2} 
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 30, // Burbuja sin puntas
    height: 68,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderTopWidth: 0, // Remueve la línea divisoria por defecto
  },
});
