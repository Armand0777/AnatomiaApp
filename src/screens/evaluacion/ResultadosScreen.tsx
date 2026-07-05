import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { evaluacionService } from '../../services/evaluacionService';
import { useAuthStore } from '../../store/useAuthStore';
import { useRolAcceso } from '../../hooks/useRolAcceso';
import { Pregunta } from '../../types';

const { width: ANCHO_PANTALLA } = Dimensions.get('window');
const COLORES_CONFETI = [COLORS.primary, COLORS.secondary, COLORS.advertencia, '#FFD700', '#42A5F5'];

interface ResultadosParams {
  preguntas: Pregunta[];
  respuestasUsuario: Record<string, number>;
  tiempoSegundos: number;
  unidadId: string;
  unidadTitulo: string;
  unidadNumero?: number;
}

function formatearTiempo(segundos: number): string {
  const m = Math.floor(segundos / 60).toString().padStart(2, '0');
  const s = (segundos % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function ConfettiPiece({ index }: { index: number }) {
  const caida = useRef(new Animated.Value(0)).current;
  const izquierda = useMemo(() => Math.random() * ANCHO_PANTALLA, []);
  const color = COLORES_CONFETI[index % COLORES_CONFETI.length];
  const retraso = Math.random() * 400;
  const duracion = 1800 + Math.random() * 1000;
  const rotacionFinal = Math.random() > 0.5 ? '360deg' : '-360deg';

  useEffect(() => {
    Animated.timing(caida, {
      toValue: 1,
      duration: duracion,
      delay: retraso,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = caida.interpolate({ inputRange: [0, 1], outputRange: [-30, 700] });
  const rotate = caida.interpolate({ inputRange: [0, 1], outputRange: ['0deg', rotacionFinal] });
  const opacity = caida.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: izquierda,
        width: 8,
        height: 14,
        backgroundColor: color,
        borderRadius: 2,
        opacity,
        zIndex: 10,
        transform: [{ translateY }, { rotate }],
      }}
    />
  );
}

export default function ResultadosScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { preguntas, respuestasUsuario, tiempoSegundos, unidadId, unidadTitulo, unidadNumero } =
    (route.params ?? {}) as ResultadosParams;

  const usuario = useAuthStore((state) => state.usuario);
  const { esInvitado } = useRolAcceso();
  const guardadoRef = useRef(false);
  const trofeoBounce = useRef(new Animated.Value(0)).current;

  const { puntaje, total, porcentaje, falladas } = useMemo(() => {
    const total = preguntas.length;
    let puntaje = 0;
    const falladas: Pregunta[] = [];
    preguntas.forEach((p) => {
      if (respuestasUsuario[p.id] === p.respuesta_correcta) {
        puntaje += 1;
      } else {
        falladas.push(p);
      }
    });
    const porcentaje = total > 0 ? (puntaje / total) * 100 : 0;
    return { puntaje, total, porcentaje, falladas };
  }, [preguntas, respuestasUsuario]);

  useEffect(() => {
    Animated.spring(trofeoBounce, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    const guardar = async () => {
      if (guardadoRef.current || esInvitado || !usuario) return;
      guardadoRef.current = true;
      try {
        await evaluacionService.guardarSesion({
          usuario_id: usuario.id,
          unidad_id: unidadId,
          puntaje,
          total,
          respuestas: respuestasUsuario,
          completado: true,
        });
      } catch (error) {
        console.error('No se pudo guardar la sesión de evaluación:', error);
      }
    };
    guardar();
  }, []);

  const colorPorcentaje =
    porcentaje >= 80 ? COLORS.correcto : porcentaje >= 60 ? COLORS.advertencia : COLORS.incorrecto;
  const aprobado = porcentaje >= 60;

  const mensaje =
    porcentaje >= 80
      ? '¡Excelente dominio del tema! Has alcanzado un gran nivel de comprensión.'
      : porcentaje >= 60
      ? 'Buen trabajo. Has alcanzado un buen nivel de comprensión. Te recomendamos reforzar los siguientes temas:'
      : 'Necesitas repasar este tema con más calma. Te recomendamos reforzar los siguientes temas:';

  const etiquetaUnidad = unidadNumero ? `Unidad ${unidadNumero} — ${unidadTitulo}` : unidadTitulo;

  return (
    <View style={styles.container}>
      {/* Confeti si aprobó */}
      {aprobado && Array.from({ length: 24 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultados de la Evaluación</Text>
        <Icon name="trophy" size={26} color="#FFD700" style={{ marginRight: 4 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Sección superior: Trofeo + Puntaje */}
        <View style={styles.topCard}>
          <Animated.View style={{ transform: [{ scale: trofeoBounce }] }}>
            <Icon name="trophy" size={88} color={aprobado ? '#FFD700' : '#BDBDBD'} />
          </Animated.View>
          <View style={styles.topInfoCol}>
            <Text style={styles.completadoText}>¡Evaluación{'\n'}completada!</Text>
            <Text style={styles.puntajeRow}>
              <Text style={styles.puntajeNum}>{puntaje}</Text>
              <Text style={styles.puntajeTotal}> / {total}</Text>
            </Text>
            <Text style={[styles.porcentaje, { color: colorPorcentaje }]}>
              {porcentaje.toFixed(0)}% de rendimiento
            </Text>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={[styles.statIconWrap, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="check-circle" size={22} color={COLORS.correcto} />
            </View>
            <Text style={styles.statValue}>{puntaje}</Text>
            <Text style={styles.statLabel}>Correctas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconWrap, { backgroundColor: '#FFEBEE' }]}>
              <Icon name="close-circle" size={22} color={COLORS.incorrecto} />
            </View>
            <Text style={styles.statValue}>{total - puntaje}</Text>
            <Text style={styles.statLabel}>Incorrectas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconWrap, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="clock-outline" size={22} color="#1565C0" />
            </View>
            <Text style={styles.statValue}>{formatearTiempo(tiempoSegundos)}</Text>
            <Text style={styles.statLabel}>Tiempo empleado</Text>
          </View>
        </View>

        {/* Retroalimentación + cerebro */}
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackLabel}>RETROALIMENTACIÓN</Text>
            <Text style={styles.feedbackText}>{mensaje}</Text>
            {falladas.length > 0 && (
              <View style={styles.chip}>
                <Icon name="book-open-outline" size={13} color={COLORS.primary} />
                <Text style={styles.chipText}>{etiquetaUnidad}</Text>
              </View>
            )}
          </View>
          <Icon name="brain" size={72} color={COLORS.primary + '25'} />
        </View>

        {/* Resumen por pregunta */}
        <View style={styles.gridSection}>
          <Text style={styles.gridTitle}>Resumen por pregunta</Text>
          <View style={styles.grid}>
            {preguntas.map((p, idx) => {
              const correcta = respuestasUsuario[p.id] === p.respuesta_correcta;
              return (
                <View
                  key={p.id}
                  style={[
                    styles.gridCell,
                    { backgroundColor: correcta ? '#E8F5E9' : '#FFEBEE' },
                  ]}
                >
                  <Text style={[styles.gridNumero, { color: correcta ? COLORS.correcto : COLORS.incorrecto }]}>
                    {idx + 1}
                  </Text>
                  <Icon
                    name={correcta ? 'check' : 'close'}
                    size={14}
                    color={correcta ? COLORS.correcto : COLORS.incorrecto}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.gridLeyenda}>
            <View style={styles.leyendaItem}>
              <View style={[styles.leyendaDot, { backgroundColor: COLORS.correcto }]} />
              <Text style={styles.leyendaText}>Correcta</Text>
            </View>
            <View style={styles.leyendaItem}>
              <View style={[styles.leyendaDot, { backgroundColor: COLORS.incorrecto }]} />
              <Text style={styles.leyendaText}>Incorrecta</Text>
            </View>
          </View>
        </View>

        {esInvitado && (
          <Text style={styles.invitadoNota}>
            Como invitado, este resultado no se guardó en tu historial.
          </Text>
        )}

        {/* Botones */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.revisarBtn}
            onPress={() =>
              navigation.navigate('RevisionRespuestas', {
                preguntas,
                respuestasUsuario,
                unidadId,
                unidadTitulo,
              })
            }
          >
            <Icon name="text-box-search-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.revisarBtnText}>Revisar respuestas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.repetirBtn}
            onPress={() =>
              navigation.replace('SimulacionExamen', { unidadId, unidadTitulo, unidadNumero })
            }
          >
            <Icon name="refresh" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.repetirBtnText}>Repetir evaluación</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },

  // ── Header ──
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  headerBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  scrollContent: { padding: 16, paddingBottom: 40 },

  // ── Trofeo + puntaje ──
  topCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  topInfoCol: { flex: 1, marginLeft: 16 },
  completadoText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 21,
  },
  puntajeRow: { marginBottom: 4 },
  puntajeNum: { fontSize: 48, fontWeight: '900', color: COLORS.primary },
  puntajeTotal: { fontSize: 22, fontWeight: '700', color: '#888' },
  porcentaje: { fontSize: 14, fontWeight: 'bold' },

  // ── Estadísticas ──
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statIconWrap: { borderRadius: 20, padding: 8, marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1B1B1B' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, height: '60%', backgroundColor: '#EEE' },

  // ── Retroalimentación ──
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  feedbackContent: { flex: 1, marginRight: 10 },
  feedbackLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#AAA',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  feedbackText: { fontSize: 13, color: '#444', lineHeight: 20, marginBottom: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primary + '18',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  chipText: { fontSize: 12, color: COLORS.primary, fontWeight: '600', flexShrink: 1 },

  // ── Grid de preguntas ──
  gridSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  gridTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  gridCell: {
    width: '17%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridNumero: { fontSize: 12, fontWeight: 'bold' },
  gridLeyenda: { flexDirection: 'row', gap: 16, marginTop: 12 },
  leyendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  leyendaDot: { width: 10, height: 10, borderRadius: 5 },
  leyendaText: { fontSize: 12, color: '#666' },

  invitadoNota: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 12,
    textAlign: 'center',
  },

  // ── Botones ──
  footer: { gap: 12 },
  revisarBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revisarBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 },
  repetirBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repetirBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});
