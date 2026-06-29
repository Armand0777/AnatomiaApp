import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TextInput, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';
import { getUnidadVisual } from '../../constants/unidadesVisual';
import { unidadesService, MultimediaConTema } from '../../services/unidadesService';

const ACCENT = MODULOS.biblioteca.color;
const { width: ANCHO_PANTALLA } = Dimensions.get('window');
const ANCHO_TARJETA = (ANCHO_PANTALLA - 20 * 2 - 12) / 2;

type FiltroTipo = 'todas' | 'imagen' | 'video';

function obtenerIdYoutube(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function obtenerThumbnail(item: MultimediaConTema): string | null {
  if (item.tipo === 'imagen') return item.url || null;
  const idYoutube = obtenerIdYoutube(item.url);
  return idYoutube ? `https://img.youtube.com/vi/${idYoutube}/hqdefault.jpg` : null;
}

// Catálogo de fotos/videos reales subidos por los docentes para cada tema
export default function GaleriaMultimediaScreen() {
  const navigation = useNavigation<any>();

  const [items, setItems] = useState<MultimediaConTema[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todas');
  const [filtroUnidad, setFiltroUnidad] = useState<number | null>(null);

  useEffect(() => {
    const cargar = async () => {
      const data = await unidadesService.getBibliotecaMultimedia();
      setItems(data);
      setCargando(false);
    };
    cargar();
  }, []);

  const itemsFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return items.filter((item) => {
      if (filtroTipo !== 'todas' && item.tipo !== filtroTipo) return false;
      if (filtroUnidad !== null && item.temas?.unidades?.numero !== filtroUnidad) return false;
      if (texto) {
        const enTitulo = item.titulo?.toLowerCase().includes(texto);
        const enDescripcion = item.descripcion?.toLowerCase().includes(texto);
        const enTema = item.temas?.titulo?.toLowerCase().includes(texto);
        if (!enTitulo && !enDescripcion && !enTema) return false;
      }
      return true;
    });
  }, [items, busqueda, filtroTipo, filtroUnidad]);

  const abrirItem = (item: MultimediaConTema) => {
    if (!item.tema_id) return;
    if (item.tipo === 'imagen') {
      navigation.navigate('ImagenAmpliada', { temaId: item.tema_id, temaTitulo: item.temas?.titulo });
    } else {
      navigation.navigate('Video', { temaId: item.tema_id });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name="image-multiple-outline" size={18} color="#FFF" />
          <Text style={styles.headerTitle}>Galería multimedia</Text>
        </View>
        <View style={{ width: 26 }} />
      </View>

      {/* Buscador */}
      <View style={styles.buscadorContainer}>
        <Icon name="magnify" size={20} color="#999" />
        <TextInput
          style={styles.buscadorInput}
          placeholder="Buscar imágenes o videos..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Icon name="close-circle" size={18} color="#CCC" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtro por tipo */}
      <View style={styles.tipoRow}>
        {([
          { valor: 'todas', label: 'Todas', icon: 'view-grid-outline' },
          { valor: 'imagen', label: 'Imágenes', icon: 'image-multiple-outline' },
          { valor: 'video', label: 'Videos', icon: 'play-circle-outline' },
        ] as { valor: FiltroTipo; label: string; icon: string }[]).map((t) => {
          const activo = filtroTipo === t.valor;
          return (
            <TouchableOpacity
              key={t.valor}
              style={[styles.tipoChip, activo && styles.tipoChipActivo]}
              onPress={() => setFiltroTipo(t.valor)}
            >
              <Icon name={t.icon as any} size={15} color={activo ? '#FFF' : ACCENT} />
              <Text style={[styles.tipoChipText, activo && styles.tipoChipTextActivo]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Filtro por unidad */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.unidadScroll}
        contentContainerStyle={styles.unidadRow}
      >
        <TouchableOpacity
          style={[styles.unidadChip, filtroUnidad === null && styles.unidadChipActivo]}
          onPress={() => setFiltroUnidad(null)}
        >
          <Icon name="view-grid-outline" size={16} color={filtroUnidad === null ? '#FFF' : '#666'} />
          <Text style={[styles.unidadChipText, { color: filtroUnidad === null ? '#FFF' : '#666' }]}>Todas</Text>
        </TouchableOpacity>
        {[1, 2, 3, 4].map((numero) => {
          const visual = getUnidadVisual(numero);
          const activo = filtroUnidad === numero;
          return (
            <TouchableOpacity
              key={numero}
              style={[
                styles.unidadChip,
                { backgroundColor: activo ? visual.color : visual.color + '1F', borderColor: visual.color },
              ]}
              onPress={() => setFiltroUnidad(numero)}
            >
              <Icon name={visual.icon as any} size={16} color={activo ? '#FFF' : visual.color} />
              <Text style={[styles.unidadChipText, { color: activo ? '#FFF' : visual.color }]}>Unidad {numero}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {cargando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ACCENT} />
        </View>
      ) : (
        <FlatList
          data={itemsFiltrados}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => {
            const thumbnail = obtenerThumbnail(item);
            const visual = item.temas?.unidades ? getUnidadVisual(item.temas.unidades.numero) : null;
            return (
              <TouchableOpacity style={styles.card} onPress={() => abrirItem(item)} activeOpacity={0.85}>
                <View style={styles.thumbnailWrap}>
                  {thumbnail ? (
                    <Image source={{ uri: thumbnail }} style={styles.thumbnail} contentFit="cover" transition={200} />
                  ) : (
                    <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                      <Icon name="image-off-outline" size={28} color="#BBB" />
                    </View>
                  )}
                  <View style={styles.tipoBadge}>
                    <Icon name={item.tipo === 'video' ? 'play' : 'image'} size={12} color="#FFF" />
                  </View>
                </View>
                <Text style={styles.cardTitulo} numberOfLines={2}>{item.titulo || (item.tipo === 'video' ? 'Video' : 'Imagen')}</Text>
                {visual && item.temas && (
                  <View style={styles.cardSubtituloRow}>
                    <Icon name={visual.icon as any} size={11} color={visual.color} />
                    <Text style={styles.cardSubtitulo} numberOfLines={1}>
                      Unidad {item.temas.unidades?.numero} · {item.temas.titulo}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.vacioContainer}>
              <Icon name="folder-search-outline" size={56} color="#CCC" />
              <Text style={styles.vacioText}>No se encontró contenido con estos filtros.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: ACCENT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  headerBtn: { padding: 4 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginTop: 16,
    gap: 8,
    height: 42,
  },
  buscadorInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },

  tipoRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 14, gap: 8 },
  tipoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tipoChipActivo: { backgroundColor: ACCENT },
  tipoChipText: { fontSize: 12, color: ACCENT, fontWeight: '600' },
  tipoChipTextActivo: { color: '#FFF' },

  unidadScroll: { flexGrow: 0, flexShrink: 0, height: 60 },
  unidadRow: { paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center' },
  unidadChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#F2F2F2',
  },
  unidadChipActivo: { backgroundColor: '#333', borderColor: '#333' },
  unidadChipText: { fontSize: 13, fontWeight: '700' },

  grid: { paddingHorizontal: 20, paddingBottom: 30, gap: 14 },
  card: { width: ANCHO_TARJETA, marginBottom: 14 },
  thumbnailWrap: { position: 'relative' },
  thumbnail: { width: '100%', height: ANCHO_TARJETA * 0.75, borderRadius: 12, backgroundColor: '#EEE' },
  thumbnailPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  tipoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitulo: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginTop: 8 },
  cardSubtituloRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  cardSubtitulo: { fontSize: 11, color: '#888', flex: 1 },

  vacioContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 30 },
  vacioText: { color: '#888', marginTop: 12, textAlign: 'center' },
});
