import { supabase } from './supabase';
import { Pregunta, SesionEvaluacion } from '../types';

export const quizService = {
  getPreguntasPorUnidad: async (unidadId: string): Promise<Pregunta[]> => {
    try {
      const { data, error } = await supabase
        .from('preguntas')
        .select('*')
        .eq('unidad_id', unidadId)
        .eq('activo', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  guardarResultadoEvaluacion: async (
    sesion: Omit<SesionEvaluacion, 'id' | 'fecha'>
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('sesiones_evaluacion')
        .insert([{
          ...sesion,
          fecha: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  }
};
