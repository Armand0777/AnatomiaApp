import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';

const ACCENT = MODULOS.autoevaluacion.color;
import { Pregunta } from '../../types';

interface RevisionParams {
  preguntas: Pregunta[];
  respuestasUsuario: Record<string, number>;
  unidadId: string;
  unidadTitulo: string;
  indiceInicial?: number;
}

function obtenerLetra(opcion: { letra?: string; id?: string }, index: number): string {
  return opcion.letra || opcion.id?.toUpperCase() || String.fromCharCode(65 + index);
}

export default function RevisionRespuestasScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { preguntas, respuestasUsuario, unidadId, unidadTitulo, indiceInicial } =
    (route.params ?? {}) as RevisionParams;

  const [indiceActual, setIndiceActual] = useState(indiceInicial ?? 0);

  const pregunta = preguntas[indiceActual];
  const indiceUsuario = respuestasUsuario[pregunta.id];
  const respondida = indiceUsuario !== undefined;
  const esCorrecta = indiceUsuario === pregunta.respuesta_correcta;

  const opcionUsuario = respondida ? pregunta.opciones[indiceUsuario] : null;
  const opcionCorrecta = pregunta.opciones[pregunta.respuesta_correcta];

  const irSiguiente = () => setIndiceActual((prev) => Math.min(prev + 1, preguntas.length - 1));
  const irAnterior = () => setIndiceActual((prev) => Math.max(prev - 1, 0));

  const volverAlInicio = () => {
    navigation.navigate('MainDrawer', { screen: 'Autoevaluacion' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pregunta {indiceActual + 1} de {preguntas.length}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.badge, esCorrecta ? styles.badgeCorrecta : styles.badgeIncorrecta]}>
          <Icon name={esCorrecta ? 'check-circle' : 'close-circle'} size={16} color="#FFF" />
          <Text style={styles.badgeText}>{esCorrecta ? 'Correcta' : respondida ? 'Incorrecta' : 'Sin responder'}</Text>
        </View>

        <Text style={styles.enunciado}>{pregunta.enunciado}</Text>

        <View style={styles.respuestaBox}>
          <Text style={styles.respuestaLabel}>Tu respuesta</Text>
          <Text style={[styles.respuestaTexto, { color: respondida ? (esCorrecta ? COLORS.correcto : COLORS.incorrecto) : COLORS.neutro }]}>
            {respondida
              ? `${obtenerLetra(opcionUsuario!, indiceUsuario)}. ${opcionUsuario!.texto}`
              : 'No respondiste esta pregunta'}
          </Text>
        </View>

        {!esCorrecta && (
          <View style={styles.respuestaBox}>
            <Text style={styles.respuestaLabel}>Respuesta correcta</Text>
            <Text style={[styles.respuestaTexto, { color: COLORS.correcto }]}>
              {obtenerLetra(opcionCorrecta, pregunta.respuesta_correcta)}. {opcionCorrecta.texto}
            </Text>
          </View>
        )}

        {pregunta.explicacion && (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackLabel}>Retroalimentación</Text>
            <Text style={styles.feedbackTexto}>{pregunta.explicacion}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.paginacionRow}>
          <TouchableOpacity
            style={[styles.pagBtn, indiceActual === 0 && styles.pagBtnDisabled]}
            disabled={indiceActual === 0}
            onPress={irAnterior}
          >
            <Icon name="chevron-left" size={22} color={indiceActual === 0 ? '#CCC' : ACCENT} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pagBtn, indiceActual === preguntas.length - 1 && styles.pagBtnDisabled]}
            disabled={indiceActual === preguntas.length - 1}
            onPress={irSiguiente}
          >
            <Icon name="chevron-right" size={22} color={indiceActual === preguntas.length - 1 ? '#CCC' : ACCENT} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.volverBtn} onPress={volverAlInicio}>
          <Text style={styles.volverBtnText}>Volver al inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.repetirBtn}
          onPress={() => navigation.replace('SimulacionExamen', { unidadId, unidadTitulo })}
        >
          <Text style={styles.repetirBtnText}>Repetir examen</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingHorizontal: 10,
  },
  headerBtn: { padding: 5 },
  headerTitle: { color: COLORS.headerText, fontSize: 16, fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingBottom: 30 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 14,
  },
  badgeCorrecta: { backgroundColor: COLORS.correcto },
  badgeIncorrecta: { backgroundColor: COLORS.incorrecto },
  badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  enunciado: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, lineHeight: 26, marginBottom: 20 },
  respuestaBox: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 12 },
  respuestaLabel: { fontSize: 12, color: '#777', marginBottom: 4, fontWeight: 'bold' },
  respuestaTexto: { fontSize: 15, fontWeight: '600' },
  feedbackBox: { backgroundColor: '#FFF8E1', borderRadius: 12, padding: 14, marginTop: 8 },
  feedbackLabel: { fontSize: 12, color: '#8D6E00', marginBottom: 4, fontWeight: 'bold' },
  feedbackTexto: { fontSize: 14, color: '#5D4D00', lineHeight: 20 },
  footer: { borderTopWidth: 1, borderTopColor: '#EEE', padding: 16, backgroundColor: '#FFF' },
  paginacionRow: { flexDirection: 'row', justifyContent: 'center', gap: 30, marginBottom: 14 },
  pagBtn: { backgroundColor: COLORS.card, borderRadius: 20, padding: 8 },
  pagBtnDisabled: { backgroundColor: '#F5F5F5' },
  volverBtn: { borderWidth: 1.5, borderColor: COLORS.border, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  volverBtnText: { color: ACCENT, fontWeight: 'bold', fontSize: 15 },
  repetirBtn: { backgroundColor: ACCENT, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  repetirBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});
