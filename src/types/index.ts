// Interfaces basadas en la estructura de base de datos de PostgreSQL

export interface Rol {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  created_at: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol_id: string;
  avatar_url: string | null;
  es_invitado: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Unidad {
  id: string;
  numero: number;
  titulo: string;
  descripcion: string | null;
  imagen_url: string | null;
  activo: boolean;
  creado_por: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tema {
  id: string;
  unidad_id: string;
  titulo: string;
  orden: number;
  activo: boolean;
  creado_por: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContenidoTema {
  id: string;
  tema_id: string;
  tipo: 'contenido' | 'funciones' | 'relaciones';
  cuerpo: string;
  orden: number;
  creado_por: string | null;
  created_at: string;
  updated_at: string;
}

export interface Multimedia {
  id: string;
  tema_id: string;
  tipo: 'imagen' | 'video' | 'resumen';
  titulo: string | null;
  url: string;
  descripcion: string | null;
  disponible_offline: boolean;
  tamano_bytes: number | null;
  duracion_segundos: number | null;
  activo: boolean;
  subido_por: string | null;
  created_at: string;
}

export interface Pregunta {
  id: string;
  unidad_id: string;
  enunciado: string;
  // Representación del JSONB de opciones
  opciones: Array<{ id: string; texto: string }>; 
  respuesta_correcta: number;
  explicacion: string | null;
  dificultad: number;
  activo: boolean;
  creado_por: string | null;
  created_at: string;
  updated_at: string;
}

export interface SesionEvaluacion {
  id: string;
  usuario_id: string | null;
  unidad_id: string;
  puntaje: number;
  total: number;
  porcentaje: number | null;
  // Representación del JSONB de respuestas
  respuestas: Record<string, number>; 
  completado: boolean;
  fecha: string;
}

export interface ProgresoUsuario {
  id: string;
  usuario_id: string;
  tema_id: string;
  completado: boolean;
  ultima_visita: string;
  tiempo_segundos: number;
}
