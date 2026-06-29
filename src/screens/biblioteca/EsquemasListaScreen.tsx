import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { CategoriaEsquema } from '../../data/esquemasData';
import { esquemasService } from '../../services/esquemasService';
import { EsquemaInteractivo } from '../../types';

interface ListaParams {
  categoria: CategoriaEsquema;
  titulo: string;
}

const EMOJI_POR_CATEGORIA: Record<CategoriaEsquema, string> = {
  osteologia: '🦴',
  miologia: '💪',
};

// Lee las láminas reales desde Supabase (antes era una lista fija), así los
// cambios que haga el docente desde Gestión se reflejan aquí.
export default function EsquemasListaScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { categoria, titulo } = (route.params ?? {}) as ListaParams;

  const [esquemas, setEsquemas] = useState<EsquemaInteractivo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      const data = await esquemasService.getEsquemas();
      setEsquemas(data);
      setCargando(false);
    };
    cargar();
  }, []);

  const temas = useMemo(
    () => esquemas.filter((e) => e.categoria === categoria && e.activo).sort((a, b) => a.orden - b.orden),
    [esquemas, categoria]
  );
  const emoji = EMOJI_POR_CATEGORIA[categoria] ?? '🧩';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{titulo}</Text>
        <View style={{ width: 26 }} />
      </View>

      <Text style={styles.subtitulo}>Temas de la categoría</Text>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={temas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tarjeta}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('EsquemaVisor', {
                  categoria,
                  temaKey: item.tema_key,
                  temaTitulo: item.titulo,
                })
              }
            >
              <Text style={styles.emoji}>{emoji}</Text>
              <View style={styles.tarjetaInfo}>
                <Text style={styles.tarjetaTitulo}>{item.titulo}</Text>
                <Text style={styles.tarjetaSubtitulo}>Esquema interactivo</Text>
              </View>
              <Icon name="chevron-right" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.vacioContainer}>
              <Icon name="puzzle-outline" size={48} color="#CCC" />
              <Text style={styles.vacioTexto}>No hay temas en esta categoría todavía.</Text>
            </View>
          )}
        />
      )}
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
  subtitulo: { fontSize: 14, color: '#666', fontWeight: '600', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },

  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  lista: { padding: 20, paddingTop: 12 },
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
  emoji: { fontSize: 28, marginRight: 14 },
  tarjetaInfo: { flex: 1 },
  tarjetaTitulo: { fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 2 },
  tarjetaSubtitulo: { fontSize: 12.5, color: '#666' },

  vacioContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  vacioTexto: { color: '#888', marginTop: 12, textAlign: 'center' },
});
