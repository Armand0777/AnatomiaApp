-- ============================================================
-- VERIFICACIÓN: ¿existe la tabla videos_biblioteca, la función
-- fn_rol_actual() y la política de escritura para admin/docente?
-- Ejecuta esto en el SQL Editor de Supabase y revisa cada resultado.
-- ============================================================

-- 1. ¿Existe la tabla?
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'videos_biblioteca'
) AS tabla_existe;

-- 2. ¿Existe la función fn_rol_actual()?
SELECT EXISTS (
  SELECT 1 FROM pg_proc WHERE proname = 'fn_rol_actual'
) AS funcion_existe;

-- 3. ¿Qué políticas RLS tiene la tabla en este momento?
--    Debe aparecer al menos una de SELECT (lectura) y una de
--    INSERT/UPDATE/DELETE o ALL (escritura) para admin/docente.
SELECT policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'videos_biblioteca';

-- 4. ¿RLS está habilitado en la tabla?
SELECT relrowsecurity AS rls_habilitado
FROM pg_class
WHERE relname = 'videos_biblioteca';
