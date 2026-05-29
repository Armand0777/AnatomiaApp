import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';

export default function QuizResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { puntaje, total, unidadId, unidadTitulo } = route.params || {};

  const porcentaje = total > 0 ? (puntaje / total) * 100 : 0;
  const aprobado = porcentaje >= 60; // 60% para aprobar

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  let iconName: any = aprobado ? "trophy" : "emoticon-sad-outline";
  let iconColor = aprobado ? "#FFD700" : "#FF5252";
  let title = aprobado ? "¡Felicidades!" : "Sigue practicando";
  let subtitle = aprobado 
    ? "Has aprobado esta unidad con éxito. ¡Sigue así!" 
    : "No te rindas. Revisa el contenido e inténtalo de nuevo.";

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Icon name={iconName} size={80} color={iconColor} />
        </View>
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreNumber}>{puntaje}</Text>
          <Text style={styles.scoreText}>de {total} correctas</Text>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${porcentaje}%`, backgroundColor: iconColor }]} />
        </View>
        <Text style={styles.percentageText}>{porcentaje.toFixed(0)}% de acierto</Text>

      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.retryBtn} 
          onPress={() => navigation.replace('Quiz', { unidadId, unidadTitulo })}
        >
          <Icon name="refresh" size={24} color={COLORS.primary} style={{ marginRight: 10 }} />
          <Text style={styles.retryBtnText}>Reintentar Evaluación</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.finishBtn} 
          onPress={() => navigation.navigate('Temas', { unidadId, unidadTitulo })}
        >
          <Text style={styles.finishBtnText}>Volver a la Unidad</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 30, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, shadowOffset: { width: 0, height: 10 } },
  iconContainer: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  scoreContainer: { alignItems: 'center', marginBottom: 20 },
  scoreNumber: { fontSize: 60, fontWeight: '900', color: '#1A1A1A', lineHeight: 60 },
  scoreText: { fontSize: 18, color: '#888', fontWeight: '600' },
  progressBarBg: { width: '100%', height: 12, backgroundColor: '#F0F0F0', borderRadius: 6, overflow: 'hidden', marginBottom: 10 },
  progressBarFill: { height: '100%', borderRadius: 6 },
  percentageText: { fontSize: 16, fontWeight: 'bold', color: '#444' },
  footer: { marginTop: 40 },
  retryBtn: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  retryBtnText: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold' },
  finishBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  finishBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
