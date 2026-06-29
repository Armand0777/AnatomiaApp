import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert, ScrollView, LayoutChangeEvent } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { esquemasService } from '../../services/esquemasService';
import { IMAGENES_ESQUEMAS } from '../../data/imagenesEsquemas';
import { EsquemaInteractivo, EtiquetaEsquema } from '../../types';
import ModalEtiqueta from './ModalEtiqueta';

interface EtiquetasParams {
  esquema: EsquemaInteractivo;
}

// Marcador arrastrable de una etiqueta sobre el lienzo. Calcula su posición
// en píxeles a partir del % guardado y del tamaño real del contenedor, y al
// soltar el dedo convierte la posición final de vuelta a porcentaje (0-100)
// para persistirla.
function MarcadorArrastrable({
  etiqueta,
  contenedorAncho,
  contenedorAlto,
  seleccionada,
  onSeleccionar,
  onSoltar,
}: {
  etiqueta: EtiquetaEsquema;
  contenedorAncho: number;
  contenedorAlto: number;
  seleccionada: boolean;
  onSeleccionar: (id: string) => void;
  onSoltar: (id: string, posX: number, posY: number) => void;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const basePosX = (etiqueta.pos_x / 100) * contenedorAncho;
  const basePosY = (etiqueta.pos_y / 100) * contenedorAlto;

  const finalizarArrastre = (dx: number, dy: number) => {
    const pixelX = basePosX + dx;
    const pixelY = basePosY + dy;
    const nuevoPosX = Math.min(Math.max((pixelX / contenedorAncho) * 100, 0), 100);
    const nuevoPosY = Math.min(Math.max((pixelY / contenedorAlto) * 100, 0), 100);
    onSoltar(etiqueta.id, nuevoPosX, nuevoPosY);
    translateX.value = 0;
    translateY.value = 0;
  };

  const gestoArrastre = Gesture.Pan()
    .onStart(() => {
      runOnJS(onSeleccionar)(etiqueta.id);
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      runOnJS(finalizarArrastre)(e.translationX, e.translationY);
    });

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gestoArrastre}>
      <Animated.View
        style={[
          styles.marcador,
          { left: basePosX, top: basePosY },
          seleccionada && styles.marcadorSeleccionado,
          estiloAnimado,
        ]}
      >
        {etiqueta.icono ? (
          <Text style={styles.marcadorEmoji}>{etiqueta.icono}</Text>
        ) : (
          <Text style={styles.marcadorTexto}>{etiqueta.orden}</Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

// Gestión de las etiquetas de una lámina: crear, editar, eliminar y mover
// arrastrando sobre la imagen (solo admin/docente).
export default function GestionEtiquetasScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { esquema } = (route.params ?? {}) as EtiquetasParams;

  const [etiquetas, setEtiquetas] = useState<EtiquetaEsquema[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [contenedor, setContenedor] = useState({ ancho: 0, alto: 0 });

  const [modalVisible, setModalVisible] = useState(false);
  const [etiquetaEditando, setEtiquetaEditando] = useState<EtiquetaEsquema | null>(null);

  const cargarEtiquetas = async () => {
    setCargando(true);
    const data = await esquemasService.getEtiquetasPorEsquema(esquema.id);
    setEtiquetas(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarEtiquetas();
  }, [esquema.id]);

  const fuenteImagen = IMAGENES_ESQUEMAS[esquema.tema_key] ?? (esquema.imagen_url ? { uri: esquema.imagen_url } : null);

  const medirContenedor = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContenedor({ ancho: width, alto: height });
  };

  // Actualiza en pantalla al instante y persiste en segundo plano
  const guardarPosicion = async (id: string, posX: number, posY: number) => {
    setEtiquetas((prev) => prev.map((et) => (et.id === id ? { ...et, pos_x: posX, pos_y: posY } : et)));
    await esquemasService.actualizarEtiqueta(id, { pos_x: posX, pos_y: posY });
  };

  const abrirModalNueva = () => {
    setEtiquetaEditando(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (etiqueta: EtiquetaEsquema) => {
    setEtiquetaEditando(etiqueta);
    setModalVisible(true);
  };

  const confirmarEliminar = (etiqueta: EtiquetaEsquema) => {
    Alert.alert('Eliminar etiqueta', `¿Seguro que deseas eliminar "${etiqueta.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const exito = await esquemasService.eliminarEtiqueta(etiqueta.id);
          if (exito) {
            if (seleccionadaId === etiqueta.id) setSeleccionadaId(null);
            cargarEtiquetas();
          } else {
            Alert.alert('Error', 'No se pudo eliminar la etiqueta.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{esquema.titulo}</Text>
        <View style={{ width: 26 }} />
      </View>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          {/* Zona A: lienzo con los marcadores arrastrables */}
          <View style={styles.lienzo} onLayout={medirContenedor}>
            {fuenteImagen ? (
              <Image source={fuenteImagen} style={styles.imagen} resizeMode="contain" />
            ) : (
              <View style={styles.sinImagen}>
                <Icon name="image-off-outline" size={40} color="#666" />
              </View>
            )}
            {contenedor.ancho > 0 &&
              etiquetas.map((etiqueta) => (
                <MarcadorArrastrable
                  key={etiqueta.id}
                  etiqueta={etiqueta}
                  contenedorAncho={contenedor.ancho}
                  contenedorAlto={contenedor.alto}
                  seleccionada={seleccionadaId === etiqueta.id}
                  onSeleccionar={setSeleccionadaId}
                  onSoltar={guardarPosicion}
                />
              ))}
          </View>
          <Text style={styles.pie}>Arrastra un marcador para reubicarlo. Suelta para guardar la posición.</Text>

          {/* Zona B: lista de etiquetas */}
          <ScrollView style={styles.lista} contentContainerStyle={styles.listaContenido}>
            <View style={styles.listaHeader}>
              <Text style={styles.listaTitulo}>Etiquetas ({etiquetas.length})</Text>
              <TouchableOpacity style={styles.agregarBtn} onPress={abrirModalNueva}>
                <Icon name="plus" size={16} color="#FFF" />
                <Text style={styles.agregarBtnTexto}>Agregar etiqueta</Text>
              </TouchableOpacity>
            </View>

            {etiquetas.length === 0 ? (
              <View style={styles.vacioContainer}>
                <Icon name="tag-off-outline" size={48} color="#CCC" />
                <Text style={styles.vacioTexto}>Esta lámina todavía no tiene etiquetas.</Text>
              </View>
            ) : (
              etiquetas.map((etiqueta) => {
                const activa = seleccionadaId === etiqueta.id;
                return (
                  <TouchableOpacity
                    key={etiqueta.id}
                    style={[styles.fila, activa && styles.filaActiva]}
                    onPress={() => setSeleccionadaId(etiqueta.id)}
                  >
                    <Text style={styles.filaEmoji}>{etiqueta.icono || '🏷️'}</Text>
                    <Text style={styles.filaNombre} numberOfLines={1}>{etiqueta.nombre}</Text>
                    <TouchableOpacity onPress={() => abrirModalEditar(etiqueta)} style={styles.accionBtn}>
                      <Icon name="pencil" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmarEliminar(etiqueta)} style={styles.accionBtn}>
                      <Icon name="delete" size={18} color={COLORS.incorrecto} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </>
      )}

      <ModalEtiqueta
        visible={modalVisible}
        esquemaId={esquema.id}
        etiquetaEditando={etiquetaEditando}
        siguienteOrden={etiquetas.length + 1}
        onCerrar={() => setModalVisible(false)}
        onGuardado={cargarEtiquetas}
      />
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

  lienzo: { height: '40%', backgroundColor: '#1A1A1A', position: 'relative' },
  imagen: { width: '100%', height: '100%' },
  sinImagen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pie: { textAlign: 'center', color: '#999', fontSize: 11, paddingVertical: 8, backgroundColor: COLORS.background },

  marcador: {
    position: 'absolute',
    width: 26,
    height: 26,
    marginLeft: -13,
    marginTop: -13,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marcadorSeleccionado: { backgroundColor: COLORS.secondary },
  marcadorEmoji: { fontSize: 13 },
  marcadorTexto: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },

  lista: { flex: 1 },
  listaContenido: { padding: 16, paddingBottom: 40 },
  listaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  listaTitulo: { fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary },
  agregarBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  agregarBtnTexto: { color: '#FFF', fontSize: 12.5, fontWeight: '600' },

  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  filaActiva: { borderColor: COLORS.secondary, borderWidth: 2 },
  filaEmoji: { fontSize: 18, marginRight: 10 },
  filaNombre: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  accionBtn: { marginLeft: 10 },

  vacioContainer: { alignItems: 'center', marginTop: 30 },
  vacioTexto: { color: '#888', marginTop: 10, textAlign: 'center' },
});
