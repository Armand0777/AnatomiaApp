import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';

// Pantallas del stack de Unidades
import TemasScreen from '../screens/unidades/TemasScreen';
import ContenidoTemaScreen from '../screens/unidades/ContenidoTemaScreen';
import ImagenAmpliadaScreen from '../screens/unidades/ImagenAmpliadaScreen';
import VideoScreen from '../screens/unidades/VideoScreen';
import ResumenScreen from '../screens/unidades/ResumenScreen';
import QuizScreen from '../screens/evaluaciones/QuizScreen';
import QuizResultScreen from '../screens/evaluaciones/QuizResultScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* El Drawer es la navegación principal de la app */}
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
      
      {/* Subpantallas del flujo de unidades que no muestran el Drawer lateral */}
      <Stack.Screen name="Temas" component={TemasScreen} />
      <Stack.Screen name="ContenidoTema" component={ContenidoTemaScreen} />
      <Stack.Screen name="ImagenAmpliada" component={ImagenAmpliadaScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Video" component={VideoScreen} />
      <Stack.Screen name="Resumen" component={ResumenScreen} />
      
      {/* Quiz Screens */}
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} />
    </Stack.Navigator>
  );
}
