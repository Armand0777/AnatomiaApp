import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { videosService } from '../../services/videosService';
import { VideoBiblioteca, CategoriaAnatomica } from '../../types';

interface CategoriaParams {
  categoria: CategoriaAnatomica;
  titulo: string;
}

// Lista de temas de una categoría. Los que no tienen youtube_id (todavía)
// se muestran igual, pero deshabilitados con la nota "Sin video disponible".
export default function VideosCategoriaScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { categoria, titulo } = (route.params ?? {}) as CategoriaParams;

  const [videos, setVideos] = useState<VideoBiblioteca[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      const data = await videosService.getVideosPorCategoria(categoria);
      setVideos(data);
      setCargando(false);
    };
    cargar();
  }, [categoria]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{titulo}</Text>
        <View style={{ width: 26 }} />
      </View>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => {
            const tieneVideo = !!item.youtube_id;
            const tieneDescarga = !!(item.imagen_descarga_url || item.pdf_resumen_url);
            const navegable = tieneVideo || tieneDescarga;
            return (
              <TouchableOpacity
                style={[styles.fila, !navegable && styles.filaDeshabilitada]}
                activeOpacity={navegable ? 0.85 : 1}
                onPress={() => navegable && navigation.navigate('VideoPlayer', { video: item })}
              >
                <View style={[styles.iconWrap, tieneVideo ? null : tieneDescarga ? styles.iconWrapDescarga : styles.iconWrapApagado]}>
                  <Icon
                    name={tieneVideo ? 'play' : tieneDescarga ? 'download-outline' : 'video-off-outline'}
                    size={18}
                    color="#FFF"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.filaTitulo} numberOfLines={2}>{item.tema}</Text>
                  {!tieneVideo && (
                    <Text style={styles.sinVideoTexto}>
                      {tieneDescarga ? 'Esquema y PDF disponibles' : 'Sin contenido disponible'}
                    </Text>
                  )}
                </View>
                {navegable && <Icon name="chevron-right" size={22} color={COLORS.primary} />}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.vacioContainer}>
              <Icon name="movie-open-outline" size={56} color="#CCC" />
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
  headerTitle: { color: COLORS.headerText, fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'center' },

  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  lista: { padding: 20, paddingTop: 12 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  filaDeshabilitada: { opacity: 0.5 },
  iconWrapApagado: { backgroundColor: '#BBB' },
  iconWrapDescarga: { backgroundColor: '#2196F3' },
  filaTitulo: { flex: 1, fontSize: 14.5, fontWeight: '600', color: COLORS.textPrimary },
  sinVideoTexto: { fontSize: 11, color: '#999', fontStyle: 'italic', marginLeft: 8 },

  vacioContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  vacioTexto: { color: '#888', marginTop: 12, textAlign: 'center' },
});
