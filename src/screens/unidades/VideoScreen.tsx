import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import YoutubeIframe from 'react-native-youtube-iframe';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { unidadesService } from '../../services/unidadesService';
import { Multimedia } from '../../types';

const { width } = Dimensions.get('window');

// Helper para extraer ID de YouTube
function getYoutubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function VideoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { temaId } = route.params || {};
  
  const [videos, setVideos] = useState<Multimedia[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Multimedia | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (temaId) {
      unidadesService.getMultimedia(temaId).then(data => {
        const vids = data.filter(m => m.tipo === 'video');
        setVideos(vids);
        if (vids.length > 0) {
          setSelectedVideo(vids[0]);
        }
      });
    }
  }, [temaId]);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const selectedVideoId = selectedVideo?.url ? getYoutubeId(selectedVideo.url) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Educativo</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.videoContainer}>
        {selectedVideoId ? (
          <YoutubeIframe
            height={width * (9 / 16)}
            width={width}
            play={playing}
            videoId={selectedVideoId}
            onChangeState={onStateChange}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.emoji}>▶️</Text>
            <Text style={styles.placeholderText}>Selecciona un video o verifica el enlace</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Videos de este tema</Text>
        
        {videos.map((video, index) => {
          const yId = video.url ? getYoutubeId(video.url) : null;
          const isSelected = selectedVideo?.id === video.id;
          
          return (
            <TouchableOpacity 
              key={video.id || index} 
              style={[styles.videoItem, isSelected && styles.videoItemSelected]}
              onPress={() => {
                setSelectedVideo(video);
                setPlaying(true);
              }}
            >
              {yId ? (
                <Image 
                  source={{ uri: `https://img.youtube.com/vi/${yId}/hqdefault.jpg` }} 
                  style={styles.thumbnailImage} 
                />
              ) : (
                <View style={styles.thumbnailPlaceholder}>
                  <Icon name="play" size={24} color="#FFF" />
                </View>
              )}
              
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{video.titulo || 'Video sin título'}</Text>
                {isSelected && <Text style={styles.nowPlayingText}>Reproduciendo ahora</Text>}
              </View>
            </TouchableOpacity>
          );
        })}

        {videos.length === 0 && (
          <Text style={{color: '#666', marginTop: 10}}>No hay videos agregados a este tema.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.headerBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 10 },
  backBtn: { padding: 5 },
  headerTitle: { color: COLORS.headerText, fontSize: 18, fontWeight: 'bold' },
  videoContainer: { width: width, height: width * (9 / 16), backgroundColor: '#000' },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 50, marginBottom: 10 },
  placeholderText: { color: '#FFF', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
  contentContainer: { padding: 20, paddingBottom: 50 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B1B1B', marginBottom: 15 },
  videoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#FFF', padding: 10, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  videoItemSelected: { borderColor: COLORS.primary, borderWidth: 2 },
  thumbnailImage: { width: 120, height: 70, borderRadius: 8, marginRight: 15, backgroundColor: '#DDD' },
  thumbnailPlaceholder: { width: 120, height: 70, backgroundColor: COLORS.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  videoInfo: { flex: 1, justifyContent: 'center' },
  videoTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 },
  nowPlayingText: { fontSize: 12, color: COLORS.primary, fontWeight: 'bold' }
});
