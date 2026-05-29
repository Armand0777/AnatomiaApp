import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminTemasScreen from '../screens/admin/AdminTemasScreen';
import AdminContenidoScreen from '../screens/admin/AdminContenidoScreen';
import AdminPreguntasScreen from '../screens/admin/AdminPreguntasScreen';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerStyle: { backgroundColor: COLORS.headerBg },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShown: false // Usamos nuestros headers personalizados en las pantallas de admin
      }}
    >
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen} 
      />
      <Stack.Screen 
        name="AdminTemas" 
        component={AdminTemasScreen} 
      />
      <Stack.Screen 
        name="AdminContenido" 
        component={AdminContenidoScreen} 
      />
      <Stack.Screen 
        name="AdminPreguntas" 
        component={AdminPreguntasScreen} 
      />
    </Stack.Navigator>
  );
}
