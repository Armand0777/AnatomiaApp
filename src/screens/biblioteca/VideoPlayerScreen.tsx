import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { VideoBiblioteca } from '../../types';

const { width } = Dimensions.get('window');

type Pestana = 'descripcion' | 'descarga';

interface PlayerParams {
  video: VideoBiblioteca;
}

// Descarga una imagen y la guarda directamente en la galería del dispositivo.
async function guardarImagenEnGaleria(url: string, nombreArchivo: string) {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para guardar la imagen.');
      return;
    }
    const destino = `${FileSystem.cacheDirectory}${nombreArchivo}`;
    const { uri } = await FileSystem.downloadAsync(url, destino);
    await MediaLibrary.saveToLibraryAsync(uri);
    Alert.alert('✓ Guardado', 'La imagen se guardó en tu galería.');
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    Alert.alert('Error', 'No se pudo descargar la imagen. Verifica tu conexión.');
  }
}

// Abre el PDF en el navegador del dispositivo, que lo descarga automáticamente.
async function abrirPdfEnNavegador(url: string) {
  try {
    const soportado = await Linking.canOpenURL(url);
    if (soportado) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'No se pudo abrir el PDF.');
    }
  } catch (error) {
    console.error('Error al abrir el PDF:', error);
    Alert.alert('Error', 'No se pudo abrir el PDF. Verifica tu conexión.');
  }
}

export default function VideoPlayerScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { video } = (route.params ?? {}) as PlayerParams;

  const [playing, setPlaying] = useState(true);
  const [favorito, setFavorito] = useState(false);
  const [pestana, setPestana] = useState<Pestana>('descripcion');
  const [descargando, setDescargando] = useState<'mp4' | 'jpg' | 'pdf' | null>(null);

  const onStateChange = (estado: string) => {
    if (estado === 'ended') setPlaying(false);
  };

  const verEnYoutube = () => {
    if (video.youtube_id) Linking.openURL(`https://www.youtube.com/watch?v=${video.youtube_id}`);
  };

  const descargarVideo = async () => {
    if (video.video_mp4_url) {
      setDescargando('mp4');
      await descargarYCompartir(video.video_mp4_url, `${video.tema}.mp4`);
      setDescargando(null);
    } else {
      verEnYoutube();
    }
  };

  const descargarImagen = async () => {
    if (!video.imagen_descarga_url) return;
    setDescargando('jpg');
    await guardarImagenEnGaleria(video.imagen_descarga_url, `${video.tema}.png`);
    setDescargando(null);
  };

  const descargarPdf = async () => {
    if (!video.pdf_resumen_url) return;
    setDescargando('pdf');
    await abrirPdfEnNavegador(video.pdf_resumen_url);
    setDescargando(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{video.tema}</Text>
        <TouchableOpacity onPress={() => setFavorito((v) => !v)} style={styles.headerBtn}>
          <Icon name={favorito ? 'heart' : 'heart-outline'} size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Reproductor */}
      <View style={styles.playerWrap}>
        {video.youtube_id ? (
          <YoutubePlayer height={220} width={width} play={playing} videoId={video.youtube_id} onChangeState={onStateChange} />
        ) : (
          <View style={styles.sinVideo}>
            <Icon name="video-off-outline" size={40} color="#888" />
            <Text style={styles.sinVideoTexto}>Sin video disponible</Text>
          </View>
        )}
      </View>

      {/* Pestañas */}
      <View style={styles.tabsRow}>
        {(
          [
            { key: 'descripcion', label: 'Descripción' },
            { key: 'descarga', label: 'Descarga' },
          ] as { key: Pestana; label: string }[]
        ).map((tab) => {
          const activa = pestana === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={[styles.tab, activa && styles.tabActiva]} onPress={() => setPestana(tab.key)}>
              <Text style={[styles.tabTexto, activa && styles.tabTextoActiva]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.contenido}>
        {pestana === 'descripcion' && (
          <Text style={styles.parrafo}>
            En este video aprenderás sobre {video.tema.toLowerCase()}, su ubicación y características principales
            dentro de la anatomía de cabeza y cuello.
          </Text>
        )}

        {pestana === 'descarga' && (
          <View>
            <TouchableOpacity style={styles.descargaFila} onPress={descargarVideo} disabled={descargando !== null}>
              <Icon name="movie-outline" size={22} color={COLORS.primary} />
              <Text style={styles.descargaTexto}>Descargar video explicativo</Text>
              {descargando === 'mp4' ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Icon name="download" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.descargaFila, !video.imagen_descarga_url && styles.descargaFilaDeshabilitada]}
              onPress={descargarImagen}
              disabled={!video.imagen_descarga_url || descargando !== null}
            >
              <Icon name="image-outline" size={22} color={video.imagen_descarga_url ? COLORS.primary : '#AAA'} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.descargaTexto, !video.imagen_descarga_url && styles.descargaTextoDeshabilitado]}>
                  Descargar esquema anatómico integral
                </Text>
                {!video.imagen_descarga_url && <Text style={styles.proximamenteTexto}>Disponible próximamente</Text>}
              </View>
              {descargando === 'jpg' ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Icon name="download" size={20} color={video.imagen_descarga_url ? COLORS.primary : '#AAA'} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.descargaFila, !video.pdf_resumen_url && styles.descargaFilaDeshabilitada]}
              onPress={descargarPdf}
              disabled={!video.pdf_resumen_url || descargando !== null}
            >
              <Icon name="file-pdf-box" size={22} color={video.pdf_resumen_url ? COLORS.primary : '#AAA'} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.descargaTexto, !video.pdf_resumen_url && styles.descargaTextoDeshabilitado]}>
                  Descargar resumen educativo (PDF)
                </Text>
                {!video.pdf_resumen_url && <Text style={styles.proximamenteTexto}>Disponible próximamente</Text>}
              </View>
              {descargando === 'pdf' ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Icon name="download" size={20} color={video.pdf_resumen_url ? COLORS.primary : '#AAA'} />
              )}
            </TouchableOpacity>
          </View>
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

  playerWrap: { width: '100%', height: 220, backgroundColor: '#000', justifyContent: 'center' },
  sinVideo: { alignItems: 'center' },
  sinVideoTexto: { color: '#888', marginTop: 8, fontSize: 13 },

  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActiva: { borderBottomColor: COLORS.primary },
  tabTexto: { fontSize: 13.5, color: '#888', fontWeight: '600' },
  tabTextoActiva: { color: COLORS.primary },

  contenido: { padding: 20, paddingBottom: 40 },
  parrafo: { fontSize: 15, color: COLORS.textPrimary, lineHeight: 22 },

  descargaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  descargaFilaDeshabilitada: { opacity: 0.7 },
  descargaTexto: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  descargaTextoDeshabilitado: { color: '#999' },
  proximamenteTexto: { fontSize: 11, color: '#AAA', marginTop: 2, fontStyle: 'italic' },
});
