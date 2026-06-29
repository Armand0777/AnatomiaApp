import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { unidadesService, MultimediaConTema } from '../../services/unidadesService';
import { extraerYoutubeId } from '../../utils/youtube';

const NUMEROS_ROMANOS = ['I', 'II', 'III', 'IV', 'V'];

// Los videos vienen de los que el docente ya sube por tema (Gestionar
// Contenido), no de una lista separada: solo se filtran los de tipo "video".
export default function VideosScreen() {
  const navigation = useNavigation<any>();

  const [videos, setVideos] = useState<MultimediaConTema[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroUnidad, setFiltroUnidad] = useState<number | null>(null);

  const cargarVideos = async () => {
    setCargando(true);
    const data = await unidadesService.getBibliotecaMultimedia();
    setVideos(data.filter((m) => m.tipo === 'video'));
    setCargando(false);
  };

  useEffect(() => {
    cargarVideos();
  }, []);

  const unidadesDisponibles = useMemo(() => {
    const numeros = new Set(videos.map((v) => v.temas?.unidades?.numero).filter((n): n is number => !!n));
    return Array.from(numeros).sort((a, b) => a - b);
  }, [videos]);

  const videosFiltrados = useMemo(() => {
    if (filtroUnidad === null) return videos;
    return videos.filter((v) => v.temas?.unidades?.numero === filtroUnidad);
  }, [videos, filtroUnidad]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Videos Explicativos</Text>
        <View style={{ width: 26 }} />
      </View>

      <Text style={styles.intro}>Explora videos educativos organizados por unidad.</Text>

      {/* Filtros por unidad */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsRow}>
        <TouchableOpacity
          style={[styles.chip, filtroUnidad === null && styles.chipActivo]}
          onPress={() => setFiltroUnidad(null)}
        >
          <Text style={[styles.chipTexto, filtroUnidad === null && styles.chipTextoActivo]}>Todos</Text>
        </TouchableOpacity>
        {unidadesDisponibles.map((numero) => {
          const activo = filtroUnidad === numero;
          return (
            <TouchableOpacity
              key={numero}
              style={[styles.chip, activo && styles.chipActivo]}
              onPress={() => setFiltroUnidad(numero)}
            >
              <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
                Unidad {NUMEROS_ROMANOS[numero - 1] || numero}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de videos */}
      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={videosFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tarjeta}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('VideoPlayer', { video: item })}
            >
              <View style={styles.miniaturaWrap}>
                <Image
                  source={{ uri: `https://img.youtube.com/vi/${extraerYoutubeId(item.url)}/hqdefault.jpg` }}
                  style={styles.miniatura}
                  contentFit="cover"
                />
                <View style={styles.playBadge}>
                  <Icon name="play" size={18} color="#FFF" />
                </View>
              </View>
              <View style={styles.tarjetaInfo}>
                <Text style={styles.tarjetaTitulo} numberOfLines={2}>{item.titulo || 'Video'}</Text>
                <View style={styles.tarjetaMetaRow}>
                  {item.temas?.unidades && (
                    <View style={styles.unidadBadge}>
                      <Text style={styles.unidadBadgeTexto}>
                        Unidad {NUMEROS_ROMANOS[item.temas.unidades.numero - 1] || item.temas.unidades.numero}
                      </Text>
                    </View>
                  )}
                  {item.temas && (
                    <Text style={styles.temaTexto} numberOfLines={1}>{item.temas.titulo}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.vacioContainer}>
              <Icon name="movie-open-outline" size={56} color="#CCC" />
              <Text style={styles.vacioTexto}>
                {filtroUnidad === null ? 'No hay videos todavía.' : 'No hay videos en esta unidad todavía.'}
              </Text>
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
  intro: { fontSize: 13, color: '#666', paddingHorizontal: 20, paddingTop: 14, lineHeight: 18 },

  chipsScroll: { flexGrow: 0, flexShrink: 0, height: 56 },
  chipsRow: { paddingHorizontal: 20, paddingVertical: 12, gap: 8, alignItems: 'center' },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    backgroundColor: '#FFF',
  },
  chipActivo: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipTexto: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  chipTextoActivo: { color: '#FFF' },

  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },

  lista: { padding: 20, paddingTop: 4 },
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  miniaturaWrap: { width: 120, height: 90, position: 'relative' },
  miniatura: { width: '100%', height: '100%', backgroundColor: '#DDD' },
  playBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarjetaInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  tarjetaTitulo: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary },
  tarjetaMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  unidadBadge: { backgroundColor: COLORS.primary + '1A', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  unidadBadgeTexto: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  temaTexto: { fontSize: 12, color: '#888', flexShrink: 1 },

  vacioContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  vacioTexto: { color: '#888', marginTop: 12, textAlign: 'center' },
});
