import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import YoutubePlayer from 'react-native-youtube-iframe';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { unidadesService, MultimediaConTema } from '../../services/unidadesService';
import { extraerYoutubeId } from '../../utils/youtube';

const NUMEROS_ROMANOS = ['I', 'II', 'III', 'IV', 'V'];
const { width } = Dimensions.get('window');

interface PlayerParams {
  video: MultimediaConTema;
}

export default function VideoPlayerScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { video: videoInicial } = (route.params ?? {}) as PlayerParams;

  const [videoActual, setVideoActual] = useState<MultimediaConTema>(videoInicial);
  const [playing, setPlaying] = useState(true);
  const [otrosVideos, setOtrosVideos] = useState<MultimediaConTema[]>([]);
  const [cargando, setCargando] = useState(true);

  const unidadId = videoInicial.temas?.unidad_id;

  const cargarOtrosVideos = useCallback(async () => {
    setCargando(true);
    const todos = await unidadesService.getBibliotecaMultimedia();
    setOtrosVideos(
      todos.filter((m) => m.tipo === 'video' && m.temas?.unidad_id === unidadId && m.id !== videoInicial.id)
    );
    setCargando(false);
  }, [videoInicial.id, unidadId]);

  useEffect(() => {
    cargarOtrosVideos();
  }, [cargarOtrosVideos]);

  const onStateChange = useCallback((estado: string) => {
    if (estado === 'ended') setPlaying(false);
  }, []);

  const seleccionarOtroVideo = (video: MultimediaConTema) => {
    setVideoActual(video);
    setPlaying(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{videoActual.titulo || 'Video'}</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Reproductor */}
      <View style={styles.playerWrap}>
        <YoutubePlayer
          height={220}
          width={width}
          play={playing}
          videoId={extraerYoutubeId(videoActual.url)}
          onChangeState={onStateChange}
        />
      </View>

      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.titulo}>{videoActual.titulo || 'Video'}</Text>
        <View style={styles.metaRow}>
          {videoActual.temas?.unidades && (
            <View style={styles.unidadBadge}>
              <Text style={styles.unidadBadgeTexto}>
                Unidad {NUMEROS_ROMANOS[videoActual.temas.unidades.numero - 1] || videoActual.temas.unidades.numero}
              </Text>
            </View>
          )}
          {videoActual.temas && <Text style={styles.temaTexto}>{videoActual.temas.titulo}</Text>}
        </View>
        {videoActual.descripcion && <Text style={styles.descripcion}>{videoActual.descripcion}</Text>}

        <Text style={styles.seccionTitulo}>Más videos de esta unidad</Text>

        {cargando ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 10 }} />
        ) : otrosVideos.length === 0 ? (
          <Text style={styles.vacioTexto}>No hay más videos en esta unidad todavía.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {otrosVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={styles.otroVideoCard}
                activeOpacity={0.85}
                onPress={() => seleccionarOtroVideo(video)}
              >
                <View style={styles.otroMiniaturaWrap}>
                  <Image
                    source={{ uri: `https://img.youtube.com/vi/${extraerYoutubeId(video.url)}/hqdefault.jpg` }}
                    style={styles.otroMiniatura}
                    contentFit="cover"
                  />
                  <View style={styles.playBadge}>
                    <Icon name="play" size={14} color="#FFF" />
                  </View>
                </View>
                <Text style={styles.otroVideoTitulo} numberOfLines={2}>{video.titulo || 'Video'}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </ScrollView>
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
  headerTitle: { color: COLORS.headerText, fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'center' },

  playerWrap: { width: '100%', height: 220, backgroundColor: '#000' },

  contenido: { padding: 20, paddingBottom: 40 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  unidadBadge: { backgroundColor: COLORS.primary + '1A', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  unidadBadgeTexto: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  temaTexto: { fontSize: 12, color: '#888' },
  descripcion: { fontSize: 14, color: '#444', lineHeight: 20, marginBottom: 24 },

  seccionTitulo: { fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 12 },
  vacioTexto: { color: '#888', fontSize: 13 },

  otroVideoCard: { width: 160, marginRight: 14 },
  otroMiniaturaWrap: { width: '100%', height: 90, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  otroMiniatura: { width: '100%', height: '100%', backgroundColor: '#DDD' },
  playBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -14,
    marginLeft: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otroVideoTitulo: { fontSize: 12.5, color: COLORS.textPrimary, marginTop: 6, fontWeight: '600' },
});
