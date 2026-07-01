-- ============================================================
-- CORRECCIONES DEL REVISOR — script de base de datos
-- Ejecutar en el SQL Editor de Supabase ANTES de probar la app.
-- Seguro de volver a correr completo si algo falla a la mitad.
-- ============================================================

-- 1. Esquemas: permitir las 2 categorías nuevas además de las 2 que ya había
ALTER TABLE public.esquemas_interactivos DROP CONSTRAINT IF EXISTS esquemas_interactivos_categoria_check;
ALTER TABLE public.esquemas_interactivos
  ADD CONSTRAINT esquemas_interactivos_categoria_check
  CHECK (categoria IN ('osteologia', 'miologia', 'organos_sentidos', 'vias_respiratorias'));

-- Temas de las 2 categorías nuevas (sin imagen todavía, igual que el resto al inicio)
INSERT INTO public.esquemas_interactivos (categoria, tema_key, titulo, orden) VALUES
  ('organos_sentidos', 'orbita_globo_ocular', 'Órbita y globo ocular', 1),
  ('organos_sentidos', 'oido_externo_medio_interno', 'Oído externo, medio e interno', 2),
  ('organos_sentidos', 'fosas_nasales', 'Fosas nasales', 3),
  ('organos_sentidos', 'cavidad_oral', 'Cavidad oral', 4),
  ('organos_sentidos', 'lengua_glandulas_salivales', 'Lengua y glándulas salivales', 5),
  ('vias_respiratorias', 'faringe', 'Faringe', 1),
  ('vias_respiratorias', 'laringe', 'Laringe', 2),
  ('vias_respiratorias', 'vias_respiratorias_superiores', 'Vías respiratorias superiores', 3),
  ('vias_respiratorias', 'relacion_anatomica_digestiva_respiratoria', 'Relación anatómica digestiva y respiratoria', 4),
  ('vias_respiratorias', 'integracion_anatomica_cabeza_cuello', 'Integración anatómica de cabeza y cuello', 5)
ON CONFLICT (tema_key) DO NOTHING;

-- 2. Videos de la Biblioteca: se reestructura por CATEGORÍA (ya no por unidad)
DROP TABLE IF EXISTS public.videos_biblioteca;

