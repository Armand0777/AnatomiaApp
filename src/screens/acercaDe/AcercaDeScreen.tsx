import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';
import { getUnidadVisual } from '../../constants/unidadesVisual';
import packageJson from '../../../package.json';

const ACCENT = MODULOS.acercaDe.color;

const UNIDADES_RESUMEN = [
  { numero: 1, titulo: 'Osteología y configuración cefálica' },
  { numero: 2, titulo: 'Miología y sistema neurovascular' },
  { numero: 3, titulo: 'Órganos de los sentidos y cavidades' },
  { numero: 4, titulo: 'Vías digestivas y respiratorias superiores' },
];

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
        <Text style={styles.heroTitulo}>Anatomía de Cabeza y Cuello</Text>
        <Text style={styles.heroSubtitulo}>Aplicación educativa · Anatomía Humana I</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v{packageJson.version}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Objetivo educativo */}
        <Text style={styles.seccionTitulo}>Objetivo educativo</Text>
        <View style={styles.card}>
          <Text style={styles.parrafo}>
            Esta app de <Text style={styles.negrita}>Mobile Learning</Text> está dirigida a estudiantes de
            Odontología que cursan Anatomía Humana I. Organiza el contenido anatómico de cabeza y cuello por
            unidades, ofrece una biblioteca multimedia con imágenes y videos, autoevaluaciones para medir el
            avance, y funciona también sin conexión a internet.
          </Text>
        </View>

        {/* Contenido académico */}
        <Text style={styles.seccionTitulo}>Contenido académico</Text>
        <View style={styles.card}>
          {UNIDADES_RESUMEN.map((u, idx) => {
            const visual = getUnidadVisual(u.numero);
            return (
              <View key={u.numero} style={[styles.unidadRow, idx === UNIDADES_RESUMEN.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={[styles.unidadIconWrap, { backgroundColor: visual.color + '26' }]}>
                  <Icon name={visual.icon as any} size={18} color={visual.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.unidadNumero}>Unidad {u.numero}</Text>
                  <Text style={styles.unidadTitulo}>{u.titulo}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Créditos */}
        <Text style={styles.seccionTitulo}>Créditos</Text>
        <View style={styles.card}>
          <View style={styles.creditoRow}>
            <Icon name="account-edit-outline" size={20} color={ACCENT} />
            <View style={styles.creditoInfo}>
              <Text style={styles.creditoLabel}>Estudiante investigador / Desarrollador</Text>
              <Text style={styles.creditoValor}>Armando Guerrero</Text>
            </View>
          </View>
          <View style={styles.creditoRow}>
            <Icon name="account-tie-outline" size={20} color={ACCENT} />
            <View style={styles.creditoInfo}>
              <Text style={styles.creditoLabel}>Docente asesor</Text>
              <Text style={styles.creditoValor}>Selene</Text>
            </View>
          </View>
          <View style={[styles.creditoRow, { borderBottomWidth: 0 }]}>
            <Icon name="calendar-outline" size={20} color={ACCENT} />
            <View style={styles.creditoInfo}>
              <Text style={styles.creditoLabel}>Curso · Año</Text>
              <Text style={styles.creditoValor}>Anatomía Humana I · 2026</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerTexto}>Hecho con 💚 para estudiantes de Odontología</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: ACCENT,
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
  heroTitulo: { fontSize: 19, fontWeight: 'bold', color: COLORS.textPrimary, textAlign: 'center' },
  heroSubtitulo: { fontSize: 13, color: '#777', marginTop: 4, textAlign: 'center' },
  versionBadge: { backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginTop: 10 },
  versionText: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },

  content: { paddingHorizontal: 20 },
  seccionTitulo: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 10, marginTop: 4 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  parrafo: { fontSize: 14, color: '#444', lineHeight: 21, padding: 16 },
  negrita: { fontWeight: 'bold', color: COLORS.textPrimary },

  unidadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  unidadIconWrap: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  unidadNumero: { fontSize: 11, fontWeight: 'bold', color: '#999' },
  unidadTitulo: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600', marginTop: 2 },

  creditoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  creditoInfo: { flex: 1 },
  creditoLabel: { fontSize: 11, color: '#999', marginBottom: 2 },
  creditoValor: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' },

  footerTexto: { textAlign: 'center', fontSize: 12, color: '#AAA', marginTop: 4, marginBottom: 10 },
});
