import { supabase } from './supabase';
import { Unidad, Tema, ContenidoTema } from '../types';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export const adminService = {
  // ----- UNIDADES -----
  crearUnidad: async (unidad: Partial<Unidad>) => {
    const { data, error } = await supabase.from('unidades').insert(unidad).select().single();
    if (error) throw error;
    return data;
  },
  actualizarUnidad: async (id: string, updates: Partial<Unidad>) => {
    const { data, error } = await supabase.from('unidades').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  eliminarUnidad: async (id: string) => {
    const { error } = await supabase.from('unidades').delete().eq('id', id);
    if (error) throw error;
  },

  // ----- TEMAS -----
  crearTema: async (tema: Partial<Tema>) => {
    const { data, error } = await supabase.from('temas').insert(tema).select().single();
    if (error) throw error;
    return data;
  },
  actualizarTema: async (id: string, updates: Partial<Tema>) => {
    const { data, error } = await supabase.from('temas').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  eliminarTema: async (id: string) => {
    const { error } = await supabase.from('temas').delete().eq('id', id);
    if (error) throw error;
  },

  // ----- CONTENIDO TEMA -----
  guardarContenidoTema: async (temaId: string, contenidos: Partial<ContenidoTema>[]) => {
    // Para simplificar, borramos el contenido existente y reinsertamos el nuevo
    const { error: deleteError } = await supabase.from('contenido_tema').delete().eq('tema_id', temaId);
    if (deleteError) throw deleteError;

    if (contenidos.length > 0) {
      const { error: insertError } = await supabase.from('contenido_tema').insert(contenidos);
      if (insertError) throw insertError;
    }
  },

  // ----- MULTIMEDIA -----
  guardarMultimediaTema: async (temaId: string, multimedia: any[]) => {
    try {
      // 1. Borrar multimedia existente de ese tema
      const { error: deleteError } = await supabase
        .from('multimedia')
        .delete()
        .eq('tema_id', temaId);
        
      if (deleteError) throw deleteError;

      // 2. Insertar nuevo multimedia si hay
      if (multimedia.length > 0) {
        const { error: insertError } = await supabase
          .from('multimedia')
          .insert(multimedia);
          
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error al guardar multimedia del tema:', error);
      throw error;
    }
  },

  // ----- STORAGE (SUBIDA DE ARCHIVOS) -----
  subirArchivoStorage: async (uri: string, carpeta: string = 'multimedia'): Promise<string> => {
    try {
      // Leer archivo como Base64 (soluciona el error "Network request failed" de fetch en Android)
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });

      // Generar nombre único
      const extension = uri.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
      const filePath = `${carpeta}/${fileName}`;

      // Subir a Supabase Storage decodificando el Base64 a ArrayBuffer
      const { error: uploadError } = await supabase.storage
        .from('multimedia')
        .upload(filePath, decode(base64), {
          contentType: `image/${extension}`,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data } = supabase.storage.from('multimedia').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error subiendo archivo a Storage:', error);
      throw error;
    }
  },

  // ----- PREGUNTAS (QUIZ) -----
  getPreguntasPorUnidad: async (unidadId: string) => {
    const { data, error } = await supabase
      .from('preguntas')
      .select('*')
      .eq('unidad_id', unidadId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  crearPregunta: async (pregunta: any) => {
    const { data, error } = await supabase.from('preguntas').insert([pregunta]).select().single();
    if (error) throw error;
    return data;
  },

  actualizarPregunta: async (id: string, pregunta: any) => {
    const { data, error } = await supabase.from('preguntas').update(pregunta).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  eliminarPregunta: async (id: string) => {
    const { error } = await supabase.from('preguntas').delete().eq('id', id);
    if (error) throw error;
  }
};
