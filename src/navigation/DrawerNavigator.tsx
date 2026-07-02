import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, BackHandler, Platform } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';
import { MODULOS } from '../constants/modulos';
import { useAuthStore } from '../store/useAuthStore';

// Pantallas principales
import TabNavigator from './TabNavigator';
import UnidadesScreen from '../screens/unidades/UnidadesScreen';
import PerfilScreen from '../screens/home/PerfilScreen';
import AutoevaluacionScreen from '../screens/evaluacion/AutoevaluacionScreen';
import BibliotecaScreen from '../screens/biblioteca/BibliotecaScreen';
import AcercaDeScreen from '../screens/acercaDe/AcercaDeScreen';
import GestionScreen from '../screens/gestion/GestionScreen';
import { useRolAcceso } from '../hooks/useRolAcceso';

import AdminNavigator from './AdminNavigator';

const Drawer = createDrawerNavigator();

// Insignia circular con el color propio de cada módulo, para diferenciarlos
// visualmente en el menú lateral en lugar de un ícono plano genérico.
function DrawerIconBadge({ modulo, focused }: { modulo: keyof typeof MODULOS; focused: boolean }) {
  const { icon, color } = MODULOS[modulo];
  return (
    <View style={[styles.iconBadge, { backgroundColor: focused ? color : color + '1A' }]}>
      <Icon name={icon as any} size={18} color={focused ? '#FFF' : color} />
    </View>
  );
}

const CustomDrawerContent = (props: any) => {
  const usuario = useAuthStore(state => state.usuario);
  const esDocente = useAuthStore(state => state.esDocente)();

  const getIniciales = () => {
    if (!usuario?.nombre) return 'U';
    const partes = usuario.nombre.split(' ');
    return partes.length >= 2 ? `${partes[0][0]}${partes[1][0]}`.toUpperCase() : usuario.nombre.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Image source={require('../../assets/logocentral.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Anatomía</Text>
        <Text style={styles.subtitle}>Cabeza y Cuello</Text>
      </View>
      
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {Platform.OS === 'android' && (
        <TouchableOpacity style={styles.salirBtn} onPress={() => BackHandler.exitApp()}>
          <Icon name="exit-to-app" size={20} color="#E53935" />
          <Text style={styles.salirTexto}>Salir de la aplicación</Text>
        </TouchableOpacity>
      )}

      <View style={styles.drawerFooter}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getIniciales()}</Text>
        </View>
        <View>
          <Text style={styles.footerName}>{usuario?.nombre || 'Usuario'}</Text>
          <Text style={styles.footerEmail}>{usuario?.email || 'usuario@email.com'}</Text>
          {esDocente && <Text style={{fontSize:10, color: COLORS.primary, fontWeight:'bold'}}>DOCENTE</Text>}
        </View>
      </View>
    </View>
  );
};

export default function DrawerNavigator() {
  const esDocente = useAuthStore(state => state.esDocente)();
  const { puedeGestionar } = useRolAcceso();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.primary + '1A',
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: { fontSize: 15, marginLeft: -6, fontWeight: '600' },
        drawerItemStyle: { borderRadius: 12, marginHorizontal: 8 },
      }}
    >
      <Drawer.Screen
        name="InicioTabs"
        component={TabNavigator}
        options={{ drawerLabel: 'Inicio', drawerIcon: ({ focused }) => <DrawerIconBadge modulo="inicio" focused={focused} /> }}
      />
      <Drawer.Screen
        name="UnidadesStack"
        component={UnidadesScreen}
        options={{ drawerLabel: 'Unidades', drawerIcon: ({ focused }) => <DrawerIconBadge modulo="unidades" focused={focused} /> }}
      />
      <Drawer.Screen
        name="Biblioteca"
        component={BibliotecaScreen}
        options={{ drawerLabel: 'Biblioteca multimedia', drawerIcon: ({ focused }) => <DrawerIconBadge modulo="biblioteca" focused={focused} /> }}
      />
      <Drawer.Screen
        name="Autoevaluacion"
        component={AutoevaluacionScreen}
        options={{ drawerLabel: 'Autoevaluación', drawerIcon: ({ focused }) => <DrawerIconBadge modulo="autoevaluacion" focused={focused} /> }}
      />
      {esDocente && (
        <Drawer.Screen
          name="PanelDocente"
          component={AdminNavigator}
          options={{ drawerLabel: 'Panel Docente', drawerIcon: ({ focused }) => <DrawerIconBadge modulo="panelDocente" focused={focused} /> }}
        />
      )}
      {puedeGestionar && (
        <Drawer.Screen
          name="Gestion"
          component={GestionScreen}
          options={{ drawerLabel: 'Gestión', drawerIcon: ({ focused }) => <DrawerIconBadge modulo="gestion" focused={focused} /> }}
        />
      )}
      <Drawer.Screen
        name="AcercaDe"
        component={AcercaDeScreen}
        options={{ drawerLabel: 'Acerca de', drawerIcon: ({ focused }) => <DrawerIconBadge modulo="acercaDe" focused={focused} /> }}
      />
      <Drawer.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ drawerLabel: 'Perfil', drawerIcon: ({ focused }) => <DrawerIconBadge modulo="perfil" focused={focused} /> }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  scrollContent: {
    paddingTop: 10,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  footerEmail: {
    fontSize: 12,
    color: '#777',
  },
  salirBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFF5F5',
  },
  salirTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53935',
  },
});
