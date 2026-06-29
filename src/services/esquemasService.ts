import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase';
import { EsquemaInteractivo, EtiquetaEsquema } from '../types';

export interface NuevoEsquema {
  categoria: 'osteologia' | 'miologia';
  tema_key: string;
  titulo: string;
  imagen_url: string | null;
  orden: number;
}

export interface NuevaEtiqueta {
  esquema_id: string;
  nombre: string;
  descripcion: string;
  icono: string | null;
  pos_x: number;
  pos_y: number;
  orden: number;
}

export const esquemasService = {
  // Trae el esquema de un tema junto con sus etiquetas tocables, ordenadas
  getEsquemaPorTema: async (
    temaKey: string
  ): Promise<{ esquema: EsquemaInteractivo; etiquetas: EtiquetaEsquema[] } | null> => {
    try {
      const { data: esquema, error: errorEsquema } = await supabase
        .from('esquemas_interactivos')
        .select('*')
        .eq('tema_key', temaKey)
        .eq('activo', true)
        .single();

      if (errorEsquema || !esquema) throw errorEsquema || new Error('Esquema no encontrado');

      const { data: etiquetas, error: errorEtiquetas } = await supabase
        .from('etiquetas_esquema')
        .select('*')
        .eq('esquema_id', esquema.id)
        .order('orden');

      if (errorEtiquetas) throw errorEtiquetas;

      return { esquema, etiquetas: etiquetas || [] };
    } catch (error) {
      console.error('Error al obtener el esquema interactivo:', error);
      return null;
    }
  },

  // Todas las láminas, ordenadas por categoría y orden (para Gestión y para
  // que el estudiante las vea agrupadas por categoría)
  getEsquemas: async (): Promise<EsquemaInteractivo[]> => {
    try {
      const { data, error } = await supabase
        .from('esquemas_interactivos')
        .select('*')
        .order('categoria')
        .order('orden');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener los esquemas:', error);
      return [];
    }
  },

  crearEsquema: async (datos: NuevoEsquema): Promise<EsquemaInteractivo | null> => {
    try {
      const { data, error } = await supabase.from('esquemas_interactivos').insert(datos).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear el esquema:', error);
      return null;
    }
  },

  actualizarEsquema: async (id: string, datos: Partial<NuevoEsquema>): Promise<EsquemaInteractivo | null> => {
    try {
      const { data, error } = await supabase
        .from('esquemas_interactivos')
        .update(datos)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar el esquema:', error);
      return null;
    }
  },

  // Borra la lámina; sus etiquetas caen solas por el ON DELETE CASCADE
  eliminarEsquema: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('esquemas_interactivos').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar el esquema:', error);
      return false;
    }
  },

  // Sube una imagen elegida del dispositivo al bucket "esquemas" y devuelve
  // su URL pública para guardarla en imagen_url
  subirImagenEsquema: async (uriLocal: string): Promise<string | null> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uriLocal, { encoding: 'base64' });
      const extension = uriLocal.split('.').pop() || 'jpg';
      const path = `lamina_${Date.now()}.${extension}`;

      const { error: errorSubida } = await supabase.storage
        .from('esquemas')
        .upload(path, decode(base64), { contentType: `image/${extension}`, upsert: true });

      if (errorSubida) throw errorSubida;

      const { data } = supabase.storage.from('esquemas').getPublicUrl(path);
      return data.publicUrl;
    } catch (error) {
      console.error('Error al subir la imagen del esquema:', error);
      return null;
    }
  },

  // Etiquetas tocables de una lámina, ordenadas
  getEtiquetasPorEsquema: async (esquemaId: string): Promise<EtiquetaEsquema[]> => {
    try {
      const { data, error } = await supabase
        .from('etiquetas_esquema')
        .select('*')
        .eq('esquema_id', esquemaId)
        .order('orden');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener las etiquetas del esquema:', error);
      return [];
    }
  },

  crearEtiqueta: async (datos: NuevaEtiqueta): Promise<EtiquetaEsquema | null> => {
    try {
      const { data, error } = await supabase.from('etiquetas_esquema').insert(datos).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear la etiqueta:', error);
      return null;
    }
  },

  // Se usa tanto para editar texto como para guardar la nueva posición tras arrastrar
  actualizarEtiqueta: async (id: string, datos: Partial<NuevaEtiqueta>): Promise<EtiquetaEsquema | null> => {
    try {
      const { data, error } = await supabase
        .from('etiquetas_esquema')
        .update(datos)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar la etiqueta:', error);
      return null;
    }
  },

  eliminarEtiqueta: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('etiquetas_esquema').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar la etiqueta:', error);
      return false;
    }
  },
};
