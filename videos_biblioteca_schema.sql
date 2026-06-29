-- Videos explicativos de la Biblioteca Multimedia (organizados por unidad)
-- Ejecutar en el SQL Editor de Supabase.

CREATE TABLE IF NOT EXISTS public.videos_biblioteca (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unidad_id uuid NOT NULL REFERENCES public.unidades(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descripcion text NULL,
  youtube_id text NOT NULL,
  duracion text NULL,
  orden integer NOT NULL DEFAULT 1,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.videos_biblioteca ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de videos_biblioteca" ON public.videos_biblioteca
  FOR SELECT USING (true);

-- Ejemplo para agregar un video (reemplaza TU_ID_YOUTUBE):
-- INSERT INTO public.videos_biblioteca (unidad_id, titulo, descripcion, youtube_id, duracion, orden)
-- SELECT id, 'Huesos del cráneo', 'Video introductorio.', 'TU_ID_YOUTUBE', '06:45', 1
-- FROM public.unidades WHERE numero = 1;
