import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { COLORS } from '../../constants/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { useRolAcceso } from '../../hooks/useRolAcceso';
import { evaluacionService, SesionConRelaciones } from '../../services/evaluacionService';
import { getUnidadVisual } from '../../constants/unidadesVisual';

const NIVELES = [
  { min: 0, nombre: 'Estudiante Novato', icon: 'seed-outline' },
  { min: 3, nombre: 'Aprendiz', icon: 'leaf' },
  { min: 6, nombre: 'Conocedor', icon: 'school' },
  { min: 10, nombre: 'Experto en Anatomía', icon: 'medal' },
];

function calcularNivel(totalEvaluaciones: number) {
  let actual = NIVELES[0];
  let siguiente: typeof NIVELES[number] | null = null;
  for (let i = 0; i < NIVELES.length; i++) {
    if (totalEvaluaciones >= NIVELES[i].min) {
      actual = NIVELES[i];
      siguiente = NIVELES[i + 1] || null;
    }
  }
  const progreso = siguiente
    ? (totalEvaluaciones - actual.min) / (siguiente.min - actual.min)
    : 1;
  return { actual, siguiente, progreso: Math.min(Math.max(progreso, 0), 1) };
}

function colorPorcentaje(p: number) {
  return p >= 80 ? COLORS.correcto : p >= 60 ? COLORS.advertencia : COLORS.incorrecto;
}

