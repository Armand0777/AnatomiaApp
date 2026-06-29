import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';
import { SECCIONES_ACERCA } from '../../data/acercaData';

const ACCENT = MODULOS.acercaDe.color;

// Menú de "Acerca de": cada fila abre su propia sub-pantalla (AcercaDetalleScreen)
export default function AcercaDeScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()} style={styles.headerBtn}>
          <Icon name="menu" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name={MODULOS.acercaDe.icon as any} size={18} color="#FFF" />
          <Text style={styles.headerTitle}>Acerca de</Text>
        </View>
        <View style={{ width: 26 }} />
      </View>

      {/* Identidad de la app */}
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Image source={require('../../../assets/logocentral.png')} style={styles.heroLogo} resizeMode="contain" />
        </View>
        <Text style={styles.heroTitulo}>ANATOMÍA CABEZA Y CUELLO</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>V1</Text>
        </View>
      </View>

      {/* Subtítulo */}
      <View style={styles.subtituloCard}>
        <Text style={styles.subtituloTexto}>
          Aplicación educativa móvil de apoyo al aprendizaje de la asignatura Anatomía Humana I de la carrera de
          Odontología.
        </Text>
      </View>

      {/* Lista de secciones */}
      <View style={styles.content}>
        {SECCIONES_ACERCA.map((seccion) => (
          <TouchableOpacity
            key={seccion.key}
            style={styles.fila}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AcercaDetalle', { seccionKey: seccion.key })}
          >
            <View style={styles.filaIconWrap}>
              <Text style={styles.filaIcono}>{seccion.icono}</Text>
            </View>
            <Text style={styles.filaTitulo}>{seccion.titulo}</Text>
            <Icon name="chevron-right" size={22} color={ACCENT} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.pie}>© 2026 Anatomía Cabeza y Cuello V1</Text>
    </ScrollView>
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
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  heroCard: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20 },
  heroIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  heroLogo: { width: 64, height: 64 },
  heroTitulo: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, textAlign: 'center', letterSpacing: 0.5 },
  versionBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 10,
  },
  versionText: { fontSize: 13, color: '#FFF', fontWeight: 'bold' },

  subtituloCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    marginHorizontal: 20,
    padding: 16,
    marginBottom: 24,
  },
  subtituloTexto: { fontSize: 13.5, color: COLORS.textPrimary, lineHeight: 19, textAlign: 'center' },

  content: { paddingHorizontal: 20 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filaIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  filaIcono: { fontSize: 20 },
  filaTitulo: { flex: 1, fontSize: 14.5, fontWeight: '600', color: COLORS.textPrimary },

  pie: { textAlign: 'center', fontSize: 12, color: '#AAA', marginTop: 10, marginBottom: 10 },
});
