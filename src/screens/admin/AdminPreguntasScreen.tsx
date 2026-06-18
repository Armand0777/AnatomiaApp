import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, ScrollView, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { adminService } from '../../services/adminService';
import { Pregunta } from '../../types';
import { COLORS } from '../../constants/colors';

export default function AdminPreguntasScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { unidadId, unidadTitulo } = route.params || {};

  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal de Edición/Creación
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Pregunta | null>(null);
  
  // Formulario
  const [enunciado, setEnunciado] = useState('');
  const [opciones, setOpciones] = useState([
    { id: 'a', texto: '' },
    { id: 'b', texto: '' },
    { id: 'c', texto: '' },
    { id: 'd', texto: '' }
  ]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(0);
  const [explicacion, setExplicacion] = useState('');

  useEffect(() => {
    cargarPreguntas();
  }, [unidadId]);

  const cargarPreguntas = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPreguntasPorUnidad(unidadId);
      setPreguntas(data || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar las preguntas.');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setEditando(null);
    setEnunciado('');
    setOpciones([
      { id: 'a', texto: '' },
      { id: 'b', texto: '' },
      { id: 'c', texto: '' },
      { id: 'd', texto: '' }
    ]);
    setRespuestaCorrecta(0);
    setExplicacion('');
    setModalVisible(true);
  };

  const abrirModalEditar = (pregunta: Pregunta) => {
    setEditando(pregunta);
    setEnunciado(pregunta.enunciado);
    setOpciones(
      pregunta.opciones?.length
        ? pregunta.opciones.map((o, i) => ({ id: o.id || o.letra?.toLowerCase() || String.fromCharCode(97 + i), texto: o.texto }))
        : [
            { id: 'a', texto: '' },
            { id: 'b', texto: '' },
            { id: 'c', texto: '' },
            { id: 'd', texto: '' }
          ]
    );
    setRespuestaCorrecta(pregunta.respuesta_correcta);
    setExplicacion(pregunta.explicacion || '');
    setModalVisible(true);
  };

  const guardarPregunta = async () => {
    if (!enunciado.trim() || opciones.some(o => !o.texto.trim())) {
      Alert.alert('Atención', 'El enunciado y todas las opciones son obligatorias.');
      return;
    }

    try {
      const payload = {
        unidad_id: unidadId,
        enunciado,
        opciones,
        respuesta_correcta: respuestaCorrecta,
        explicacion,
        dificultad: 1,
        activo: true
      };

      if (editando) {
        await adminService.actualizarPregunta(editando.id, payload);
      } else {
        await adminService.crearPregunta(payload);
      }
      setModalVisible(false);
      cargarPreguntas();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al guardar la pregunta.');
    }
  };

  const confirmarEliminar = (id: string) => {
    Alert.alert('Eliminar', '¿Seguro que deseas eliminar esta pregunta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await adminService.eliminarPregunta(id);
            cargarPreguntas();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar.');
          }
      }}
    ]);
  };

  const actualizarOpcion = (index: number, texto: string) => {
    const nuevas = [...opciones];
    nuevas[index].texto = texto;
    setOpciones(nuevas);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preguntas de {unidadTitulo}</Text>
        <TouchableOpacity onPress={abrirModalNuevo}>
          <Icon name="plus" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={preguntas}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item, index }) => (
          <View style={styles.preguntaCard}>
            <View style={styles.preguntaHeader}>
              <Text style={styles.preguntaNumero}>Pregunta {index + 1}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => abrirModalEditar(item)} style={styles.actionBtn}>
                  <Icon name="pencil" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmarEliminar(item.id)} style={styles.actionBtn}>
                  <Icon name="delete" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.preguntaText}>{item.enunciado}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Icon name="database-remove" size={60} color="#CCC" />
            <Text style={{ color: '#888', marginTop: 10 }}>No hay preguntas creadas.</Text>
          </View>
        )}
      />

      {/* Modal de Edición */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{editando ? 'Editar Pregunta' : 'Nueva Pregunta'}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Icon name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.label}>Enunciado de la Pregunta</Text>
          <TextInput
            style={styles.inputArea}
            multiline
            value={enunciado}
            onChangeText={setEnunciado}
            placeholder="Ej: ¿Qué hueso forma la frente?"
          />

          <Text style={styles.label}>Opciones</Text>
          {opciones.map((op, idx) => (
            <View key={op.id} style={styles.opcionRow}>
              <TouchableOpacity 
                style={styles.radioBtn}
                onPress={() => setRespuestaCorrecta(idx)}
              >
                <Icon 
                  name={respuestaCorrecta === idx ? "radiobox-marked" : "radiobox-blank"} 
                  size={24} 
                  color={respuestaCorrecta === idx ? COLORS.primary : '#999'} 
                />
              </TouchableOpacity>
              <TextInput
                style={styles.inputOpcion}
                value={op.texto}
                onChangeText={(t) => actualizarOpcion(idx, t)}
                placeholder={`Opción ${op.id.toUpperCase()}`}
              />
            </View>
          ))}
          <Text style={styles.helpText}>Selecciona el círculo verde para marcar la respuesta correcta.</Text>

          <Text style={[styles.label, { marginTop: 20 }]}>Explicación (Opcional)</Text>
          <TextInput
            style={styles.inputArea}
            multiline
            value={explicacion}
            onChangeText={setExplicacion}
            placeholder="Explicación si el estudiante se equivoca..."
          />

          <TouchableOpacity style={styles.saveBtn} onPress={guardarPregunta}>
            <Text style={styles.saveBtnText}>Guardar Pregunta</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { backgroundColor: COLORS.headerBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 10 },
  backBtn: { padding: 5 },
  headerTitle: { color: COLORS.headerText, fontSize: 18, fontWeight: 'bold' },
  preguntaCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  preguntaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10 },
  preguntaNumero: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  actions: { flexDirection: 'row' },
  actionBtn: { marginLeft: 15 },
  preguntaText: { fontSize: 16, color: '#333' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalContent: { padding: 20, paddingBottom: 50 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 8 },
  inputArea: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 15, fontSize: 16, height: 100, textAlignVertical: 'top', marginBottom: 20 },
  opcionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  radioBtn: { marginRight: 10 },
  inputOpcion: { flex: 1, backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16 },
  helpText: { fontSize: 12, color: '#888', fontStyle: 'italic' },
  saveBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
