import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { format, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';

const ACCENT = MODULOS.autoevaluacion.color;
import { evaluacionService, SesionConRelaciones } from '../../services/evaluacionService';
import { unidadesService, UnidadConTemas } from '../../services/unidadesService';
import { useRolAcceso } from '../../hooks/useRolAcceso';

type Periodo = 'todas' | 'hoy' | 'semana' | 'mes';

export default function ReportesScreen() {
  const navigation = useNavigation<any>();
  const { puedeVerReportes } = useRolAcceso();

  const [sesiones, setSesiones] = useState<SesionConRelaciones[]>([]);
  const [unidades, setUnidades] = useState<UnidadConTemas[]>([]);
  const [unidadFiltro, setUnidadFiltro] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<Periodo>('todas');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const [dataSesiones, dataUnidades] = await Promise.all([
        evaluacionService.getSesionesTodosDocente(),
        unidadesService.getUnidades(),
      ]);
      setSesiones(dataSesiones);
      setUnidades(dataUnidades);
      setCargando(false);
    };
    cargar();
  }, []);

  const sesionesFiltradas = useMemo(() => {
    return sesiones.filter((s) => {
      if (unidadFiltro && s.unidad_id !== unidadFiltro) return false;
      if (periodo === 'todas') return true;
      const fecha = parseISO(s.fecha);
      if (periodo === 'hoy') return isToday(fecha);
      if (periodo === 'semana') return isThisWeek(fecha, { weekStartsOn: 1 });
      if (periodo === 'mes') return isThisMonth(fecha);
      return true;
    });
  }, [sesiones, unidadFiltro, periodo]);

  const resumen = useMemo(() => {
    const total = sesionesFiltradas.length;
    if (total === 0) return { total: 0, promedio: 0, mejor: 0 };
    const porcentajes = sesionesFiltradas.map((s) => s.porcentaje ?? (s.puntaje / s.total) * 100);
    const promedio = porcentajes.reduce((a, b) => a + b, 0) / total;
    const mejor = Math.max(...porcentajes);
    return { total, promedio, mejor };
  }, [sesionesFiltradas]);

  const colorPorcentaje = (p: number) => (p >= 80 ? COLORS.correcto : p >= 60 ? COLORS.advertencia : COLORS.incorrecto);

  if (!puedeVerReportes) {
    return (
      <View style={styles.restringido}>
        <Icon name="lock-outline" size={48} color="#CCC" />
        <Text style={styles.restringidoText}>No tienes acceso a esta sección.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportes de evaluación</Text>
        <View style={{ width: 30 }} />
      </View>

      {cargando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ACCENT} />
        </View>
      ) : (
        <>
          {/* Tarjetas resumen */}
          <View style={styles.resumenRow}>
            <View style={styles.resumenCard}>
              <Text style={styles.resumenValor}>{resumen.total}</Text>
              <Text style={styles.resumenLabel}>Evaluaciones</Text>
            </View>
            <View style={styles.resumenCard}>
              <Text style={[styles.resumenValor, { color: colorPorcentaje(resumen.promedio) }]}>
                {resumen.promedio.toFixed(0)}%
              </Text>
              <Text style={styles.resumenLabel}>Promedio</Text>
            </View>
            <View style={styles.resumenCard}>
              <Text style={[styles.resumenValor, { color: colorPorcentaje(resumen.mejor) }]}>
                {resumen.mejor.toFixed(0)}%
              </Text>
              <Text style={styles.resumenLabel}>Mejor puntaje</Text>
            </View>
          </View>

          {/* Filtro por unidad */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsRow}
          >
            <TouchableOpacity
              style={[styles.chip, !unidadFiltro && styles.chipActivo]}
              onPress={() => setUnidadFiltro(null)}
            >
              <Text style={[styles.chipText, !unidadFiltro && styles.chipTextActivo]}>Todas</Text>
            </TouchableOpacity>
            {unidades.map((u) => (
              <TouchableOpacity
                key={u.id}
                style={[styles.chip, unidadFiltro === u.id && styles.chipActivo]}
                onPress={() => setUnidadFiltro(u.id)}
              >
                <Text style={[styles.chipText, unidadFiltro === u.id && styles.chipTextActivo]}>
                  Unidad {u.numero}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Filtro por periodo */}
          <View style={styles.periodoRow}>
            {([
              { valor: 'todas', label: 'Todas' },
              { valor: 'hoy', label: 'Hoy' },
              { valor: 'semana', label: 'Esta semana' },
              { valor: 'mes', label: 'Este mes' },
            ] as { valor: Periodo; label: string }[]).map((p) => (
              <TouchableOpacity
                key={p.valor}
                style={[styles.periodoBtn, periodo === p.valor && styles.periodoBtnActivo]}
                onPress={() => setPeriodo(p.valor)}
              >
                <Text style={[styles.periodoText, periodo === p.valor && styles.periodoTextActivo]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={sesionesFiltradas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 20, paddingTop: 10 }}
            renderItem={({ item }) => {
              const porcentaje = item.porcentaje ?? (item.puntaje / item.total) * 100;
              return (
                <View style={styles.sesionCard}>
                  <View style={styles.sesionInfo}>
                    <Text style={styles.sesionNombre}>{item.usuarios?.nombre || 'Estudiante'}</Text>
                    <Text style={styles.sesionUnidad}>
                      Unidad {item.unidades?.numero} — {item.unidades?.titulo}
                    </Text>
                    <Text style={styles.sesionFecha}>
                      {format(parseISO(item.fecha), "dd MMM yyyy, HH:mm", { locale: es })}
                    </Text>
                  </View>
                  <View style={styles.sesionScore}>
                    <Text style={[styles.sesionPorcentaje, { color: colorPorcentaje(porcentaje) }]}>
                      {porcentaje.toFixed(0)}%
                    </Text>
                    <Text style={styles.sesionPuntaje}>{item.puntaje}/{item.total}</Text>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <View style={styles.vacioContainer}>
                <Icon name="chart-line" size={60} color="#CCC" />
                <Text style={styles.vacioText}>No hay evaluaciones registradas con estos filtros.</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  restringido: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  restringidoText: { marginTop: 12, color: '#888', fontSize: 15 },
  header: {
    backgroundColor: ACCENT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  backBtn: { padding: 5 },
  headerTitle: { color: COLORS.headerText, fontSize: 17, fontWeight: 'bold' },
  resumenRow: { flexDirection: 'row', padding: 16, gap: 10 },
  resumenCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 14, padding: 14, alignItems: 'center', elevation: 1 },
  resumenValor: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary },
  resumenLabel: { fontSize: 11, color: '#888', marginTop: 4, textAlign: 'center' },
  chipsScroll: { flexGrow: 0, flexShrink: 0, height: 50 },
  chipsRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 6, alignItems: 'center' },
  chip: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, backgroundColor: '#FFF' },
  chipActivo: { backgroundColor: ACCENT, borderColor: ACCENT },
  chipText: { color: ACCENT, fontSize: 13, fontWeight: '600' },
  chipTextActivo: { color: '#FFF' },
  periodoRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginTop: 8, marginBottom: 4, flexWrap: 'wrap' },
  periodoBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: '#EEE' },
  periodoBtnActivo: { backgroundColor: '#333' },
  periodoText: { fontSize: 12, color: '#555' },
  periodoTextActivo: { color: '#FFF' },
  sesionCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 12, alignItems: 'center', justifyContent: 'space-between', elevation: 1 },
  sesionInfo: { flex: 1, paddingRight: 10 },
  sesionNombre: { fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary },
  sesionUnidad: { fontSize: 12, color: '#666', marginTop: 2 },
  sesionFecha: { fontSize: 11, color: '#999', marginTop: 2 },
  sesionScore: { alignItems: 'flex-end' },
  sesionPorcentaje: { fontSize: 18, fontWeight: 'bold' },
  sesionPuntaje: { fontSize: 12, color: '#888' },
  vacioContainer: { alignItems: 'center', marginTop: 50 },
  vacioText: { color: '#888', marginTop: 10, textAlign: 'center', paddingHorizontal: 30 },
});