CREATE TABLE public.videos_biblioteca (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria text NOT NULL CHECK (categoria IN ('osteologia', 'miologia', 'organos_sentidos', 'vias_respiratorias')),
  tema text NOT NULL,
  youtube_id text NULL,
  duracion text NULL,
  imagen_descarga_url text NULL,
  pdf_resumen_url text NULL,
  video_mp4_url text NULL,
  orden integer NOT NULL DEFAULT 1,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.videos_biblioteca ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de videos_biblioteca" ON public.videos_biblioteca
  FOR SELECT USING (true);

CREATE POLICY "Escritura de videos_biblioteca para admin/docente" ON public.videos_biblioteca
  FOR ALL USING (fn_rol_actual() IN ('admin', 'docente'));

-- ============================================================
-- DATOS: Osteología (con youtube_id + imagen PNG + PDF)
-- Carpeta Storage: esquemas/osteologia/  y  resumenes-pdf/osteologia/
-- Nombre de archivos: TEMA 1.IMAGEN.png  (sin espacio antes de IMAGEN)
-- ============================================================
INSERT INTO public.videos_biblioteca
  (categoria, tema, youtube_id, duracion, imagen_descarga_url, pdf_resumen_url, video_mp4_url, orden, activo)
VALUES
  ('osteologia', 'Introducción ósea de cabeza y cuello', 'ynqKH0HhvhA', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/osteologia/TEMA%201.IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/TEMA%201.IMAGEN.pdf',
   NULL, 1, true),
  ('osteologia', 'Huesos del cráneo', 'mxS2AhtTZk8', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/osteologia/TEMA%202.IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/TEMA%202.IMAGEN.pdf',
   NULL, 2, true),
  ('osteologia', 'Huesos de la cara', 'eh705mT19RE', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/osteologia/TEMA%203.IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/TEMA%203.IMAGEN.pdf',
   NULL, 3, true),
  ('osteologia', 'Cavidades craneales', 'kseadlL8Wss', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/osteologia/TEMA%204.IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/TEMA%204.IMAGEN.pdf',
   NULL, 4, true),
  ('osteologia', 'Articulación temporomandibular (ATM)', 'cv4WO4tWlMY', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/osteologia/TEMA%205.IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/TEMA%205.IMAGEN.pdf',
   NULL, 5, true),
  ('osteologia', 'Base del cráneo', 'IZcNpqoVJ0I', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/osteologia/TEMA%206.IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/TEMA%206.IMAGEN.pdf',
   NULL, 6, true);

-- ============================================================
-- DATOS: Miología (con youtube_id + imagen PNG + PDF)
-- Carpeta Storage: esquemas/miologia/  y  resumenes-pdf/miologia/
-- Nombre de archivos: TEMA 1. IMAGEN.png  (CON espacio antes de IMAGEN)
-- ============================================================
INSERT INTO public.videos_biblioteca
  (categoria, tema, youtube_id, duracion, imagen_descarga_url, pdf_resumen_url, video_mp4_url, orden, activo)
VALUES
  ('miologia', 'Músculos de cabeza y cuello', 'lKbshe31ddw', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/miologia/TEMA%201.%20IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%201.%20IMAGEN.pdf',
   NULL, 1, true),
  ('miologia', 'Músculos de la masticación', 'xXA8zXqaW6M', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/miologia/TEMA%202.%20IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%202.%20IMAGEN.pdf',
   NULL, 2, true),
  ('miologia', 'Músculos de la expresión facial', 'oKnTt1VYtlQ', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/miologia/TEMA%203.%20IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%203.%20IMAGEN.pdf',
   NULL, 3, true),
  ('miologia', 'Músculos del cuello', 'HdHmHeSKsDA', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/miologia/TEMA%204.%20IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%204.%20IMAGEN.pdf',
   NULL, 4, true),
  ('miologia', 'Irrigación muscular básica', 'AEEOQmfYfFo', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/miologia/TEMA%205.%20IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%205.%20IMAGEN.pdf',
   NULL, 5, true),
  ('miologia', 'Relación muscular y movimiento mandibular', 'wb7dG3anh_A', NULL,
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/esquemas/miologia/TEMA%206.%20IMAGEN.png',
   'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%206.%20IMAGEN.pdf',
   NULL, 6, true);

-- ============================================================
-- DATOS: Órganos de los sentidos (sin video por ahora)
-- ============================================================
INSERT INTO public.videos_biblioteca (categoria, tema, youtube_id, orden, activo) VALUES
  ('organos_sentidos', 'Órbita y globo ocular',                       NULL, 1, true),
  ('organos_sentidos', 'Oído externo, medio e interno',               NULL, 2, true),
  ('organos_sentidos', 'Fosas nasales',                               NULL, 3, true),
  ('organos_sentidos', 'Cavidad oral',                                NULL, 4, true),
  ('organos_sentidos', 'Lengua y glándulas salivales',                NULL, 5, true);

-- ============================================================
-- DATOS: Vías respiratorias (sin video por ahora)
-- ============================================================
INSERT INTO public.videos_biblioteca (categoria, tema, youtube_id, orden, activo) VALUES
  ('vias_respiratorias', 'Faringe',                                          NULL, 1, true),
  ('vias_respiratorias', 'Laringe',                                          NULL, 2, true),
  ('vias_respiratorias', 'Vías respiratorias superiores',                    NULL, 3, true),
  ('vias_respiratorias', 'Relación anatómica digestiva y respiratoria',      NULL, 4, true),
  ('vias_respiratorias', 'Integración anatómica de cabeza y cuello',         NULL, 5, true);

-- ============================================================
-- VERIFICACIÓN — debe mostrar filas por categoría
-- ============================================================
SELECT categoria, COUNT(*) AS total, COUNT(youtube_id) AS con_video,
       COUNT(imagen_descarga_url) AS con_imagen
FROM public.videos_biblioteca
GROUP BY categoria
ORDER BY categoria;
