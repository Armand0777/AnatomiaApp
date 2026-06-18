import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';

const ACCENT = MODULOS.autoevaluacion.color;
import { unidadesService, UnidadConTemas } from '../../services/unidadesService';
import { evaluacionService } from '../../services/evaluacionService';
import { useRolAcceso } from '../../hooks/useRolAcceso';
import { Pregunta } from '../../types';

const LETRAS = ['A', 'B', 'C'];
const DIFICULTADES = [
  { valor: 1, emoji: '🟢', label: 'Fácil' },
  { valor: 2, emoji: '🟡', label: 'Media' },
  { valor: 3, emoji: '🔴', label: 'Difícil' },
];

function opcionesVacias() {
  return LETRAS.map((letra) => ({ letra, texto: '' }));
}

export default function GestionPreguntasScreen() {
  const navigation = useNavigation<any>();
  const { puedeGestionar } = useRolAcceso();

  const [unidades, setUnidades] = useState<UnidadConTemas[]>([]);
  const [unidadActiva, setUnidadActiva] = useState<UnidadConTemas | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [cargando, setCargando] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Pregunta | null>(null);
  const [enunciado, setEnunciado] = useState('');
  const [opciones, setOpciones] = useState(opcionesVacias());
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(0);
  const [explicacion, setExplicacion] = useState('');
  const [dificultad, setDificultad] = useState(1);

  useEffect(() => {
    const cargarUnidades = async () => {
      const data = await unidadesService.getUnidades();
      setUnidades(data);
      if (data.length > 0) setUnidadActiva(data[0]);
    };
    cargarUnidades();
  }, []);

  useEffect(() => {
    if (unidadActiva) cargarPreguntas();
  }, [unidadActiva]);

  const cargarPreguntas = async () => {
    if (!unidadActiva) return;
    setCargando(true);
    const data = await evaluacionService.getPreguntasPorUnidad(unidadActiva.id);
    setPreguntas(data);
    setCargando(false);
  };

  const abrirModalNuevo = () => {
    setEditando(null);
    setEnunciado('');
    setOpciones(opcionesVacias());
    setRespuestaCorrecta(0);
    setExplicacion('');
    setDificultad(1);
    setModalVisible(true);
  };

  const abrirModalEditar = (pregunta: Pregunta) => {
    setEditando(pregunta);
    setEnunciado(pregunta.enunciado);
    setOpciones(
      pregunta.opciones.length > 0
        ? pregunta.opciones.map((o, i) => ({ letra: o.letra || LETRAS[i], texto: o.texto }))
        : opcionesVacias()
    );
    setRespuestaCorrecta(pregunta.respuesta_correcta);
    setExplicacion(pregunta.explicacion || '');
    setDificultad(pregunta.dificultad || 1);
    setModalVisible(true);
  };

  const actualizarOpcion = (index: number, texto: string) => {
    const nuevas = [...opciones];
    nuevas[index] = { ...nuevas[index], texto };
    setOpciones(nuevas);
  };

  const guardarPregunta = async () => {
    if (!unidadActiva) return;
    if (!enunciado.trim() || opciones.some((o) => !o.texto.trim())) {
      Alert.alert('Atención', 'El enunciado y las 3 opciones son obligatorias.');
      return;
    }

    try {
      const payload = {
        unidad_id: unidadActiva.id,
        enunciado,
        opciones,
        respuesta_correcta: respuestaCorrecta,
        explicacion,
        dificultad,
        activo: true,
      };

      if (editando) {
        await evaluacionService.actualizarPregunta(editando.id, payload);
      } else {
        await evaluacionService.crearPregunta(payload);
      }
      setModalVisible(false);
      cargarPreguntas();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al guardar la pregunta.');
    }
  };

  const confirmarEliminar = (id: string) => {
    Alert.alert('Eliminar pregunta', '¿Seguro que deseas eliminarla?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await evaluacionService.eliminarPregunta(id);
            cargarPreguntas();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la pregunta.');
          }
        },
      },
    ]);
  };

  if (!puedeGestionar) {
    return (
      <View style={styles.restringido}>
        <Icon name="lock-outline" size={48} color="#CCC" />
        <Text style={styles.restringidoText}>No tienes acceso a esta sección.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestionar preguntas</Text>
        <TouchableOpacity onPress={abrirModalNuevo}>
          <Icon name="plus" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Chips de unidad */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {unidades.map((u) => {
          const activa = unidadActiva?.id === u.id;
          return (
            <TouchableOpacity
              key={u.id}
              style={[styles.chipUnidad, activa && styles.chipUnidadActiva]}
              onPress={() => setUnidadActiva(u)}
            >
              <Text style={[styles.chipUnidadText, activa && styles.chipUnidadTextActiva]}>
                Unidad {u.numero}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={preguntas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        refreshing={cargando}
        onRefresh={cargarPreguntas}
        renderItem={({ item, index }) => (
          <View style={styles.preguntaCard}>
            <View style={styles.preguntaHeader}>
              <View style={styles.preguntaHeaderLeft}>
                <Text style={styles.preguntaNumero}>Pregunta {index + 1}</Text>
                <Text style={styles.dificultadEmoji}>
                  {DIFICULTADES.find((d) => d.valor === item.dificultad)?.emoji || '🟢'}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => abrirModalEditar(item)} style={styles.actionBtn}>
                  <Icon name="pencil" size={20} color={ACCENT} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmarEliminar(item.id)} style={styles.actionBtn}>
                  <Icon name="delete" size={20} color={COLORS.incorrecto} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.preguntaText}>{item.enunciado}</Text>
          </View>
        )}
        ListEmptyComponent={() =>
          !cargando ? (
            <View style={styles.vacioContainer}>
              <Icon name="database-remove" size={60} color="#CCC" />
              <Text style={styles.vacioText}>No hay preguntas para esta unidad.</Text>
            </View>
          ) : null
        }
      />

      {/* Modal de creación/edición */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{editando ? 'Editar pregunta' : 'Nueva pregunta'}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Icon name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.label}>Unidad</Text>
          <Text style={styles.unidadFija}>Unidad {unidadActiva?.numero} — {unidadActiva?.titulo}</Text>

          <Text style={styles.label}>Enunciado</Text>
          <TextInput
            style={styles.inputArea}
            multiline
            value={enunciado}
            onChangeText={setEnunciado}
            placeholder="Ej: ¿Qué hueso forma la frente?"
          />

          <Text style={styles.label}>Opciones</Text>
          {opciones.map((op, idx) => (
            <View key={op.letra} style={styles.opcionRow}>
              <TouchableOpacity style={styles.radioBtn} onPress={() => setRespuestaCorrecta(idx)}>
                <Icon
                  name={respuestaCorrecta === idx ? 'radiobox-marked' : 'radiobox-blank'}
                  size={24}
                  color={respuestaCorrecta === idx ? ACCENT : '#999'}
                />
              </TouchableOpacity>
              <Text style={styles.letraLabel}>{op.letra}</Text>
              <TextInput
                style={styles.inputOpcion}
                value={op.texto}
                onChangeText={(t) => actualizarOpcion(idx, t)}
                placeholder={`Opción ${op.letra}`}
              />
            </View>
          ))}
          <Text style={styles.helpText}>Selecciona el círculo verde para marcar la respuesta correcta.</Text>

          <Text style={[styles.label, { marginTop: 20 }]}>Dificultad</Text>
          <View style={styles.dificultadRow}>
            {DIFICULTADES.map((d) => (
              <TouchableOpacity
                key={d.valor}
                style={[styles.dificultadChip, dificultad === d.valor && styles.dificultadChipActiva]}
                onPress={() => setDificultad(d.valor)}
              >
                <Text style={styles.dificultadChipText}>{d.emoji} {d.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>Explicación (opcional)</Text>
          <TextInput
            style={styles.inputArea}
            multiline
            value={explicacion}
            onChangeText={setExplicacion}
            placeholder="Explicación que verá el estudiante al responder..."
          />

          <TouchableOpacity style={styles.saveBtn} onPress={guardarPregunta}>
            <Text style={styles.saveBtnText}>Guardar pregunta</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  restringido: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  restringidoText: { marginTop: 12, color: '#888', fontSize: 15 },
  header: {
    backgroundColor: ACCENT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  backBtn: { padding: 5 },
  headerTitle: { color: COLORS.headerText, fontSize: 17, fontWeight: 'bold' },
  chipsRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chipUnidad: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, backgroundColor: '#FFF' },
  chipUnidadActiva: { backgroundColor: ACCENT, borderColor: ACCENT },
  chipUnidadText: { color: ACCENT, fontSize: 13, fontWeight: '600' },
  chipUnidadTextActiva: { color: '#FFF' },
  preguntaCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  preguntaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10 },
  preguntaHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  preguntaNumero: { fontSize: 14, fontWeight: 'bold', color: ACCENT },
  dificultadEmoji: { fontSize: 14 },
  actions: { flexDirection: 'row' },
  actionBtn: { marginLeft: 15 },
  preguntaText: { fontSize: 15, color: '#333' },
  vacioContainer: { alignItems: 'center', marginTop: 50 },
  vacioText: { color: '#888', marginTop: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalContent: { padding: 20, paddingBottom: 50 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 8 },
  unidadFija: { fontSize: 14, color: ACCENT, fontWeight: '600', marginBottom: 20 },
  inputArea: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 15, fontSize: 16, height: 100, textAlignVertical: 'top', marginBottom: 20 },
  opcionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 },
  radioBtn: { marginRight: 4 },
  letraLabel: { fontWeight: 'bold', color: ACCENT, width: 16 },
  inputOpcion: { flex: 1, backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16 },
  helpText: { fontSize: 12, color: '#888', fontStyle: 'italic' },
  dificultadRow: { flexDirection: 'row', gap: 10 },
  dificultadChip: { borderWidth: 1, borderColor: '#DDD', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8 },
  dificultadChipActiva: { borderColor: ACCENT, backgroundColor: ACCENT + '14' },
  dificultadChipText: { fontSize: 13, color: '#444' },
  saveBtn: { backgroundColor: ACCENT, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
