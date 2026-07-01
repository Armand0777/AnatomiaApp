import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { CATEGORIAS_ANATOMICAS } from '../../data/categoriasAnatomicas';

// Pantalla de categorías de Videos explicativos (espejo de Esquemas: las
// mismas 4 categorías temáticas).
export default function VideosScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Videos Explicativos</Text>
        <View style={{ width: 26 }} />
      </View>

      <Text style={styles.intro}>
        Explora videos educativos y material audiovisual sobre anatomía de cabeza y cuello.
      </Text>

      <View style={styles.grid}>
        {CATEGORIAS_ANATOMICAS.map((cat) => (
          <TouchableOpacity
            key={cat.categoria}
            style={styles.tarjeta}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('VideosCategoria', { categoria: cat.categoria, titulo: cat.titulo })}
          >
            <Text style={styles.tarjetaEmoji}>{cat.icono}</Text>
            <Text style={styles.tarjetaTitulo}>{cat.titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  headerBtn: { padding: 4 },
  headerTitle: { color: COLORS.headerText, fontSize: 16, fontWeight: 'bold' },
  intro: { fontSize: 13, color: '#666', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6, lineHeight: 18 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 12 },
  tarjeta: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 26,
    alignItems: 'center',
  },
  tarjetaEmoji: { fontSize: 36, marginBottom: 10 },
  tarjetaTitulo: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, textAlign: 'center', paddingHorizontal: 6 },
});
