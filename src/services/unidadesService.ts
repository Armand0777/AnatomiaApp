import { supabase } from './supabase';
import { Unidad, Tema, ContenidoTema, Multimedia } from '../types';

// Tipos extendidos para las vistas que requieren contadores o relaciones
export interface UnidadConTemas extends Unidad {
  temas?: { count: number }[];
}

export interface MultimediaConTema extends Multimedia {
  temas?: {
    titulo: string;
    unidad_id: string;
    unidades?: { numero: number; titulo: string } | null;
  } | null;
}

export const unidadesService = {
  getUnidades: async (): Promise<UnidadConTemas[]> => {
    try {
      const { data, error } = await supabase
        .from('unidades')
        .select('*, temas(count)')
        .eq('activo', true)
        .order('numero');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching unidades:', error);
      // Fallback a datos hardcodeados si la consulta falla
      return [
        { id: '1', numero: 1, titulo: 'Osteología y configuración cefálica', descripcion: '', imagen_url: '💀', activo: true, creado_por: null, created_at: '', updated_at: '', temas: [{ count: 4 }] },
        { id: '2', numero: 2, titulo: 'Miología y sistema neurovascular', descripcion: '', imagen_url: '💪', activo: true, creado_por: null, created_at: '', updated_at: '', temas: [{ count: 5 }] },
        { id: '3', numero: 3, titulo: 'Órganos de los sentidos y cavidades', descripcion: '', imagen_url: '👁️', activo: true, creado_por: null, created_at: '', updated_at: '', temas: [{ count: 3 }] },
        { id: '4', numero: 4, titulo: 'Aparato digestivo y respiratorio', descripcion: '', imagen_url: '🫁', activo: true, creado_por: null, created_at: '', updated_at: '', temas: [{ count: 4 }] },
      ];
    }
  },

  getTemas: async (unidadId: string): Promise<Tema[]> => {
    try {
      const { data, error } = await supabase
        .from('temas')
        .select('*')
        .eq('unidad_id', unidadId)
        .eq('activo', true)
        .order('orden');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching temas:', error);
      return [
        { id: 't1', unidad_id: unidadId, titulo: 'Huesos del cráneo', orden: 1, activo: true, creado_por: null, created_at: '', updated_at: '' },
        { id: 't2', unidad_id: unidadId, titulo: 'Huesos de la cara', orden: 2, activo: true, creado_por: null, created_at: '', updated_at: '' },
        { id: 't3', unidad_id: unidadId, titulo: 'Cavidades craneales', orden: 3, activo: true, creado_por: null, created_at: '', updated_at: '' },
        { id: 't4', unidad_id: unidadId, titulo: 'Articulación temporomandibular', orden: 4, activo: true, creado_por: null, created_at: '', updated_at: '' },
      ];
    }
  },

  getContenidoTema: async (temaId: string): Promise<ContenidoTema[]> => {
    try {
      const { data, error } = await supabase
        .from('contenido_tema')
        .select('*')
        .eq('tema_id', temaId)
        .order('orden');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching contenido:', error);
      return [
        { id: 'c1', tema_id: temaId, tipo: 'contenido', cuerpo: 'El cráneo está compuesto por 22 huesos que se dividen en neurocráneo y viscerocráneo.', orden: 1, creado_por: null, created_at: '', updated_at: '' },
        { id: 'c2', tema_id: temaId, tipo: 'funciones', cuerpo: 'Protege el encéfalo', orden: 1, creado_por: null, created_at: '', updated_at: '' },
        { id: 'c3', tema_id: temaId, tipo: 'funciones', cuerpo: 'Da forma a la cabeza', orden: 2, creado_por: null, created_at: '', updated_at: '' },
        { id: 'c4', tema_id: temaId, tipo: 'relaciones', cuerpo: 'Articula con la columna cervical', orden: 1, creado_por: null, created_at: '', updated_at: '' },
      ];
    }
  },

  getMultimedia: async (temaId: string): Promise<Multimedia[]> => {
    try {
      const { data, error } = await supabase
        .from('multimedia')
        .select('*')
        .eq('tema_id', temaId);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching multimedia:', error);
      return [];
    }
  },

  getResumen: async (temaId: string): Promise<Multimedia | null> => {
    try {
      const { data, error } = await supabase
        .from('multimedia')
        .select('*')
        .eq('tema_id', temaId)
        .eq('tipo', 'resumen')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching resumen:', error);
      return null;
    }
  },

  buscarTemas: async (query: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('temas')
        .select('*, unidades (numero, titulo)')
        .ilike('titulo', `%${query}%`)
        .eq('activo', true)
        .order('titulo');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al buscar temas:', error);
      return [];
    }
  },

  // Catálogo completo de imágenes y videos para la Biblioteca Multimedia
  getBibliotecaMultimedia: async (): Promise<MultimediaConTema[]> => {
    try {
      const { data, error } = await supabase
        .from('multimedia')
        .select('*, temas(titulo, unidad_id, unidades(numero, titulo))')
        .in('tipo', ['imagen', 'video'])
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener la biblioteca multimedia:', error);
      return [];
    }
  },

  getTemasPorIds: async (temaIds: string[]): Promise<any[]> => {
    if (!temaIds || temaIds.length === 0) return [];
    try {
      const { data, error } = await supabase
        .from('temas')
        .select('*, unidades (numero, titulo)')
        .in('id', temaIds)
        .eq('activo', true);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener temas por ids:', error);
      return [];
    }
  }
};