export default function PerfilScreen() {
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const { esInvitado, esAdmin, esDocente, esEstudiante } = useRolAcceso();

  const rolLabel = esAdmin ? 'Administrador' : esDocente ? 'Docente' : esInvitado ? 'Invitado' : 'Estudiante';

  const [sesiones, setSesiones] = useState<SesionConRelaciones[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!usuario || esInvitado) {
        setCargando(false);
        return;
      }
      const data = await evaluacionService.getMisSesiones(usuario.id);
      setSesiones(data);
      setCargando(false);
    };
    cargar();
  }, [usuario?.id, esInvitado]);

  const getIniciales = () => {
    if (!usuario?.nombre) return 'U';
    const partes = usuario.nombre.split(' ');
    return partes.length >= 2 ? `${partes[0][0]}${partes[1][0]}`.toUpperCase() : usuario.nombre.substring(0, 2).toUpperCase();
  };

  const { totalEvaluaciones, promedio, mejorPorcentaje, porUnidad, recientes } = useMemo(() => {
    const totalEvaluaciones = sesiones.length;
    const porcentajes = sesiones.map((s) => s.porcentaje ?? (s.puntaje / s.total) * 100);
    const promedio = totalEvaluaciones > 0 ? porcentajes.reduce((a, b) => a + b, 0) / totalEvaluaciones : 0;
    const mejorPorcentaje = totalEvaluaciones > 0 ? Math.max(...porcentajes) : 0;

    const porUnidad = new Map<number, { titulo: string; mejor: number }>();
    sesiones.forEach((s) => {
      const numero = s.unidades?.numero;
      if (!numero) return;
      const p = s.porcentaje ?? (s.puntaje / s.total) * 100;
      const existente = porUnidad.get(numero);
      if (!existente || p > existente.mejor) {
        porUnidad.set(numero, { titulo: s.unidades?.titulo || `Unidad ${numero}`, mejor: p });
      }
    });

    const recientes = [...sesiones]
      .sort((a, b) => parseISO(b.fecha).getTime() - parseISO(a.fecha).getTime())
      .slice(0, 5);

    return { totalEvaluaciones, promedio, mejorPorcentaje, porUnidad, recientes };
  }, [sesiones]);

  const { actual: nivelActual, siguiente: nivelSiguiente, progreso: progresoNivel } = calcularNivel(totalEvaluaciones);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{getIniciales()}</Text>
        </View>
        <Text style={styles.nombre}>{usuario?.nombre}</Text>
        <View style={styles.emailRow}>
          <Icon name="email-outline" size={14} color="rgba(255,255,255,0.85)" />
          <Text style={styles.email}>{usuario?.email}</Text>
        </View>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{rolLabel}</Text>
        </View>
      </View>

      {esInvitado ? (
        <View style={styles.invitadoCard}>
          <Icon name="account-lock-outline" size={40} color={COLORS.primary} />
          <Text style={styles.invitadoTitulo}>Modo invitado</Text>
          <Text style={styles.invitadoTexto}>
            Inicia sesión con una cuenta de estudiante para guardar tu progreso, ver tu nivel y el historial de tus evaluaciones.
          </Text>
          <TouchableOpacity style={styles.invitadoBtn} onPress={logout}>
            <Text style={styles.invitadoBtnText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      ) : cargando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Nivel: solo aplica a estudiantes, no tiene sentido para docente/admin */}
          {esEstudiante && (
            <View style={styles.nivelCard}>
              <View style={styles.nivelIconWrap}>
                <Icon name={nivelActual.icon as any} size={28} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nivelLabel}>Tu nivel</Text>
                <Text style={styles.nivelNombre}>{nivelActual.nombre}</Text>
                <View style={styles.nivelBarBg}>
                  <View style={[styles.nivelBarFill, { width: `${progresoNivel * 100}%` }]} />
                </View>
                <Text style={styles.nivelSiguiente}>
                  {nivelSiguiente
                    ? `${totalEvaluaciones}/${nivelSiguiente.min} evaluaciones para "${nivelSiguiente.nombre}"`
                    : '¡Nivel máximo alcanzado!'}
                </Text>
              </View>
            </View>
          )}

          {/* Estadísticas */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Icon name="clipboard-pulse-outline" size={22} color="#673AB7" />
              <Text style={styles.statValor}>{totalEvaluaciones}</Text>
              <Text style={styles.statLabel}>Evaluaciones</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="chart-line" size={22} color={colorPorcentaje(promedio)} />
              <Text style={[styles.statValor, { color: colorPorcentaje(promedio) }]}>{promedio.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Promedio</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="trophy-outline" size={22} color={colorPorcentaje(mejorPorcentaje)} />
              <Text style={[styles.statValor, { color: colorPorcentaje(mejorPorcentaje) }]}>{mejorPorcentaje.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Mejor puntaje</Text>
            </View>
          </View>

          {/* Progreso por unidad */}
          <Text style={styles.seccionTitulo}>Progreso por unidad</Text>
          <View style={styles.unidadesCard}>
            {[1, 2, 3, 4].map((numero) => {
              const visual = getUnidadVisual(numero);
              const datos = porUnidad.get(numero);
              return (
                <View key={numero} style={styles.unidadRow}>
                  <View style={[styles.unidadIconWrap, { backgroundColor: visual.color + '26' }]}>
                    <Icon name={visual.icon as any} size={18} color={visual.color} />
                  </View>
                  <Text style={styles.unidadNombre}>Unidad {numero}</Text>
                  {datos ? (
                    <Text style={[styles.unidadPorcentaje, { color: colorPorcentaje(datos.mejor) }]}>
                      {datos.mejor.toFixed(0)}%
                    </Text>
                  ) : (
                    <Text style={styles.unidadSinDatos}>Sin evaluar</Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Historial reciente */}
          <Text style={styles.seccionTitulo}>Historial reciente</Text>
          {recientes.length === 0 ? (
            <View style={styles.vacioCard}>
              <Icon name="text-box-search-outline" size={36} color="#CCC" />
              <Text style={styles.vacioTexto}>Aún no has realizado ninguna evaluación.</Text>
            </View>
          ) : (
            <View style={styles.unidadesCard}>
              {recientes.map((s) => {
                const p = s.porcentaje ?? (s.puntaje / s.total) * 100;
                return (
                  <View key={s.id} style={styles.historialRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historialUnidad}>
                        Unidad {s.unidades?.numero} — {s.unidades?.titulo}
                      </Text>
                      <Text style={styles.historialFecha}>
                        {format(parseISO(s.fecha), "dd MMM yyyy, HH:mm", { locale: es })}
                      </Text>
                    </View>
                    <Text style={[styles.historialPorcentaje, { color: colorPorcentaje(p) }]}>{p.toFixed(0)}%</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Icon name="logout" size={18} color="#D32F2F" style={{ marginRight: 8 }} />
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { paddingVertical: 60, alignItems: 'center' },
  header: {
    backgroundColor: COLORS.headerBg,
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  nombre: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  badgeContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },

  invitadoCard: { margin: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 24, alignItems: 'center' },
  invitadoTitulo: { fontSize: 17, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 10, marginBottom: 8 },
  invitadoTexto: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 19, marginBottom: 18 },
  invitadoBtn: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12 },
  invitadoBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  content: { padding: 20 },

  nivelCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  nivelIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  nivelLabel: { fontSize: 11, color: '#777', fontWeight: '600' },
  nivelNombre: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 6 },
  nivelBarBg: { height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  nivelBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  nivelSiguiente: { fontSize: 11, color: '#888' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 14, padding: 14, alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  statValor: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 6 },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },

  seccionTitulo: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 10 },
  unidadesCard: { backgroundColor: '#FFF', borderRadius: 14, paddingVertical: 4, marginBottom: 20, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  unidadRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  unidadIconWrap: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  unidadNombre: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' },
  unidadPorcentaje: { fontSize: 14, fontWeight: 'bold' },
  unidadSinDatos: { fontSize: 12, color: '#AAA', fontStyle: 'italic' },

  historialRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  historialUnidad: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  historialFecha: { fontSize: 11, color: '#999', marginTop: 2 },
  historialPorcentaje: { fontSize: 15, fontWeight: 'bold' },

  vacioCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 30, alignItems: 'center', marginBottom: 20 },
  vacioTexto: { fontSize: 13, color: '#999', marginTop: 10, textAlign: 'center' },

  logoutButton: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 4,
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  logoutButtonText: { color: '#D32F2F', fontSize: 16, fontWeight: 'bold' },
});
