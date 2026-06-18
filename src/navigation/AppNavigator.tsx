import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';

// Pantallas del stack de Unidades
import TemasScreen from '../screens/unidades/TemasScreen';
import ContenidoTemaScreen from '../screens/unidades/ContenidoTemaScreen';
import ImagenAmpliadaScreen from '../screens/unidades/ImagenAmpliadaScreen';
import VideoScreen from '../screens/unidades/VideoScreen';
import ResumenScreen from '../screens/unidades/ResumenScreen';

// Pantallas del módulo de Autoevaluación (independiente, solo alcanzable desde el Home)
import SimulacionExamenScreen from '../screens/evaluacion/SimulacionExamenScreen';
import ResultadosScreen from '../screens/evaluacion/ResultadosScreen';
import RevisionRespuestasScreen from '../screens/evaluacion/RevisionRespuestasScreen';
import GestionPreguntasScreen from '../screens/evaluacion/GestionPreguntasScreen';
import ReportesScreen from '../screens/evaluacion/ReportesScreen';

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

      {/* Módulo de Autoevaluación */}
      <Stack.Screen name="SimulacionExamen" component={SimulacionExamenScreen} />
      <Stack.Screen name="Resultados" component={ResultadosScreen} />
      <Stack.Screen name="RevisionRespuestas" component={RevisionRespuestasScreen} />
      <Stack.Screen name="GestionPreguntas" component={GestionPreguntasScreen} />
      <Stack.Screen name="Reportes" component={ReportesScreen} />
    </Stack.Navigator>
  );
}
