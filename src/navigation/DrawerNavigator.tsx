import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';
import { useAuthStore } from '../store/useAuthStore';

// Pantallas principales
import TabNavigator from './TabNavigator';
import UnidadesScreen from '../screens/unidades/UnidadesScreen';
import PerfilScreen from '../screens/home/PerfilScreen';

// Pantallas faltantes (placeholders básicos)
const BibliotecaScreen = () => <View style={styles.center}><Text>Biblioteca Multimedia</Text></View>;
const AutoevaluacionScreen = () => <View style={styles.center}><Text>Autoevaluación</Text></View>;
const AcercaDeScreen = () => <View style={styles.center}><Text>Acerca de</Text></View>;

import AdminNavigator from './AdminNavigator';

const Drawer = createDrawerNavigator();

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
        <Text style={styles.logo}>💀</Text>
        <Text style={styles.title}>Anatomía</Text>
        <Text style={styles.subtitle}>Cabeza y Cuello</Text>
      </View>
      
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

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

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.primary + '1A',
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: { fontSize: 16, marginLeft: -10 },
      }}
    >
      <Drawer.Screen 
        name="InicioTabs" 
        component={TabNavigator} 
        options={{ drawerLabel: 'Inicio', drawerIcon: ({ color }) => <Icon name="home" size={24} color={color} /> }} 
      />
      <Drawer.Screen 
        name="UnidadesStack" 
        component={UnidadesScreen} 
        options={{ drawerLabel: 'Unidades', drawerIcon: ({ color }) => <Icon name="book-open-variant" size={24} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Biblioteca" 
        component={BibliotecaScreen} 
        options={{ drawerIcon: ({ color }) => <Icon name="play-circle" size={24} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Autoevaluacion" 
        component={AutoevaluacionScreen} 
        options={{ drawerIcon: ({ color }) => <Icon name="clipboard-check" size={24} color={color} /> }} 
      />
      {esDocente && (
        <Drawer.Screen 
          name="PanelDocente" 
          component={AdminNavigator} 
          options={{ drawerLabel: 'Panel Docente', drawerIcon: ({ color }) => <Icon name="shield-account" size={24} color={color} /> }} 
        />
      )}
      <Drawer.Screen 
        name="AcercaDe" 
        component={AcercaDeScreen} 
        options={{ drawerLabel: 'Acerca de', drawerIcon: ({ color }) => <Icon name="information" size={24} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ drawerIcon: ({ color }) => <Icon name="account" size={24} color={color} /> }} 
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    fontSize: 50,
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
  }
});
