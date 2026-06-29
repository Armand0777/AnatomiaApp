import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { useRolAcceso } from '../../hooks/useRolAcceso';

interface TarjetaGestion {
  icon: string;
  titulo: string;
  descripcion: string;
  ruta: string;
}

const TARJETAS: TarjetaGestion[] = [
  {
    icon: 'puzzle-outline',
    titulo: 'Gestionar Esquemas',
    descripcion: 'Crea y edita las láminas anatómicas y sus etiquetas.',
    ruta: 'GestionEsquemas',
  },
];

// Panel central de administración de contenido (solo admin/docente).
// Esta pantalla y su ítem de Drawer ya están ocultos para otros roles,
// pero se valida también aquí como defensa extra.
export default function GestionScreen() {
  const navigation = useNavigation<any>();
  const { puedeGestionar } = useRolAcceso();

  if (!puedeGestionar) {
    return (
      <View style={styles.restringidoContainer}>
        <Icon name="lock-outline" size={48} color="#CCC" />
        <Text style={styles.restringidoTexto}>No tienes permiso para acceder a esta sección.</Text>
        <TouchableOpacity style={styles.volverBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.volverBtnTexto}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()} style={styles.headerBtn}>
          <Icon name="menu" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.intro}>Administra el contenido de la aplicación.</Text>

        {TARJETAS.map((tarjeta) => (
          <TouchableOpacity
            key={tarjeta.ruta}
            style={styles.tarjeta}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(tarjeta.ruta)}
          >
            <View style={styles.tarjetaIconWrap}>
              <Icon name={tarjeta.icon as any} size={26} color="#FFF" />
            </View>
            <View style={styles.tarjetaInfo}>
              <Text style={styles.tarjetaTitulo}>{tarjeta.titulo}</Text>
              <Text style={styles.tarjetaDescripcion}>{tarjeta.descripcion}</Text>
            </View>
            <Icon name="chevron-right" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  headerBtn: { padding: 4 },
  headerTitle: { color: COLORS.headerText, fontSize: 16, fontWeight: 'bold' },

  content: { padding: 20 },
  intro: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 20 },

  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  tarjetaIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tarjetaInfo: { flex: 1 },
  tarjetaTitulo: { fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
  tarjetaDescripcion: { fontSize: 12.5, color: '#666', lineHeight: 17 },

  restringidoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  restringidoTexto: { color: '#888', fontSize: 15, textAlign: 'center', marginTop: 12, marginBottom: 20 },
  volverBtn: { backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12 },
  volverBtnTexto: { color: '#FFF', fontWeight: 'bold' },
});
