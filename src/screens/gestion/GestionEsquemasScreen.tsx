import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { esquemasService } from '../../services/esquemasService';
import { IMAGENES_ESQUEMAS } from '../../data/imagenesEsquemas';
import { EsquemaInteractivo } from '../../types';
import ModalEsquema from './ModalEsquema';

const ETIQUETAS_CATEGORIA: Record<string, string> = {
  osteologia: 'Osteología',
  miologia: 'Miología',
};

interface Seccion {
  categoria: string;
  data: EsquemaInteractivo[];
}

// CRUD completo de las láminas anatómicas (solo admin/docente). La gestión
// de las etiquetas de cada lámina es una pantalla aparte (G4).
export default function GestionEsquemasScreen() {
  const navigation = useNavigation<any>();

  const [esquemas, setEsquemas] = useState<EsquemaInteractivo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [esquemaEditando, setEsquemaEditando] = useState<EsquemaInteractivo | null>(null);

  const cargarDatos = async () => {
    setCargando(true);
    setError(false);
    const data = await esquemasService.getEsquemas();
    setEsquemas(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Agrupa por categoría para mostrar un encabezado por sección
  const secciones: Seccion[] = useMemo(() => {
    const grupos = new Map<string, EsquemaInteractivo[]>();
    esquemas.forEach((e) => {
      const lista = grupos.get(e.categoria) || [];
      lista.push(e);
      grupos.set(e.categoria, lista);
    });
    return Array.from(grupos.entries()).map(([categoria, data]) => ({ categoria, data }));
  }, [esquemas]);

  const abrirModalNuevo = () => {
    setEsquemaEditando(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (esquema: EsquemaInteractivo) => {
    setEsquemaEditando(esquema);
    setModalVisible(true);
  };

  const irAEtiquetas = (esquema: EsquemaInteractivo) => {
    navigation.navigate('GestionEtiquetas', { esquema });
  };

  const confirmarEliminar = (esquema: EsquemaInteractivo) => {
    Alert.alert('Eliminar lámina', `¿Seguro que deseas eliminar "${esquema.titulo}"? También se borrarán sus etiquetas.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const exito = await esquemasService.eliminarEsquema(esquema.id);
          if (exito) {
            cargarDatos();
          } else {
            Alert.alert('Error', 'No se pudo eliminar la lámina.');
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
        <Text style={styles.headerTitle}>Gestionar Esquemas</Text>
        <View style={{ width: 26 }} />
      </View>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.centro}>
          <Icon name="alert-circle-outline" size={48} color={COLORS.incorrecto} />
          <Text style={styles.errorTexto}>No se pudieron cargar las láminas.</Text>
          <TouchableOpacity style={styles.reintentarBtn} onPress={cargarDatos}>
            <Text style={styles.reintentarTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={secciones}
          keyExtractor={(item) => item.categoria}
          contentContainerStyle={styles.lista}
          renderItem={({ item: seccion }) => (
            <View>
              <Text style={styles.encabezadoSeccion}>{ETIQUETAS_CATEGORIA[seccion.categoria] || seccion.categoria}</Text>
              {seccion.data.map((esquema) => {
                const imagenLocal = IMAGENES_ESQUEMAS[esquema.tema_key];
                const fuenteImagen = imagenLocal || (esquema.imagen_url ? { uri: esquema.imagen_url } : null);
                return (
                  <View key={esquema.id} style={styles.fila}>
                    {fuenteImagen ? (
                      <Image source={fuenteImagen} style={styles.miniatura} contentFit="cover" />
                    ) : (
                      <View style={[styles.miniatura, styles.miniaturaVacia]}>
                        <Icon name="image-off-outline" size={20} color="#BBB" />
                      </View>
                    )}
                    <View style={styles.filaInfo}>
                      <Text style={styles.filaTitulo} numberOfLines={2}>{esquema.titulo}</Text>
                      <Text style={styles.filaOrden}>Orden: {esquema.orden}</Text>
                    </View>
                    <View style={styles.filaAcciones}>
                      <TouchableOpacity onPress={() => abrirModalEditar(esquema)} style={styles.accionBtn}>
                        <Icon name="pencil" size={20} color={COLORS.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => irAEtiquetas(esquema)} style={styles.accionBtn}>
                        <Icon name="tag-outline" size={20} color="#673AB7" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => confirmarEliminar(esquema)} style={styles.accionBtn}>
                        <Icon name="delete" size={20} color={COLORS.incorrecto} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.vacioContainer}>
              <Icon name="puzzle-outline" size={56} color="#CCC" />
              <Text style={styles.vacioTexto}>No hay láminas todavía.</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={abrirModalNuevo}>
        <Icon name="plus" size={28} color="#FFF" />
      </TouchableOpacity>

      <ModalEsquema
        visible={modalVisible}
        esquemaEditando={esquemaEditando}
        esquemasExistentes={esquemas}
        onCerrar={() => setModalVisible(false)}
        onGuardado={cargarDatos}
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
  headerTitle: { color: COLORS.headerText, fontSize: 16, fontWeight: 'bold' },

  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  errorTexto: { color: '#888', marginTop: 12, marginBottom: 16 },
  reintentarBtn: { backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12 },
  reintentarTexto: { color: '#FFF', fontWeight: 'bold' },

  lista: { padding: 20, paddingTop: 10, paddingBottom: 90 },
  encabezadoSeccion: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginTop: 12, marginBottom: 10 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  miniatura: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#DDD' },
  miniaturaVacia: { justifyContent: 'center', alignItems: 'center' },
  filaInfo: { flex: 1, marginLeft: 12 },
  filaTitulo: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary },
  filaOrden: { fontSize: 11, color: '#888', marginTop: 4 },
  filaAcciones: { flexDirection: 'row' },
  accionBtn: { marginLeft: 8 },

  vacioContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  vacioTexto: { color: '#888', marginTop: 12, textAlign: 'center' },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
});
