import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { CategoriaEsquema } from '../../data/esquemasData';

interface Categoria {
  categoria: CategoriaEsquema;
  titulo: string;
  descripcion: string;
  icon: string;
}

const CATEGORIAS: Categoria[] = [
  { categoria: 'osteologia', titulo: 'Osteología', descripcion: 'Esquemas de huesos y estructuras óseas.', icon: 'bone' },
  { categoria: 'miologia', titulo: 'Miología', descripcion: 'Esquemas de músculos y su función.', icon: 'arm-flex' },
];

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

        {CATEGORIAS.map((cat) => (
          <TouchableOpacity
            key={cat.categoria}
            style={styles.tarjeta}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('EsquemasLista', { categoria: cat.categoria, titulo: cat.titulo })}
          >
            <View style={styles.tarjetaIconWrap}>
              <Icon name={cat.icon as any} size={26} color="#FFF" />
            </View>
            <View style={styles.tarjetaInfo}>
              <Text style={styles.tarjetaTitulo}>{cat.titulo}</Text>
              <Text style={styles.tarjetaDescripcion}>{cat.descripcion}</Text>
            </View>
            <Icon name="chevron-right" size={22} color={COLORS.primary} />
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

  content: { padding: 20 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 16, fontWeight: '600' },

  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  tarjetaIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tarjetaInfo: { flex: 1 },
  tarjetaTitulo: { fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
  tarjetaDescripcion: { fontSize: 12.5, color: '#666', lineHeight: 17 },
});
