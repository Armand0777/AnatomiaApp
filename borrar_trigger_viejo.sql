-- 1. Borramos el trigger conflictivo que estaba escondido
DROP TRIGGER IF EXISTS trg_auth_nuevo_usuario ON auth.users;

-- 2. Borramos la función vieja que usaba ese trigger para mantener todo limpio
DROP FUNCTION IF EXISTS public.fn_crear_perfil_usuario();

-- (Opcional) Verificamos que solo haya quedado nuestro trigger correcto
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';
