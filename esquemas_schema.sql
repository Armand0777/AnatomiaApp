-- Esquemas anatómicos interactivos (Biblioteca Multimedia)
-- Ejecutar en el SQL Editor de Supabase.

CREATE TABLE IF NOT EXISTS public.esquemas_interactivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria text NOT NULL CHECK (categoria IN ('osteologia', 'miologia')),
  tema_key text NOT NULL UNIQUE,
  titulo text NOT NULL,
  imagen_url text NULL,
  orden integer NOT NULL DEFAULT 1,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.etiquetas_esquema (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  esquema_id uuid NOT NULL REFERENCES public.esquemas_interactivos(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  descripcion text NOT NULL,
  icono text NULL,
  pos_x numeric NOT NULL CHECK (pos_x >= 0 AND pos_x <= 100),
  pos_y numeric NOT NULL CHECK (pos_y >= 0 AND pos_y <= 100),
  orden integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.esquemas_interactivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etiquetas_esquema ENABLE ROW LEVEL SECURITY;

-- Lectura abierta para cualquier usuario autenticado o invitado (igual que el resto del contenido).
-- DROP POLICY IF EXISTS hace que este bloque se pueda volver a correr sin error
-- aunque ya hayas ejecutado este archivo antes.
DROP POLICY IF EXISTS "Lectura pública de esquemas" ON public.esquemas_interactivos;
CREATE POLICY "Lectura pública de esquemas" ON public.esquemas_interactivos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública de etiquetas" ON public.etiquetas_esquema;
CREATE POLICY "Lectura pública de etiquetas" ON public.etiquetas_esquema
  FOR SELECT USING (true);

-- Escritura (crear/editar/eliminar) solo para admin y docente, igual que en videos_biblioteca
DROP POLICY IF EXISTS "Escritura de esquemas para admin/docente" ON public.esquemas_interactivos;
CREATE POLICY "Escritura de esquemas para admin/docente" ON public.esquemas_interactivos
  FOR ALL USING (fn_rol_actual() IN ('admin', 'docente'));

DROP POLICY IF EXISTS "Escritura de etiquetas para admin/docente" ON public.etiquetas_esquema;
CREATE POLICY "Escritura de etiquetas para admin/docente" ON public.etiquetas_esquema
  FOR ALL USING (fn_rol_actual() IN ('admin', 'docente'));
