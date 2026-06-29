import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { esquemasService } from '../../services/esquemasService';
import { IMAGENES_ESQUEMAS } from '../../data/imagenesEsquemas';
import { EsquemaInteractivo, EtiquetaEsquema } from '../../types';
import { CategoriaEsquema } from '../../data/esquemasData';

const ESCALA_MIN = 1;
const ESCALA_MAX = 4;
const PASO_ZOOM = 1.3;

interface VisorParams {
  categoria: CategoriaEsquema;
  temaKey: string;
  temaTitulo: string;
}

// Punto de una etiqueta sobre el lienzo. Tiene su propio gesto de Tap para
// que el toque siga abriendo la descripción aunque esté dentro del lienzo
// con zoom/pan: un toque corto (sin desplazamiento) lo gana el Tap, no el Pan.
function PuntoEtiqueta({
  etiqueta,
  activa,
  onTocar,
}: {
  etiqueta: EtiquetaEsquema;
  activa: boolean;
  onTocar: (etiqueta: EtiquetaEsquema) => void;
}) {
  const gestoTap = Gesture.Tap().onEnd(() => {
    runOnJS(onTocar)(etiqueta);
  });

  return (
    <GestureDetector gesture={gestoTap}>
      <Animated.View
        style={[
          styles.punto,
          { left: `${etiqueta.pos_x}%`, top: `${etiqueta.pos_y}%` },
          activa && styles.puntoActivo,
        ]}
      >
        {etiqueta.icono ? (
          <Icon name={etiqueta.icono as any} size={11} color="#FFF" />
        ) : (
          <Text style={styles.puntoTexto}>{etiqueta.orden}</Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

// Botón redondo flotante de la barra de herramientas
function BotonHerramienta({
  icono,
  etiqueta,
  apagado,
  onPress,
}: {
  icono: string;
  etiqueta: string;
  apagado?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.botonHerramienta} onPress={onPress}>
      <Icon name={icono as any} size={20} color={apagado ? '#9E9E9E' : COLORS.primary} />
      <Text style={[styles.botonHerramientaTexto, apagado && { color: '#9E9E9E' }]}>{etiqueta}</Text>
    </TouchableOpacity>
  );
}

// Parte C: barra de herramientas (restablecer, zoom +/-, ocultar etiquetas,
// información) sobre el lienzo con datos (Parte A) y zoom/mover (Parte B).
export default function EsquemaVisorScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { temaKey, temaTitulo } = (route.params ?? {}) as VisorParams;

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [esquema, setEsquema] = useState<EsquemaInteractivo | null>(null);
  const [etiquetas, setEtiquetas] = useState<EtiquetaEsquema[]>([]);
  const [etiquetaActiva, setEtiquetaActiva] = useState<EtiquetaEsquema | null>(null);
  const [mostrarEtiquetas, setMostrarEtiquetas] = useState(true);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  // Escala y desplazamiento actuales, y su último valor "confirmado" al
  // soltar el gesto (de ahí parte el siguiente pellizco/arrastre).
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const gestoPinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      // Acota el zoom entre 1x (tamaño normal) y 4x
      if (scale.value < ESCALA_MIN) {
        scale.value = withTiming(ESCALA_MIN);
        savedScale.value = ESCALA_MIN;
      } else if (scale.value > ESCALA_MAX) {
        scale.value = withTiming(ESCALA_MAX);
        savedScale.value = ESCALA_MAX;
      } else {
        savedScale.value = scale.value;
      }
    });

  const gestoPan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Permite pellizcar y arrastrar al mismo tiempo
  const gestoLienzo = Gesture.Simultaneous(gestoPinch, gestoPan);

  const estiloLienzoAnimado = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Vuelve la vista al estado inicial (sin zoom ni desplazamiento)
  const restablecer = () => {
    scale.value = withTiming(ESCALA_MIN);
    savedScale.value = ESCALA_MIN;
    translateX.value = withTiming(0);
    savedTranslateX.value = 0;
    translateY.value = withTiming(0);
    savedTranslateY.value = 0;
  };

  const acercar = () => {
    const nuevaEscala = Math.min(scale.value * PASO_ZOOM, ESCALA_MAX);
    scale.value = withTiming(nuevaEscala);
    savedScale.value = nuevaEscala;
  };

  const alejar = () => {
    const nuevaEscala = Math.max(scale.value / PASO_ZOOM, ESCALA_MIN);
    scale.value = withTiming(nuevaEscala);
    savedScale.value = nuevaEscala;
    // Al volver al tamaño normal, también recentra la imagen
    if (nuevaEscala === ESCALA_MIN) {
      translateX.value = withTiming(0);
      savedTranslateX.value = 0;
      translateY.value = withTiming(0);
      savedTranslateY.value = 0;
    }
  };

  const alternarEtiquetas = () => setMostrarEtiquetas((valor) => !valor);

  const cargarDatos = async () => {
    setCargando(true);
    setError(false);
    const resultado = await esquemasService.getEsquemaPorTema(temaKey);
    if (!resultado) {
      setError(true);
    } else {
      setEsquema(resultado.esquema);
      setEtiquetas(resultado.etiquetas);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, [temaKey]);

  // Las 10 láminas originales están empaquetadas en assets/ (funcionan
  // offline); las láminas nuevas que suba el docente se leen de su URL en
  // Supabase Storage.
  const fuenteImagen = IMAGENES_ESQUEMAS[temaKey] ?? (esquema?.imagen_url ? { uri: esquema.imagen_url } : null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{temaTitulo}</Text>
        <View style={{ width: 26 }} />
      </View>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.centro}>
          <Icon name="puzzle-outline" size={56} color={COLORS.border} />
          <Text style={styles.proximamenteTitulo}>Próximamente</Text>
          <Text style={styles.proximamenteTexto}>
            Este esquema todavía no está disponible. El docente lo agregará pronto.
          </Text>
        </View>
      ) : (
        <>
          {/* Lienzo del esquema: recorta lo que se desborda al hacer zoom */}
          <View style={styles.lienzo}>
            {fuenteImagen ? (
              <>
                <GestureDetector gesture={gestoLienzo}>
                  <Animated.View style={[styles.imagenWrap, estiloLienzoAnimado]}>
                    <Image source={fuenteImagen} style={styles.imagen} resizeMode="contain" />
                    {mostrarEtiquetas &&
                      etiquetas.map((etiqueta) => (
                        <PuntoEtiqueta
                          key={etiqueta.id}
                          etiqueta={etiqueta}
                          activa={etiquetaActiva?.id === etiqueta.id}
                          onTocar={setEtiquetaActiva}
                        />
                      ))}
                  </Animated.View>
                </GestureDetector>

                {/* Barra de herramientas flotante */}
                <View style={styles.barraHerramientas}>
                  <BotonHerramienta icono="restore" etiqueta="Restablecer" onPress={restablecer} />
                  <BotonHerramienta icono="magnify-plus-outline" etiqueta="Zoom +" onPress={acercar} />
                  <BotonHerramienta icono="magnify-minus-outline" etiqueta="Zoom −" onPress={alejar} />
                  <BotonHerramienta
                    icono={mostrarEtiquetas ? 'tag-outline' : 'tag-off-outline'}
                    etiqueta="Etiquetas"
                    apagado={!mostrarEtiquetas}
                    onPress={alternarEtiquetas}
                  />
                  <BotonHerramienta icono="information-outline" etiqueta="Info" onPress={() => setMostrarInfo(true)} />
                </View>
              </>
            ) : (
              <View style={styles.sinImagen}>
                <Icon name="image-off-outline" size={48} color="#666" />
                <Text style={styles.sinImagenTexto}>{esquema?.titulo || temaTitulo}</Text>
                <Text style={styles.sinImagenSubtexto}>Imagen no disponible todavía</Text>
              </View>
            )}
          </View>

          {mostrarEtiquetas && (
            <Text style={styles.pie}>
              Pellizca para hacer zoom, arrastra para mover, y toca una etiqueta para ver su descripción
            </Text>
          )}
        </>
      )}

      {/* Cartel inferior con la descripción de la etiqueta tocada */}
      <Modal visible={!!etiquetaActiva} transparent animationType="fade" onRequestClose={() => setEtiquetaActiva(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setEtiquetaActiva(null)}>
          <View style={styles.cartel}>
            <View style={styles.cartelHeader}>
              {etiquetaActiva?.icono && <Icon name={etiquetaActiva.icono as any} size={20} color={COLORS.primary} />}
              <Text style={styles.cartelNombre}>{etiquetaActiva?.nombre}</Text>
              <TouchableOpacity onPress={() => setEtiquetaActiva(null)}>
                <Icon name="close" size={22} color="#999" />
              </TouchableOpacity>
            </View>
            <Text style={styles.cartelDescripcion}>{etiquetaActiva?.descripcion}</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Cartel de información sobre cómo usar el visor */}
      <Modal visible={mostrarInfo} transparent animationType="fade" onRequestClose={() => setMostrarInfo(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMostrarInfo(false)}>
          <View style={styles.cartel}>
            <View style={styles.cartelHeader}>
              <Icon name="information-outline" size={20} color={COLORS.primary} />
              <Text style={styles.cartelNombre}>Cómo usar el visor</Text>
              <TouchableOpacity onPress={() => setMostrarInfo(false)}>
                <Icon name="close" size={22} color="#999" />
              </TouchableOpacity>
            </View>
            <Text style={styles.cartelDescripcion}>
              Toca una etiqueta para ver su descripción. Pellizca para acercar o alejar y arrastra para mover la imagen.
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
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

  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  proximamenteTitulo: { fontSize: 17, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 14, marginBottom: 6 },
  proximamenteTexto: { color: '#888', fontSize: 13, textAlign: 'center', lineHeight: 19 },

  // overflow: 'hidden' evita que la imagen se desborde de su área al hacer zoom
  lienzo: { flex: 1, backgroundColor: '#1A1A1A', justifyContent: 'center', overflow: 'hidden' },
  imagenWrap: { width: '100%', aspectRatio: 1, position: 'relative' },
  imagen: { width: '100%', height: '100%' },

  punto: {
    position: 'absolute',
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  puntoActivo: { backgroundColor: COLORS.secondary },
  puntoTexto: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  barraHerramientas: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: [{ translateY: -130 }],
    zIndex: 10,
    gap: 10,
  },
  botonHerramienta: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  botonHerramientaTexto: { fontSize: 8, color: COLORS.primary, fontWeight: '600', marginTop: 1, textAlign: 'center' },

  sinImagen: { alignItems: 'center', padding: 30 },
  sinImagenTexto: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 12, textAlign: 'center' },
  sinImagenSubtexto: { color: '#888', fontSize: 13, marginTop: 4 },

  pie: { textAlign: 'center', color: '#999', fontSize: 12, paddingVertical: 12, paddingHorizontal: 20, backgroundColor: COLORS.background },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  cartel: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 36 },
  cartelHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  cartelNombre: { flex: 1, fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  cartelDescripcion: { fontSize: 14, color: '#444', lineHeight: 20 },
});
