import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';

const ACCENT = MODULOS.autoevaluacion.color;
import { evaluacionService } from '../../services/evaluacionService';
import { Pregunta } from '../../types';

const TOTAL_PREGUNTAS = 20;
const DURACION_SEGUNDOS = 30 * 60;

interface ExamenParams {
  unidadId: string;
  unidadTitulo: string;
  unidadNumero?: number;
}

function obtenerLetra(opcion: { letra?: string; id?: string }, index: number): string {
  return opcion.letra || opcion.id?.toUpperCase() || String.fromCharCode(65 + index);
}

function formatearTiempo(segundos: number): string {
  const m = Math.floor(segundos / 60).toString().padStart(2, '0');
  const s = (segundos % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function mezclar<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SimulacionExamenScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { unidadId, unidadTitulo, unidadNumero } = (route.params ?? {}) as ExamenParams;

  const [cargando, setCargando] = useState(true);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState<Record<string, number>>({});
  const [tiempoRestante, setTiempoRestante] = useState(DURACION_SEGUNDOS);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalizadoRef = useRef(false);

  useEffect(() => {
    const cargarPreguntas = async () => {
      const data = await evaluacionService.getPreguntasPorUnidad(unidadId);
      const seleccionadas = mezclar(data).slice(0, TOTAL_PREGUNTAS);
      setPreguntas(seleccionadas);
      setCargando(false);
    };
    if (unidadId) cargarPreguntas();
  }, [unidadId]);

  useEffect(() => {
    if (cargando) return;
    intervalRef.current = setInterval(() => {
      setTiempoRestante((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cargando]);

  useEffect(() => {
    if (tiempoRestante === 0 && !cargando && preguntas.length > 0) {
      finalizar();
    }
  }, [tiempoRestante]);

  // Bloquea el botón físico de "atrás" en Android para no perder el progreso por accidente
  useEffect(() => {
    const onBackPress = () => {
      confirmarSalida();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  const confirmarSalida = () => {
    Alert.alert(
      'Salir de la evaluación',
      'Si sales ahora perderás tu progreso en este intento. ¿Deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const seleccionarOpcion = (preguntaId: string, indiceOpcion: number) => {
    setRespuestasUsuario((prev) => ({ ...prev, [preguntaId]: indiceOpcion }));
  };

  const irSiguiente = () => {
    if (indiceActual < preguntas.length - 1) {
      setIndiceActual((prev) => prev + 1);
    } else {
      finalizar();
    }
  };

  const irAnterior = () => {
    if (indiceActual > 0) setIndiceActual((prev) => prev - 1);
  };

  const finalizar = () => {
    if (finalizadoRef.current) return;
    finalizadoRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);

    const tiempoSegundos = DURACION_SEGUNDOS - tiempoRestante;
    navigation.replace('Resultados', {
      preguntas,
      respuestasUsuario,
      tiempoSegundos,
      unidadId,
      unidadTitulo,
    });
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  if (preguntas.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Icon name="close" size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerUnidad}>{unidadTitulo}</Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="text-box-remove-outline" size={70} color="#CCC" />
          <Text style={styles.emptyText}>Aún no hay preguntas cargadas para esta unidad.</Text>
        </View>
      </View>
    );
  }

  const pregunta = preguntas[indiceActual];
  const opcionSeleccionada = respuestasUsuario[pregunta.id] ?? null;
  const puntajeActual = Object.keys(respuestasUsuario).reduce((acc, id) => {
    const p = preguntas.find((preg) => preg.id === id);
    return acc + (p && respuestasUsuario[id] === p.respuesta_correcta ? 1 : 0);
  }, 0);
  const progresoPorcentaje = ((indiceActual + 1) / preguntas.length) * 100;
  const tiempoCritico = tiempoRestante <= 60;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={confirmarSalida} style={styles.headerBtn}>
          <Icon name="close" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerUnidad} numberOfLines={1}>{unidadTitulo}</Text>
        <View style={[styles.timerBadge, tiempoCritico && styles.timerBadgeCritico]}>
          <Icon name="timer-outline" size={16} color={tiempoCritico ? '#FFF' : COLORS.headerText} />
          <Text style={[styles.timerText, tiempoCritico && styles.timerTextCritico]}>
            {formatearTiempo(tiempoRestante)}
          </Text>
        </View>
      </View>

      {/* Progreso */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Pregunta {indiceActual + 1} de {preguntas.length}</Text>
          <Text style={styles.progressLabel}>{Math.round(progresoPorcentaje)}% completado</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progresoPorcentaje}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tarjeta de pregunta */}
        <View style={styles.preguntaCard}>
          <Text style={styles.preguntaText}>{pregunta.enunciado}</Text>
        </View>

        {/* Opciones */}
        <View style={styles.opcionesContainer}>
          {pregunta.opciones.map((opcion, index) => {
            const letra = obtenerLetra(opcion, index);
            const seleccionada = opcionSeleccionada === index;
            return (
              <TouchableOpacity
                key={letra + index}
                style={[styles.opcionBtn, seleccionada && styles.opcionBtnSeleccionada]}
                onPress={() => seleccionarOpcion(pregunta.id, index)}
                activeOpacity={0.8}
              >
                <View style={[styles.letraCirculo, seleccionada && styles.letraCirculoSeleccionada]}>
                  <Text style={[styles.letraTexto, seleccionada && styles.letraTextoSeleccionada]}>{letra}</Text>
                </View>
                <Text style={styles.opcionTexto}>{opcion.texto}</Text>
                {seleccionada && <Icon name="check-circle" size={22} color={ACCENT} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Consejo / explicación */}
        {opcionSeleccionada !== null && pregunta.explicacion && (
          <View style={styles.consejoCard}>
            <View style={styles.consejoHeader}>
              <Icon name="lightbulb-on-outline" size={18} color={COLORS.advertencia} />
              <Text style={styles.consejoTitulo}>Consejo</Text>
            </View>
            <Text style={styles.consejoTexto}>{pregunta.explicacion}</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfoRow}>
          <View style={styles.unidadBadge}>
            <Text style={styles.unidadBadgeText}>Unidad {unidadNumero ?? ''}</Text>
          </View>
          <Text style={styles.puntajeText}>Puntaje: {puntajeActual}</Text>
        </View>
        <View style={styles.footerBtnRow}>
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnSecundario, indiceActual === 0 && styles.navBtnDisabled]}
            onPress={irAnterior}
            disabled={indiceActual === 0}
          >
            <Text style={styles.navBtnSecundarioText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, styles.navBtnPrimario]} onPress={irSiguiente}>
            <Text style={styles.navBtnPrimarioText}>
              {indiceActual === preguntas.length - 1 ? 'Finalizar ✓' : 'Siguiente'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyText: { marginTop: 15, fontSize: 15, color: '#666', textAlign: 'center' },

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
  headerUnidad: { flex: 1, color: COLORS.headerText, fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginHorizontal: 8 },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  timerBadgeCritico: { backgroundColor: COLORS.incorrecto },
  timerText: { color: COLORS.headerText, fontWeight: 'bold', fontSize: 13 },
  timerTextCritico: { color: '#FFF' },

  progressSection: { paddingHorizontal: 20, paddingTop: 14 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: '#777' },
  progressBarBg: { height: 7, backgroundColor: ACCENT + '14', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: ACCENT, borderRadius: 4 },

  scrollContent: { padding: 20, paddingBottom: 30 },
  preguntaCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: ACCENT,
    padding: 18,
    marginBottom: 20,
  },
  preguntaText: { fontSize: 17, fontWeight: '600', color: COLORS.textPrimary, lineHeight: 24 },

  opcionesContainer: { gap: 12 },
  opcionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
  },
  opcionBtnSeleccionada: { backgroundColor: ACCENT + '14', borderColor: ACCENT },
  letraCirculo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  letraCirculoSeleccionada: { backgroundColor: ACCENT },
  letraTexto: { fontWeight: 'bold', color: ACCENT },
  letraTextoSeleccionada: { color: '#FFF' },
  opcionTexto: { flex: 1, fontSize: 15, color: COLORS.textPrimary, lineHeight: 21 },

  consejoCard: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
  },
  consejoHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  consejoTitulo: { fontWeight: 'bold', color: '#8D6E00', fontSize: 14 },
  consejoTexto: { fontSize: 14, color: '#5D4D00', lineHeight: 20 },

  footer: { borderTopWidth: 1, borderTopColor: '#EEE', padding: 16, backgroundColor: '#FFF' },
  footerInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  unidadBadge: { backgroundColor: COLORS.card, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  unidadBadgeText: { color: ACCENT, fontSize: 12, fontWeight: 'bold' },
  puntajeText: { fontSize: 13, color: '#666', fontWeight: '600' },
  footerBtnRow: { flexDirection: 'row', gap: 12 },
  navBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  navBtnPrimario: { backgroundColor: ACCENT },
  navBtnPrimarioText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  navBtnSecundario: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: COLORS.border },
  navBtnSecundarioText: { color: ACCENT, fontWeight: 'bold', fontSize: 15 },
  navBtnDisabled: { opacity: 0.4 },
});
