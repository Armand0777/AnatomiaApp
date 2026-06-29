import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { SECCIONES_ACERCA } from '../../data/acercaData';

interface DetalleParams {
  seccionKey: string;
}

// Pantalla reutilizable: muestra el contenido de UNA sección de "Acerca de",
// según su 'tipo' (parrafo, datos o referencias).
export default function AcercaDetalleScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { seccionKey } = (route.params ?? {}) as DetalleParams;

  const seccion = SECCIONES_ACERCA.find((s) => s.key === seccionKey);

  if (!seccion) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Icon name="chevron-left" size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Acerca de</Text>
          <View style={{ width: 26 }} />
        </View>
        <Text style={styles.noEncontrado}>Sección no encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Acerca de</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.iconoGrande}>{seccion.icono}</Text>
        <Text style={styles.titulo}>{seccion.titulo}</Text>

        {seccion.tipo === 'parrafo' && (
          <View style={styles.card}>
            <Text style={styles.parrafo}>{seccion.contenido}</Text>
          </View>
        )}

        {seccion.tipo === 'datos' && (
          <View style={styles.card}>
            {seccion.contenido.map((dato, idx) => (
              <View
                key={dato.etiqueta}
                style={[styles.datoFila, idx === seccion.contenido.length - 1 && { borderBottomWidth: 0 }]}
              >
                <Text style={styles.datoEtiqueta}>{dato.etiqueta}</Text>
                <Text style={styles.datoValor}>{dato.valor}</Text>
              </View>
            ))}
          </View>
        )}

        {seccion.tipo === 'referencias' && (
          <View style={styles.card}>
            {seccion.contenido.map((referencia, idx) => (
              <View
                key={idx}
                style={[styles.referenciaFila, idx === seccion.contenido.length - 1 && { borderBottomWidth: 0 }]}
              >
                <Text style={styles.vineta}>•</Text>
                <Text style={styles.referenciaTexto}>{referencia}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
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
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  content: { padding: 20, alignItems: 'center' },
  iconoGrande: { fontSize: 44, marginBottom: 10 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 18 },

  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
  },
  parrafo: { fontSize: 15, color: COLORS.textPrimary, lineHeight: 23, padding: 18 },

  datoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  datoEtiqueta: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginRight: 10 },
  datoValor: { fontSize: 14, color: COLORS.textPrimary, flexShrink: 1, textAlign: 'right' },

  referenciaFila: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  vineta: { fontSize: 15, color: COLORS.primary, fontWeight: 'bold', marginRight: 10 },
  referenciaTexto: { flex: 1, fontSize: 14, color: COLORS.textPrimary, lineHeight: 20 },

  noEncontrado: { textAlign: 'center', marginTop: 40, color: '#888' },
});
