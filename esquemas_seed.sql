-- Seed mínimo: solo los 10 esquemas (sin imagen_url ni etiquetas todavía).
-- Las etiquetas con sus coordenadas (pos_x/pos_y) se agregan una vez que
-- exista la imagen real de cada esquema, para no inventar posiciones.
-- Ejecutar en el SQL Editor de Supabase.

INSERT INTO public.esquemas_interactivos (categoria, tema_key, titulo, orden) VALUES
  ('osteologia', 'huesos_craneo', 'Huesos del cráneo', 1),
  ('osteologia', 'huesos_cara', 'Huesos de la cara', 2),
  ('osteologia', 'cavidades_craneales', 'Cavidades craneales', 3),
  ('osteologia', 'atm', 'Articulación temporomandibular (ATM)', 4),
  ('osteologia', 'base_craneo', 'Base del cráneo', 5),
  ('miologia', 'musculos_masticacion', 'Músculos de la masticación', 1),
  ('miologia', 'musculos_expresion', 'Músculos de la expresión facial', 2),
  ('miologia', 'musculos_cuello', 'Músculos del cuello', 3),
  ('miologia', 'irrigacion_muscular', 'Irrigación muscular básica', 4),
  ('miologia', 'relacion_mandibular', 'Relación muscular y movimiento mandibular', 5)
ON CONFLICT (tema_key) DO NOTHING;
