import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { esquemasService, NuevoEsquema } from '../../services/esquemasService';
import { generarSlug } from '../../utils/texto';
import { EsquemaInteractivo, CategoriaAnatomica } from '../../types';
import { IMAGENES_ESQUEMAS } from '../../data/imagenesEsquemas';
import { CATEGORIAS_ANATOMICAS } from '../../data/categoriasAnatomicas';

interface ModalEsquemaProps {
  visible: boolean;
  esquemaEditando: EsquemaInteractivo | null;
  esquemasExistentes: EsquemaInteractivo[];
  onCerrar: () => void;
  onGuardado: () => void;
}

// Modal de crear/editar una lámina anatómica. El modo se infiere de si
// llega o no un `esquemaEditando`.
export default function ModalEsquema({ visible, esquemaEditando, esquemasExistentes, onCerrar, onGuardado }: ModalEsquemaProps) {
  const editando = !!esquemaEditando;

  const [categoria, setCategoria] = useState<CategoriaAnatomica>('osteologia');
  const [titulo, setTitulo] = useState('');
  const [orden, setOrden] = useState('1');
  const [imagenUri, setImagenUri] = useState<string | null>(null);
  const [imagenUrlActual, setImagenUrlActual] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (esquemaEditando) {
      setCategoria(esquemaEditando.categoria);
      setTitulo(esquemaEditando.titulo);
      setOrden(String(esquemaEditando.orden));
      setImagenUri(null);
      setImagenUrlActual(esquemaEditando.imagen_url);
    } else {
      setCategoria('osteologia');
      setTitulo('');
      setOrden('1');
      setImagenUri(null);
      setImagenUrlActual(null);
    }
  }, [visible, esquemaEditando]);

  const temaKey = editando ? esquemaEditando!.tema_key : generarSlug(titulo);
  // La imagen local empaquetada (assets/esquemas) ya cubre las 10 láminas originales
  const imagenLocalExistente = !editando ? null : IMAGENES_ESQUEMAS[esquemaEditando!.tema_key];

  const elegirImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para elegir la imagen.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!resultado.canceled && resultado.assets?.length) {
      setImagenUri(resultado.assets[0].uri);
    }
  };

  const guardar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Atención', 'El título es obligatorio.');
      return;
    }
    if (!editando && esquemasExistentes.some((e) => e.tema_key === temaKey)) {
      Alert.alert('Atención', `Ya existe una lámina con la clave "${temaKey}". Cambia un poco el título.`);
      return;
    }
    if (!editando && !imagenUri) {
      Alert.alert('Atención', 'Elige una imagen para la lámina nueva.');
      return;
    }

    setSubiendo(true);
    let urlImagen = imagenUrlActual;
    if (imagenUri) {
      urlImagen = await esquemasService.subirImagenEsquema(imagenUri);
      if (!urlImagen) {
        setSubiendo(false);
        Alert.alert('Error', 'No se pudo subir la imagen. Verifica tu conexión.');
        return;
      }
    }

    const datos: NuevoEsquema = {
      categoria,
      tema_key: temaKey,
      titulo: titulo.trim(),
      imagen_url: urlImagen,
      orden: parseInt(orden, 10) || 1,
    };

    const resultado = editando
      ? await esquemasService.actualizarEsquema(esquemaEditando!.id, datos)
      : await esquemasService.crearEsquema(datos);
    setSubiendo(false);

    if (!resultado) {
      Alert.alert('Error', 'No se pudo guardar la lámina. Verifica que tengas permiso para hacerlo.');
      return;
    }

    Alert.alert('Éxito', editando ? 'Lámina actualizada correctamente.' : 'Lámina creada correctamente.');
    onGuardado();
    onCerrar();
  };

  const previsualizacion = imagenUri
    ? { uri: imagenUri }
    : imagenLocalExistente || (imagenUrlActual ? { uri: imagenUrlActual } : null);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onCerrar}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>{editando ? 'Editar lámina' : 'Nueva lámina'}</Text>
          <TouchableOpacity onPress={onCerrar}>
            <Icon name="close" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.contenido}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoriasRow}>
            {CATEGORIAS_ANATOMICAS.map((c) => {
              const activa = categoria === c.categoria;
              return (
                <TouchableOpacity
                  key={c.categoria}
                  style={[styles.categoriaChip, activa && styles.categoriaChipActiva, editando && styles.deshabilitado]}
                  onPress={() => !editando && setCategoria(c.categoria)}
                  disabled={editando}
                >
                  <Text style={[styles.categoriaChipTexto, activa && styles.categoriaChipTextoActiva]}>
                    {c.icono} {c.titulo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Título</Text>
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ej: Maxilar superior" />

          <Text style={styles.label}>Clave (tema_key)</Text>
          <View style={styles.soloLectura}>
            <Text style={styles.soloLecturaTexto}>{temaKey || '—'}</Text>
          </View>

          <Text style={styles.label}>Imagen</Text>
          {previsualizacion && <Image source={previsualizacion} style={styles.preview} contentFit="cover" />}
          <TouchableOpacity style={styles.imagenBtn} onPress={elegirImagen}>
            <Icon name="image-plus" size={18} color={COLORS.primary} />
            <Text style={styles.imagenBtnTexto}>{previsualizacion ? 'Cambiar imagen' : 'Elegir imagen'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Orden</Text>
          <TextInput style={styles.input} value={orden} onChangeText={setOrden} placeholder="1" keyboardType="number-pad" />

          <TouchableOpacity style={styles.guardarBtn} onPress={guardar} disabled={subiendo}>
            {subiendo ? <ActivityIndicator color="#FFF" /> : <Text style={styles.guardarBtnTexto}>Guardar</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelarBtn} onPress={onCerrar} disabled={subiendo}>
            <Text style={styles.cancelarBtnTexto}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
  contenido: { padding: 20, paddingBottom: 50 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 15 },

  categoriasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoriaChip: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#FFF' },
  categoriaChipActiva: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoriaChipTexto: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  categoriaChipTextoActiva: { color: '#FFF' },
  deshabilitado: { opacity: 0.5 },

  soloLectura: { backgroundColor: '#F0F0F0', borderRadius: 8, padding: 12 },
  soloLecturaTexto: { color: '#888', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  preview: { width: '100%', height: 160, borderRadius: 10, backgroundColor: '#EEE', marginBottom: 10 },
  imagenBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: 'dashed', borderRadius: 10, paddingVertical: 12 },
  imagenBtnTexto: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },

  guardarBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 28 },
  guardarBtnTexto: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cancelarBtn: { borderWidth: 1.5, borderColor: COLORS.secondary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  cancelarBtnTexto: { color: COLORS.primary, fontSize: 15, fontWeight: 'bold' },
});
