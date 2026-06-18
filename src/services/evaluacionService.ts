import { supabase } from './supabase';
import { Pregunta, SesionEvaluacion } from '../types';

export interface SesionConRelaciones extends SesionEvaluacion {
  usuarios?: { nombre: string; email: string } | null;
  unidades?: { numero: number; titulo: string } | null;
}

export const evaluacionService = {
  // Trae las preguntas activas de una unidad (el examen elige 20 al azar de aquí)
  getPreguntasPorUnidad: async (unidadId: string): Promise<Pregunta[]> => {
    try {
      const { data, error } = await supabase
        .from('preguntas')
        .select('*')
        .eq('unidad_id', unidadId)
        .eq('activo', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener preguntas de la unidad:', error);
      return [];
    }
  },

  // Guarda una sesión de evaluación completada (no se llama si el usuario es invitado)
  guardarSesion: async (
    sesion: Omit<SesionEvaluacion, 'id' | 'fecha' | 'porcentaje'>
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('sesiones_evaluacion')
        .insert([{ ...sesion, fecha: new Date().toISOString() }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error al guardar la sesión de evaluación:', error);
      throw error;
    }
  },

  // Historial de evaluaciones del usuario autenticado
  getMisSesiones: async (usuarioId: string): Promise<SesionConRelaciones[]> => {
    try {
      const { data, error } = await supabase
        .from('sesiones_evaluacion')
        .select('*, unidades(numero, titulo)')
        .eq('usuario_id', usuarioId)
        .order('fecha', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener tus sesiones de evaluación:', error);
      return [];
    }
  },

  // Todas las sesiones de todos los estudiantes (solo admin/docente)
  getSesionesTodosDocente: async (): Promise<SesionConRelaciones[]> => {
    try {
      const { data, error } = await supabase
        .from('sesiones_evaluacion')
        .select('*, usuarios(nombre, email), unidades(numero, titulo)')
        .order('fecha', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener las sesiones de todos los estudiantes:', error);
      return [];
    }
  },

  crearPregunta: async (pregunta: Partial<Pregunta>): Promise<Pregunta> => {
    const { data, error } = await supabase
      .from('preguntas')
      .insert([pregunta])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  actualizarPregunta: async (id: string, cambios: Partial<Pregunta>): Promise<Pregunta> => {
    const { data, error } = await supabase
      .from('preguntas')
      .update(cambios)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  eliminarPregunta: async (id: string): Promise<void> => {
    const { error } = await supabase.from('preguntas').delete().eq('id', id);
    if (error) throw error;
  },
};
