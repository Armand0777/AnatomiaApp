import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { unidadesService } from '../../services/unidadesService';
import { Multimedia } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedImage = Animated.createAnimatedComponent(Image);

// ── Componente individual para cada imagen con zoom ──
function ZoomableImage({ uri }: { uri: string }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPinchEvent = (event: any) => {
    scale.value = savedScale.value * event.nativeEvent.scale;
  };

  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // Si el zoom queda menor a 1, volver a 1
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      } else if (scale.value > 4) {
        // Limitar zoom máximo a 4x
        scale.value = withSpring(4);
        savedScale.value = 4;
      } else {
        savedScale.value = scale.value;
      }
    }
  };

  const handleDoubleTap = () => {
    if (savedScale.value > 1) {
      scale.value = withSpring(1);
      savedScale.value = 1;
    } else {
      scale.value = withSpring(2.5);
      savedScale.value = 2.5;
    }
  };

  return (
    <PinchGestureHandler
      onGestureEvent={onPinchEvent}
      onHandlerStateChange={onPinchStateChange}
    >
      <Animated.View style={styles.imageSlide}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleDoubleTap}
          style={styles.doubleTapArea}
        >
          <AnimatedImage
            source={{ uri }}
            style={[styles.fullImage, animatedStyle]}
            contentFit="contain"
            transition={300}
          />
        </TouchableOpacity>
      </Animated.View>
    </PinchGestureHandler>
  );
}

// ── Pantalla principal ──
export default function ImagenAmpliadaScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { temaId, temaTitulo } = route.params || {};

  const [imagenes, setImagenes] = useState<Multimedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const cargarImagenes = async () => {
      if (!temaId) {
        setLoading(false);
        return;
      }
      try {
        const multimedia = await unidadesService.getMultimedia(temaId);
        const soloImagenes = multimedia.filter((m) => m.tipo === 'imagen' && m.url);
        setImagenes(soloImagenes);
      } catch (error) {
        console.error('Error cargando imágenes:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarImagenes();
  }, [temaId]);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  }, []);

  // ── Loading ──
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 100 }} />
      </View>
    );
  }

  // ── Sin imágenes ──
  if (imagenes.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Icon name="close" size={30} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.emptyContainer}>
          <Icon name="image-off-outline" size={80} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyTitle}>Sin imágenes</Text>
          <Text style={styles.emptySubtitle}>
            El docente aún no ha subido imágenes para este tema.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header transparente */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {temaTitulo || 'Galería'}
          </Text>
          <Text style={styles.headerCounter}>
            {currentIndex + 1} / {imagenes.length}
          </Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      {/* Carrusel de imágenes */}
      <FlatList
        data={imagenes}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ZoomableImage uri={item.url} />}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Footer con título de la imagen actual y puntos indicadores */}
      <View style={styles.footer}>
        <Text style={styles.imageTitle}>
          {imagenes[currentIndex]?.titulo || `Imagen ${currentIndex + 1}`}
        </Text>

        {/* Puntos indicadores (dots) */}
        {imagenes.length > 1 && (
          <View style={styles.dotsContainer}>
            {imagenes.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        )}

        {/* Instrucción de zoom */}
        <Text style={styles.zoomHint}>
          <Icon name="gesture-pinch" size={14} color="rgba(255,255,255,0.5)" />
          {'  '}Pellizca para hacer zoom · Toca para zoom rápido
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  // ── Header ──
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerCounter: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },

  // ── Close button (for empty state) ──
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },

  // ── Image slide ──
  imageSlide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doubleTapArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
  },
  imageTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FFF',
    width: 24,
    borderRadius: 4,
  },
  zoomHint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
  },

  // ── Empty state ──
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
});
