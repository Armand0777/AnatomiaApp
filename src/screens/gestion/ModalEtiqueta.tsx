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
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { esquemasService, NuevaEtiqueta } from '../../services/esquemasService';
import { EtiquetaEsquema } from '../../types';

const ICONOS_SUGERIDOS = ['🦴', '💪', '👁️', '🧠', '🩻', '🦷'];

interface ModalEtiquetaProps {
  visible: boolean;
  esquemaId: string;
  etiquetaEditando: EtiquetaEsquema | null;
  siguienteOrden: number;
  onCerrar: () => void;
  onGuardado: () => void;
}

// Modal de crear/editar el texto de una etiqueta. La posición (pos_x/pos_y)
// no se toca aquí: se ajusta arrastrando el marcador sobre el lienzo.
export default function ModalEtiqueta({
  visible,
  esquemaId,
  etiquetaEditando,
  siguienteOrden,
  onCerrar,
  onGuardado,
}: ModalEtiquetaProps) {
  const editando = !!etiquetaEditando;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [icono, setIcono] = useState('');
  const [orden, setOrden] = useState('1');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (etiquetaEditando) {
      setNombre(etiquetaEditando.nombre);
      setDescripcion(etiquetaEditando.descripcion);
      setIcono(etiquetaEditando.icono || '');
      setOrden(String(etiquetaEditando.orden));
    } else {
      setNombre('');
      setDescripcion('');
      setIcono('');
      setOrden(String(siguienteOrden));
    }
  }, [visible, etiquetaEditando, siguienteOrden]);

  const guardar = async () => {
    if (!nombre.trim() || !descripcion.trim()) {
      Alert.alert('Atención', 'El nombre y la descripción son obligatorios.');
      return;
    }

    setGuardando(true);
    let resultado;
    if (editando) {
      resultado = await esquemasService.actualizarEtiqueta(etiquetaEditando!.id, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        icono: icono.trim() || null,
        orden: parseInt(orden, 10) || 1,
      });
    } else {
      const datos: NuevaEtiqueta = {
        esquema_id: esquemaId,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        icono: icono.trim() || null,
        pos_x: 50,
        pos_y: 50,
        orden: parseInt(orden, 10) || 1,
      };
      resultado = await esquemasService.crearEtiqueta(datos);
    }
    setGuardando(false);

    if (!resultado) {
      Alert.alert('Error', 'No se pudo guardar la etiqueta.');
      return;
    }

    onGuardado();
    onCerrar();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onCerrar}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>{editando ? 'Editar etiqueta' : 'Nueva etiqueta'}</Text>
          <TouchableOpacity onPress={onCerrar}>
            <Icon name="close" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.contenido}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ej: Hueso frontal" />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputArea]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Lo que verá el estudiante al tocar esta etiqueta..."
            multiline
          />

          <Text style={styles.label}>Ícono (emoji, opcional)</Text>
          <TextInput style={styles.input} value={icono} onChangeText={setIcono} placeholder="🦴" />
          <View style={styles.iconosRow}>
            {ICONOS_SUGERIDOS.map((emoji) => (
              <TouchableOpacity key={emoji} style={styles.iconoChip} onPress={() => setIcono(emoji)}>
                <Text style={styles.iconoChipTexto}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Orden</Text>
          <TextInput style={styles.input} value={orden} onChangeText={setOrden} placeholder="1" keyboardType="number-pad" />

          {editando && (
            <Text style={styles.ayudaPosicion}>
              Posición actual: {etiquetaEditando!.pos_x.toFixed(0)}%, {etiquetaEditando!.pos_y.toFixed(0)}% — arrastra el
              marcador sobre la imagen para cambiarla.
            </Text>
          )}

          <TouchableOpacity style={styles.guardarBtn} onPress={guardar} disabled={guardando}>
            {guardando ? <ActivityIndicator color="#FFF" /> : <Text style={styles.guardarBtnTexto}>Guardar</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelarBtn} onPress={onCerrar} disabled={guardando}>
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
  inputArea: { height: 90, textAlignVertical: 'top' },

  iconosRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  iconoChip: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  iconoChipTexto: { fontSize: 18 },

  ayudaPosicion: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 16, lineHeight: 18 },

  guardarBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 28 },
  guardarBtnTexto: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cancelarBtn: { borderWidth: 1.5, borderColor: COLORS.secondary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  cancelarBtnTexto: { color: COLORS.primary, fontSize: 15, fontWeight: 'bold' },
});
