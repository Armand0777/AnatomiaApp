-- Agrega soporte de imagen de referencia a las preguntas de autoevaluación
ALTER TABLE public.preguntas
  ADD COLUMN IF NOT EXISTS imagen_url text NULL;
