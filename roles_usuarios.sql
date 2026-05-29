-- Script para agregar Roles Básicos
-- Asegúrate de correr esto en el SQL Editor de Supabase

-- 1. Insertamos los roles si no existen
INSERT INTO public.roles (id, nombre, descripcion, activo)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'estudiante', 'Rol por defecto para los estudiantes.', true),
  ('11111111-1111-1111-1111-111111111111', 'docente', 'Rol de administrador para gestionar contenido.', true)
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- ========================================================
-- ¿CÓMO HACERTE DOCENTE?
-- ========================================================
-- 1. Ve a tu aplicación AnatomiaApp y regístrate con tu correo (si aún no lo has hecho).
-- 2. Una vez que tu cuenta exista, cambia tu correo aquí abajo y ejecuta solo este bloque para volverte DOCENTE:

/*
UPDATE public.usuarios 
SET rol_id = '11111111-1111-1111-1111-111111111111'
WHERE email = 'tu_correo@ejemplo.com';
*/
