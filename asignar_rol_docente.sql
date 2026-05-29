-- 1. Asegúrate de haberte registrado en la app con dos correos, por ejemplo:
--    - docente@anatomia.com
--    - estudiante@anatomia.com
--
-- 2. Una vez registrados, por defecto ambos tendrán el rol de estudiante.
--    Ejecuta este bloque en el SQL Editor de Supabase para convertir a uno de ellos en DOCENTE.

UPDATE public.usuarios 
SET rol_id = 'ca0f5ec0-745a-424d-b988-a7ed1e707758' -- ID exacto de tu rol 'docente'
WHERE email = 'docente@anatomia.com'; -- Pon aquí el correo que quieres que sea docente

-- Para confirmar, puedes ejecutar:
SELECT nombre, email, rol_id FROM public.usuarios;
