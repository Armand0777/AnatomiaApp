import { supabase } from './supabase';
import { VideoBiblioteca } from '../types';

export const videosService = {
  // Videos de una categoría temática, ordenados. youtube_id puede venir NULL
  // si ese tema todavía no tiene video cargado.
  getVideosPorCategoria: async (categoria: string): Promise<VideoBiblioteca[]> => {
    try {
      const { data, error } = await supabase
        .from('videos_biblioteca')
        .select('*')
        .eq('categoria', categoria)
        .eq('activo', true)
        .order('orden');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener los videos de la categoría:', error);
      return [];
    }
  },
};
