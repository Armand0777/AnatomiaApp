import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';

const ACCENT = MODULOS.autoevaluacion.color;
import { evaluacionService } from '../../services/evaluacionService';
import { useAuthStore } from '../../store/useAuthStore';
import { useRolAcceso } from '../../hooks/useRolAcceso';
import { Pregunta } from '../../types';

const { width: ANCHO_PANTALLA } = Dimensions.get('window');
const COLORES_CONFETI = [ACCENT, COLORS.secondary, COLORS.advertencia, '#FFD700', '#42A5F5'];

interface ResultadosParams {
  preguntas: Pregunta[];
  respuestasUsuario: Record<string, number>;
  tiempoSegundos: number;
  unidadId: string;
  unidadTitulo: string;
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
        transform: [{ translateY }, { rotate }],
      }}
    />
  );
}

export default function ResultadosScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { preguntas, respuestasUsuario, tiempoSegundos, unidadId, unidadTitulo } =
    (route.params ?? {}) as ResultadosParams;

  const usuario = useAuthStore((state) => state.usuario);
  const { esInvitado } = useRolAcceso();
  const guardadoRef = useRef(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

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
    Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }).start();
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

  const colorPorcentaje = porcentaje >= 80 ? COLORS.correcto : porcentaje >= 60 ? COLORS.advertencia : COLORS.incorrecto;
  const aprobado = porcentaje >= 60;

  const mensaje =
    porcentaje >= 80
      ? '¡Excelente dominio del tema!'
      : porcentaje >= 60
      ? 'Buen trabajo, aún puedes mejorar.'
      : 'Necesitas repasar este tema con más calma.';

  const chipsRefuerzo = falladas.slice(0, 6).map((p) => {
    const palabras = p.enunciado.split(' ').slice(0, 5).join(' ');
    return palabras.length < p.enunciado.length ? `${palabras}…` : palabras;
  });

  return (
    <View style={styles.container}>
      {/* Confeti solo si aprobó */}
      {aprobado && Array.from({ length: 24 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          <Icon name="trophy" size={64} color={aprobado ? '#FFD700' : '#BDBDBD'} />
          <Text style={styles.titulo}>¡Evaluación completada!</Text>

          <Text style={styles.puntajeGrande}>{puntaje}/{total}</Text>
          <Text style={[styles.porcentaje, { color: colorPorcentaje }]}>{porcentaje.toFixed(0)}% de acierto</Text>

          {/* Estadísticas */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="check-circle" size={22} color={COLORS.correcto} />
              <Text style={styles.statValue}>{puntaje}</Text>
              <Text style={styles.statLabel}>Correctas</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="close-circle" size={22} color={COLORS.incorrecto} />
              <Text style={styles.statValue}>{total - puntaje}</Text>
              <Text style={styles.statLabel}>Incorrectas</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="clock-outline" size={22} color={COLORS.neutro} />
              <Text style={styles.statValue}>{formatearTiempo(tiempoSegundos)}</Text>
              <Text style={styles.statLabel}>Tiempo</Text>
            </View>
          </View>

          {/* Retroalimentación */}
          <View style={[styles.feedbackBox, { borderColor: colorPorcentaje }]}>
            <Text style={[styles.feedbackText, { color: colorPorcentaje }]}>{mensaje}</Text>
          </View>

          {chipsRefuerzo.length > 0 && (
            <View style={styles.refuerzoSection}>
              <Text style={styles.refuerzoTitulo}>Temas a reforzar</Text>
              <View style={styles.chipsContainer}>
                {chipsRefuerzo.map((texto, idx) => (
                  <View key={idx} style={styles.chip}>
                    <Text style={styles.chipText}>{texto}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Grid de preguntas */}
          <View style={styles.grid}>
            {preguntas.map((p, idx) => {
              const correcta = respuestasUsuario[p.id] === p.respuesta_correcta;
              return (
                <View
                  key={p.id}
                  style={[styles.gridCell, { backgroundColor: correcta ? '#E8F5E9' : '#FFEBEE' }]}
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

          {esInvitado && (
            <Text style={styles.invitadoNota}>
              Como invitado, este resultado no se guardó en tu historial.
            </Text>
          )}
        </Animated.View>

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
            <Icon name="text-box-search-outline" size={20} color={ACCENT} style={{ marginRight: 8 }} />
            <Text style={styles.revisarBtnText}>Revisar respuestas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.repetirBtn}
            onPress={() => navigation.replace('SimulacionExamen', { unidadId, unidadTitulo })}
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
  container: { flex: 1, backgroundColor: ACCENT },
  scrollContent: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },
  titulo: { fontSize: 22, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 12, marginBottom: 16 },
  puntajeGrande: { fontSize: 52, fontWeight: '900', color: COLORS.textPrimary },
  porcentaje: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 4 },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  feedbackBox: { borderWidth: 1.5, borderRadius: 12, padding: 12, width: '100%', marginBottom: 16 },
  feedbackText: { textAlign: 'center', fontWeight: '600', fontSize: 14 },
  refuerzoSection: { width: '100%', marginBottom: 20 },
  refuerzoTitulo: { fontSize: 13, fontWeight: 'bold', color: '#777', marginBottom: 8 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: COLORS.card, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  chipText: { fontSize: 12, color: ACCENT },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', gap: 6, justifyContent: 'center' },
  gridCell: { width: '17%', aspectRatio: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  gridNumero: { fontSize: 12, fontWeight: 'bold' },
  invitadoNota: { fontSize: 12, color: '#999', fontStyle: 'italic', marginTop: 16, textAlign: 'center' },
  footer: { marginTop: 24 },
  revisarBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  revisarBtnText: { color: ACCENT, fontWeight: 'bold', fontSize: 15 },
  repetirBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repetirBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});
