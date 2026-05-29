import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { unidadesService } from '../../services/unidadesService';
import { adminService } from '../../services/adminService';
import { COLORS } from '../../constants/colors';

interface TextoItem {
  id: string; // pseudo-id para la UI
  cuerpo?: string;
  titulo?: string | null;
  url?: string | null;
}

export default function AdminContenidoScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { temaId, temaTitulo } = route.params;

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estados para cada tipo
  const [contenidos, setContenidos] = useState<TextoItem[]>([]);
  const [funciones, setFunciones] = useState<TextoItem[]>([]);
  const [relaciones, setRelaciones] = useState<TextoItem[]>([]);
  
  const [imagenes, setImagenes] = useState<TextoItem[]>([]);
  const [videos, setVideos] = useState<TextoItem[]>([]);
  const [resumenes, setResumenes] = useState<TextoItem[]>([]);

  const fetchDatos = async () => {
    try {
      const data = await unidadesService.getContenidoTema(temaId);
      const dataMulti = await unidadesService.getMultimedia(temaId);
      
      const cont = data.filter(c => c.tipo === 'contenido').map((c, i) => ({ id: c.id || `c${i}`, cuerpo: c.cuerpo }));
      const func = data.filter(c => c.tipo === 'funciones').map((c, i) => ({ id: c.id || `f${i}`, cuerpo: c.cuerpo }));
      const rel = data.filter(c => c.tipo === 'relaciones').map((c, i) => ({ id: c.id || `r${i}`, cuerpo: c.cuerpo }));

      const imgs = dataMulti.filter(m => m.tipo === 'imagen').map((m, i) => ({ id: m.id || `img${i}`, titulo: m.titulo, url: m.url }));
      const vids = dataMulti.filter(m => m.tipo === 'video').map((m, i) => ({ id: m.id || `vid${i}`, titulo: m.titulo, url: m.url }));
      const resu = dataMulti.filter(m => m.tipo === 'resumen').map((m, i) => ({ id: m.id || `res${i}`, cuerpo: m.descripcion || '' }));

      setContenidos(cont.length ? cont : [{ id: 'new_c0', cuerpo: '' }]);
      setFunciones(func.length ? func : [{ id: 'new_f0', cuerpo: '' }]);
      setRelaciones(rel.length ? rel : [{ id: 'new_r0', cuerpo: '' }]);
      
      setImagenes(imgs.length ? imgs : [{ id: 'new_img0', titulo: '', url: '' }]);
      setVideos(vids.length ? vids : [{ id: 'new_vid0', titulo: '', url: '' }]);
      setResumenes(resu.length ? resu : [{ id: 'new_res0', cuerpo: '' }]);

    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el contenido del tema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [temaId]);

  const handleSubirImagen = async (index: number, items: TextoItem[], setItems: React.Dispatch<React.SetStateAction<TextoItem[]>>) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para subir fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setGuardando(true);
        const uri = result.assets[0].uri;
        
        // Subir a Supabase
        const publicUrl = await adminService.subirArchivoStorage(uri, 'multimedia');
        
        // Actualizar el estado
        const newItems = [...items];
        newItems[index].url = publicUrl;
        if (!newItems[index].titulo) {
          newItems[index].titulo = 'Imagen subida';
        }
        setItems(newItems);
        Alert.alert('Éxito', 'Imagen subida correctamente. Recuerda guardar los cambios del tema.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al subir la imagen.');
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const payload: any[] = [];
      const payloadMulti: any[] = [];
      let ordenCont = 1, ordenFunc = 1, ordenRel = 1;

      contenidos.forEach(c => {
        if (c.cuerpo?.trim()) payload.push({ tema_id: temaId, tipo: 'contenido', cuerpo: c.cuerpo.trim(), orden: ordenCont++ });
      });
      funciones.forEach(f => {
        if (f.cuerpo?.trim()) payload.push({ tema_id: temaId, tipo: 'funciones', cuerpo: f.cuerpo.trim(), orden: ordenFunc++ });
      });
      relaciones.forEach(r => {
        if (r.cuerpo?.trim()) payload.push({ tema_id: temaId, tipo: 'relaciones', cuerpo: r.cuerpo.trim(), orden: ordenRel++ });
      });

      imagenes.forEach(img => {
        if (img.url?.trim()) payloadMulti.push({ tema_id: temaId, tipo: 'imagen', titulo: img.titulo?.trim() || 'Imagen', url: img.url.trim() });
      });
      videos.forEach(vid => {
        if (vid.url?.trim()) payloadMulti.push({ tema_id: temaId, tipo: 'video', titulo: vid.titulo?.trim() || 'Video', url: vid.url.trim() });
      });
      resumenes.forEach(res => {
        if (res.cuerpo?.trim()) payloadMulti.push({ tema_id: temaId, tipo: 'resumen', titulo: 'Resumen', url: '-', descripcion: res.cuerpo.trim() });
      });

      // Guardar todo
      await adminService.guardarContenidoTema(temaId, payload);
      await adminService.guardarMultimediaTema(temaId, payloadMulti);
      
      Alert.alert('Éxito', 'Contenido y multimedia guardados correctamente', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar el contenido');
    } finally {
      setGuardando(false);
    }
  };

  const renderSeccion = (titulo: string, items: TextoItem[], setItems: React.Dispatch<React.SetStateAction<TextoItem[]>>, prefijo: string) => (
    <View style={styles.seccion}>
      <View style={styles.seccionHeader}>
        <Text style={styles.seccionTitulo}>{titulo}</Text>
        <TouchableOpacity onPress={() => setItems([...items, { id: `new_${prefijo}${Date.now()}`, cuerpo: '' }])}>
          <Icon name="plus-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {items.map((item, index) => (
        <View key={item.id} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline
            value={item.cuerpo}
            onChangeText={(text) => {
              const newItems = [...items];
              newItems[index].cuerpo = text;
              setItems(newItems);
            }}
            placeholder={`Escribe aquí...`}
          />
          <TouchableOpacity onPress={() => setItems(items.filter((_, i) => i !== index))} style={styles.deleteBtn}>
            <Icon name="minus-circle" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  // ── Sección de GALERÍA DE IMÁGENES (visual, con miniaturas) ──
  const renderGaleriaImagenes = () => (
    <View style={styles.seccion}>
      <View style={styles.seccionHeader}>
        <View>
          <Text style={styles.seccionTitulo}>📸 Imágenes del Tema</Text>
          <Text style={styles.seccionSubtitulo}>{imagenes.filter(i => i.url?.trim()).length} imagen(es) subida(s)</Text>
        </View>
      </View>

      {/* Grid de miniaturas */}
      <View style={styles.galGrid}>
        {imagenes.map((item, index) => (
          <View key={item.id} style={styles.galCard}>
            {/* Miniatura o placeholder */}
            {item.url ? (
              <Image source={{ uri: item.url }} style={styles.galThumb} contentFit="cover" />
            ) : (
              <View style={[styles.galThumb, styles.galThumbEmpty]}>
                <Icon name="image-plus" size={36} color="#CCC" />
              </View>
            )}

            {/* Título editable */}
            <TextInput
              style={styles.galTitleInput}
              value={item.titulo || ''}
              onChangeText={(text) => {
                const newItems = [...imagenes];
                newItems[index].titulo = text;
                setImagenes(newItems);
              }}
              placeholder="Nombre de la imagen..."
              placeholderTextColor="#AAA"
            />

            {/* Botones de acción */}
            <View style={styles.galActions}>
              <TouchableOpacity
                style={styles.galUploadBtn}
                onPress={() => handleSubirImagen(index, imagenes, setImagenes)}
              >
                <Icon name="camera-plus" size={16} color="#FFF" />
                <Text style={styles.galUploadText}>{item.url ? 'Cambiar' : 'Subir'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.galDeleteBtn}
                onPress={() => setImagenes(imagenes.filter((_, i) => i !== index))}
              >
                <Icon name="trash-can-outline" size={18} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Botón para agregar nueva imagen */}
        <TouchableOpacity
          style={styles.galAddCard}
          onPress={() => setImagenes([...imagenes, { id: `new_img${Date.now()}`, titulo: '', url: '' }])}
        >
          <Icon name="plus-circle-outline" size={40} color={COLORS.primary} />
          <Text style={styles.galAddText}>Agregar imagen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Sección genérica de multimedia (para videos) ──
  const renderMultimedia = (titulo: string, items: TextoItem[], setItems: React.Dispatch<React.SetStateAction<TextoItem[]>>, prefijo: string) => (
    <View style={styles.seccion}>
      <View style={styles.seccionHeader}>
        <Text style={styles.seccionTitulo}>{titulo}</Text>
        <TouchableOpacity onPress={() => setItems([...items, { id: `new_${prefijo}${Date.now()}`, titulo: '', url: '' }])}>
          <Icon name="plus-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {items.map((item, index) => (
        <View key={item.id} style={styles.multiContainer}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[styles.inputMulti, { marginBottom: 5 }]}
              value={item.titulo || ''}
              onChangeText={(text) => {
                const newItems = [...items];
                newItems[index].titulo = text;
                setItems(newItems);
              }}
              placeholder="Título descriptivo"
            />
            <TextInput
              style={styles.inputMulti}
              value={item.url || ''}
              onChangeText={(text) => {
                const newItems = [...items];
                newItems[index].url = text;
                setItems(newItems);
              }}
              placeholder="Enlace de YouTube (ej. https://youtube.com/...)"
            />
          </View>
          <TouchableOpacity onPress={() => setItems(items.filter((_, i) => i !== index))} style={styles.deleteBtn}>
            <Icon name="minus-circle" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      {/* Header profesional */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{temaTitulo}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Textos */}
        {renderSeccion('Párrafos de Contenido / Estructuras', contenidos, setContenidos, 'c')}
        {renderSeccion('Funciones', funciones, setFunciones, 'f')}
        {renderSeccion('Relaciones Anatómicas', relaciones, setRelaciones, 'r')}
        {renderSeccion('Puntos Clave del Resumen', resumenes, setResumenes, 'res')}
        
        {/* Multimedia */}
        {renderGaleriaImagenes()}
        {renderMultimedia('🎬 Videos del Tema', videos, setVideos, 'vid')}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar} disabled={guardando}>
          {guardando ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Guardar Cambios</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.headerBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 10 },
  headerBackBtn: { padding: 5, width: 40 },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  scroll: { padding: 15, paddingBottom: 50 },
  seccion: { marginBottom: 25, backgroundColor: COLORS.card, padding: 15, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  seccionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seccionTitulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  seccionSubtitulo: { fontSize: 12, color: '#888', marginTop: 2 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, minHeight: 60, textAlignVertical: 'top', backgroundColor: '#F9F9F9' },
  multiContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#F0F5F9', padding: 10, borderRadius: 8 },
  inputMulti: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 6, padding: 8 },
  deleteBtn: { padding: 10, alignSelf: 'center' },
  footer: { padding: 15, borderTopWidth: 1, borderColor: '#EEE', backgroundColor: '#FFF' },
  saveBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  // ── Galería de imágenes (Admin) ──
  galGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  galCard: { width: '47%', backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E8E8E8', elevation: 1 },
  galThumb: { width: '100%', height: 120, backgroundColor: '#F5F5F5' },
  galThumbEmpty: { justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  galTitleInput: { fontSize: 13, padding: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', color: '#333' },
  galActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 6 },
  galUploadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6, gap: 4 },
  galUploadText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  galDeleteBtn: { padding: 6 },
  galAddCard: { width: '47%', height: 180, backgroundColor: '#FAFAFA', borderRadius: 12, borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', gap: 8 },
  galAddText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
});
