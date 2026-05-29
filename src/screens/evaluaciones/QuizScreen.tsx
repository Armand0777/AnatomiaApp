import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { quizService } from '../../services/quizService';
import { Pregunta } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';

const { width } = Dimensions.get('window');

export default function QuizScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { unidadId, unidadTitulo } = route.params || {};
  const { sesion } = useAuthStore();

  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [indiceActual, setIndiceActual] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<number | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState<Record<string, number>>({});

  useEffect(() => {
    if (unidadId) {
      cargarPreguntas();
    }
  }, [unidadId]);

  const cargarPreguntas = async () => {
    try {
      setCargando(true);
      const data = await quizService.getPreguntasPorUnidad(unidadId);
      // Opcional: desordenar las preguntas o tomar un subconjunto
      setPreguntas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const manejarSeleccion = (index: number) => {
    if (mostrarResultado) return; // Ya respondió
    setOpcionSeleccionada(index);
    setMostrarResultado(true);

    const pregunta = preguntas[indiceActual];
    const esCorrecta = index === pregunta.respuesta_correcta;
    
    if (esCorrecta) {
      setPuntaje(prev => prev + 1);
    }

    setRespuestasUsuario(prev => ({
      ...prev,
      [pregunta.id]: index
    }));
  };

  const siguientePregunta = async () => {
    if (indiceActual < preguntas.length - 1) {
      setIndiceActual(prev => prev + 1);
      setOpcionSeleccionada(null);
      setMostrarResultado(false);
    } else {
      // Guardar resultados y finalizar
      try {
        await quizService.guardarResultadoEvaluacion({
          usuario_id: sesion?.user.id || null,
          unidad_id: unidadId,
          puntaje: puntaje,
          total: preguntas.length,
          porcentaje: (puntaje / preguntas.length) * 100,
          respuestas: respuestasUsuario,
          completado: true
        });
        
        navigation.replace('QuizResult', { 
          puntaje, 
          total: preguntas.length,
          unidadId,
          unidadTitulo 
        });
      } catch (error) {
        console.error(error);
        navigation.replace('QuizResult', { 
          puntaje, 
          total: preguntas.length,
          unidadId,
          unidadTitulo 
        });
      }
    }
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (preguntas.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="text-box-remove-outline" size={80} color="#CCC" />
          <Text style={styles.emptyText}>Aún no hay preguntas para esta unidad.</Text>
        </View>
      </View>
    );
  }

  const pregunta = preguntas[indiceActual];
  const progreso = ((indiceActual) / preguntas.length) * 100;

  return (
    <View style={styles.container}>
      {/* HEADER PROGRESS */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="close" size={28} color="#666" />
        </TouchableOpacity>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progreso}%` }]} />
        </View>
        <Text style={styles.progressText}>{indiceActual + 1}/{preguntas.length}</Text>
      </View>

      {/* QUESTION */}
      <View style={styles.content}>
        <Text style={styles.questionText}>{pregunta.enunciado}</Text>
        
        <View style={styles.optionsContainer}>
          {pregunta.opciones.map((opcion, index) => {
            let isSelected = opcionSeleccionada === index;
            let isCorrect = index === pregunta.respuesta_correcta;
            
            let btnStyle = styles.optionBtn;
            let textStyle = styles.optionText;
            let iconName: any = "checkbox-blank-circle-outline";
            let iconColor = "#999";

            if (mostrarResultado) {
              if (isCorrect) {
                btnStyle = styles.optionBtnCorrect;
                textStyle = styles.optionTextCorrect;
                iconName = "check-circle";
                iconColor = "#2E7D32";
              } else if (isSelected) {
                btnStyle = styles.optionBtnWrong;
                textStyle = styles.optionTextWrong;
                iconName = "close-circle";
                iconColor = "#C62828";
              }
            } else if (isSelected) {
              btnStyle = styles.optionBtnSelected;
              iconName = "checkbox-marked-circle";
              iconColor = COLORS.primary;
            }

            return (
              <TouchableOpacity 
                key={opcion.id || index}
                style={[styles.optionBtnBase, btnStyle]}
                onPress={() => manejarSeleccion(index)}
                activeOpacity={0.7}
              >
                <Icon name={iconName} size={24} color={iconColor} style={{ marginRight: 15 }} />
                <Text style={textStyle}>{opcion.texto}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FEEDBACK */}
        {mostrarResultado && (
          <View style={[
            styles.feedbackContainer, 
            opcionSeleccionada === pregunta.respuesta_correcta ? styles.feedbackCorrect : styles.feedbackWrong
          ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <Icon 
                name={opcionSeleccionada === pregunta.respuesta_correcta ? "check-decagram" : "alert-circle"} 
                size={20} 
                color={opcionSeleccionada === pregunta.respuesta_correcta ? "#2E7D32" : "#C62828"} 
              />
              <Text style={[
                styles.feedbackTitle,
                { color: opcionSeleccionada === pregunta.respuesta_correcta ? "#2E7D32" : "#C62828" }
              ]}>
                {opcionSeleccionada === pregunta.respuesta_correcta ? '¡Correcto!' : 'Incorrecto'}
              </Text>
            </View>
            {pregunta.explicacion && (
              <Text style={styles.feedbackText}>{pregunta.explicacion}</Text>
            )}
          </View>
        )}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.nextBtn, !mostrarResultado && { opacity: 0.5 }]} 
          disabled={!mostrarResultado}
          onPress={siguientePregunta}
        >
          <Text style={styles.nextBtnText}>
            {indiceActual === preguntas.length - 1 ? 'Finalizar Evaluación' : 'Siguiente Pregunta'}
          </Text>
          <Icon name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { marginTop: 15, fontSize: 16, color: '#666', textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } },
  backBtn: { padding: 5 },
  progressBarBg: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, marginHorizontal: 15, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  content: { flex: 1, padding: 20 },
  questionText: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 30, lineHeight: 30 },
  optionsContainer: { flex: 1 },
  optionBtnBase: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 12, marginBottom: 15, borderWidth: 2 },
  optionBtn: { backgroundColor: '#FFF', borderColor: '#EBEBEB' },
  optionBtnSelected: { backgroundColor: '#F0F7FF', borderColor: COLORS.primary },
  optionBtnCorrect: { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' },
  optionBtnWrong: { backgroundColor: '#FFEBEE', borderColor: '#F44336' },
  optionText: { flex: 1, fontSize: 16, color: '#333' },
  optionTextCorrect: { flex: 1, fontSize: 16, color: '#2E7D32', fontWeight: 'bold' },
  optionTextWrong: { flex: 1, fontSize: 16, color: '#C62828', fontWeight: 'bold' },
  feedbackContainer: { padding: 15, borderRadius: 12, marginTop: 10, borderWidth: 1 },
  feedbackCorrect: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  feedbackWrong: { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' },
  feedbackTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  feedbackText: { fontSize: 14, color: '#444', marginTop: 5, lineHeight: 20 },
  footer: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
  nextBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginRight: 10 }
});
