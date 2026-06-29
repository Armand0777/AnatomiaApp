-- Verifica si el bucket "esquemas" de Storage ya existe y si es público.
-- Ejecuta esto en el SQL Editor de Supabase.
SELECT id, name, public
FROM storage.buckets
WHERE name = 'esquemas';
