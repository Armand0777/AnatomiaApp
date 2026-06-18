import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';
import { unidadesService, UnidadConTemas } from '../../services/unidadesService';
import { getUnidadVisual } from '../../constants/unidadesVisual';
import { useRolAcceso } from '../../hooks/useRolAcceso';
import { useAuthStore } from '../../store/useAuthStore';

// Acento morado propio del módulo de Autoevaluación, distinto del verde del resto de la app
const ACCENT = MODULOS.autoevaluacion.color;

export default function AutoevaluacionScreen() {
  const navigation = useNavigation<any>();
  const { puedeEvaluar, puedeGestionar, puedeVerReportes } = useRolAcceso();
  const logout = useAuthStore((state) => state.logout);

  const [unidades, setUnidades] = useState<UnidadConTemas[]>([]);
  const [cargando, setCargando] = useState(true);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<UnidadConTemas | null>(null);
  const [mostrarModalInvitado, setMostrarModalInvitado] = useState(false);

  useEffect(() => {
    const cargarUnidades = async () => {
      const data = await unidadesService.getUnidades();
      setUnidades(data);
      setCargando(false);
    };
    cargarUnidades();
  }, []);

  const iniciarEvaluacion = () => {
    if (!unidadSeleccionada) return;

    if (!puedeEvaluar) {
      setMostrarModalInvitado(true);
      return;
    }

    navigation.navigate('SimulacionExamen', {
      unidadId: unidadSeleccionada.id,
      unidadTitulo: unidadSeleccionada.titulo,
      unidadNumero: unidadSeleccionada.numero,
    });
  };

  const irALogin = async () => {
    setMostrarModalInvitado(false);
    await logout();
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()} style={styles.headerBtn}>
          <Icon name="menu" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name={MODULOS.autoevaluacion.icon as any} size={20} color="#FFF" />
          <Text style={styles.headerTitle}>Autoevaluación</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.subtitle}>Selecciona la unidad que deseas evaluar</Text>

      <FlatList
        data={unidades}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const seleccionada = unidadSeleccionada?.id === item.id;
          const visual = getUnidadVisual(item.numero);
          return (
            <TouchableOpacity
              style={[styles.card, seleccionada && styles.cardSeleccionada]}
              onPress={() => setUnidadSeleccionada(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIconBadge, { backgroundColor: visual.color + '26' }]}>
                <Icon name={visual.icon as any} size={26} color={visual.color} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardUnidad}>Unidad {item.numero}</Text>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
              </View>
              {seleccionada ? (
                <Icon name="check-circle" size={26} color={ACCENT} />
              ) : (
                <Icon name="chevron-right" size={26} color="#BDBDBD" />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Accesos de gestión, solo admin/docente */}
      {(puedeGestionar || puedeVerReportes) && (
        <View style={styles.gestionRow}>
          {puedeGestionar && (
            <TouchableOpacity
              style={styles.gestionBtn}
              onPress={() => navigation.navigate('GestionPreguntas')}
            >
              <Icon name="cog-outline" size={18} color={ACCENT} />
              <Text style={styles.gestionBtnText}>Gestionar preguntas</Text>
            </TouchableOpacity>
          )}
          {puedeVerReportes && (
            <TouchableOpacity
              style={styles.gestionBtn}
              onPress={() => navigation.navigate('Reportes')}
            >
              <Icon name="chart-bar" size={18} color={ACCENT} />
              <Text style={styles.gestionBtnText}>Ver reportes</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Botón principal */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.iniciarBtn, !unidadSeleccionada && styles.iniciarBtnDisabled]}
          disabled={!unidadSeleccionada}
          onPress={iniciarEvaluacion}
        >
          <Icon name="play-circle" size={22} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.iniciarBtnText}>Iniciar evaluación</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para invitados */}
      <Modal visible={mostrarModalInvitado} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Icon name="account-lock-outline" size={48} color={ACCENT} />
            <Text style={styles.modalTitle}>Necesitas una cuenta</Text>
            <Text style={styles.modalText}>
              Para guardar tu progreso y resultados, inicia sesión con una cuenta de estudiante.
            </Text>
            <TouchableOpacity style={styles.modalBtnPrimary} onPress={irALogin}>
              <Text style={styles.modalBtnPrimaryText}>Iniciar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setMostrarModalInvitado(false)}>
              <Text style={styles.modalBtnSecondaryText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: {
    backgroundColor: ACCENT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  headerBtn: { padding: 5 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { color: COLORS.headerText, fontSize: 18, fontWeight: 'bold' },
  subtitle: { textAlign: 'center', fontSize: 15, color: '#555', marginVertical: 18, paddingHorizontal: 20 },
  listContainer: { paddingHorizontal: 20, gap: 12, paddingBottom: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
  },
  cardSeleccionada: {
    borderColor: ACCENT,
    backgroundColor: ACCENT + '14',
  },
  cardIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: { flex: 1 },
  cardUnidad: { fontSize: 13, fontWeight: 'bold', color: ACCENT, marginBottom: 2 },
  cardTitulo: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '600' },
  gestionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  gestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  gestionBtnText: { color: ACCENT, fontSize: 13, fontWeight: '600' },
  footer: { padding: 20 },
  iniciarBtn: {
    backgroundColor: ACCENT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  iniciarBtnDisabled: { backgroundColor: '#A5D6A7' },
  iniciarBtnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },

  // Modal invitado
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 30 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 26, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 14, marginBottom: 8 },
  modalText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  modalBtnPrimary: { backgroundColor: ACCENT, paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 10 },
  modalBtnPrimaryText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  modalBtnSecondary: { paddingVertical: 8, alignItems: 'center', width: '100%' },
  modalBtnSecondaryText: { color: '#888', fontSize: 14 },
});
