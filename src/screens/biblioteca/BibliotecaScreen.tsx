import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';

const ACCENT = MODULOS.biblioteca.color;

interface TarjetaModulo {
  icon: string;
  titulo: string;
  descripcion: string;
  ruta: string;
}

const MODULOS_BIBLIOTECA: TarjetaModulo[] = [
  {
    icon: 'movie-open-outline',
    titulo: 'Videos explicativos de anatomía',
    descripcion: 'Accede a videos educativos organizados por categorías anatómicas.',
    ruta: 'Videos',
  },
  {
    icon: 'puzzle-outline',
    titulo: 'Esquemas anatómicos interactivos',
    descripcion: 'Explora esquemas con etiquetas, zoom y exploración interactiva.',
    ruta: 'EsquemasCategorias',
  },
];

// Centro de navegación de la Biblioteca Multimedia: agrupa los 2 sub-módulos
export default function BibliotecaScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()} style={styles.headerBtn}>
          <Icon name="menu" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name={MODULOS.biblioteca.icon as any} size={18} color="#FFF" />
          <Text style={styles.headerTitle}>Biblioteca Multimedia</Text>
        </View>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.intro}>
          Explora recursos multimedia para fortalecer tu aprendizaje de anatomía.
        </Text>

        {MODULOS_BIBLIOTECA.map((modulo) => (
          <TouchableOpacity
            key={modulo.ruta}
            style={styles.tarjeta}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(modulo.ruta)}
          >
            <View style={styles.tarjetaIconWrap}>
              <Icon name={modulo.icon as any} size={26} color="#FFF" />
            </View>
            <View style={styles.tarjetaInfo}>
              <Text style={styles.tarjetaTitulo}>{modulo.titulo}</Text>
              <Text style={styles.tarjetaDescripcion}>{modulo.descripcion}</Text>
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
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { color: COLORS.headerText, fontSize: 16, fontWeight: 'bold' },

  content: { padding: 20 },
  intro: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 20 },

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
