import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { CATEGORIAS_ANATOMICAS } from '../../data/categoriasAnatomicas';

// Solo Osteología y Miología tienen imágenes/etiquetas listas.
// Órganos de los sentidos y Vías respiratorias están en la BD pero se
// ocultan aquí hasta que tengan imagen. Los videos sí muestran las 4.
const CATEGORIAS_ESQUEMAS = CATEGORIAS_ANATOMICAS.filter(
  (c) => c.categoria === 'osteologia' || c.categoria === 'miologia'
);

export default function EsquemasCategoriasScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Esquemas Interactivos</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitulo}>Categorías temáticas</Text>

        <View style={styles.grid}>
          {CATEGORIAS_ESQUEMAS.map((cat) => (
            <TouchableOpacity
              key={cat.categoria}
              style={styles.tarjeta}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('EsquemasLista', { categoria: cat.categoria, titulo: cat.titulo })}
            >
              <Text style={styles.tarjetaEmoji}>{cat.icono}</Text>
              <Text style={styles.tarjetaTitulo}>{cat.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
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

  content: { padding: 20 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 16, fontWeight: '600' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
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
