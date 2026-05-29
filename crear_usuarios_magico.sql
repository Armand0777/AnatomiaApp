-- ==============================================================================
-- ESTE SCRIPT HACE TODO AUTOMÁTICAMENTE:
-- 1. Arregla los triggers.
-- 2. Crea las 2 cuentas (docente y estudiante) con contraseña "12345678".
-- ==============================================================================

-- 1. Habilitar extensión para encriptar contraseñas (necesario en auth.users)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Desactivar el trigger temporalmente para que no haya conflictos en esta inserción
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Insertar los dos usuarios mágicamente
DO $$
DECLARE
  v_docente_id UUID := gen_random_uuid();
  v_estudiante_id UUID := gen_random_uuid();
BEGIN
  -- A. Insertar DOCENTE en auth.users
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    role, aud, confirmation_token
  )
  VALUES 
  (
    v_docente_id, '00000000-0000-0000-0000-000000000000', 'docente@anatomia.com', 
    crypt('12345678', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', '{"nombre":"Profesor Anatomía"}', now(), now(), 
    'authenticated', 'authenticated', ''
  );

  -- B. Insertar ESTUDIANTE en auth.users
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    role, aud, confirmation_token
  )
  VALUES 
  (
    v_estudiante_id, '00000000-0000-0000-0000-000000000000', 'estudiante@anatomia.com', 
    crypt('12345678', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', '{"nombre":"Estudiante Prueba"}', now(), now(), 
    'authenticated', 'authenticated', ''
  );

  -- C. Insertar a ambos en public.usuarios (asociándolos con sus roles reales)
  -- NOTA: Usamos ON CONFLICT por si algún otro trigger ya los insertó automáticamente
  INSERT INTO public.usuarios (id, nombre, email, rol_id, es_invitado, activo)
  VALUES 
  (v_docente_id, 'Profesor Anatomía', 'docente@anatomia.com', 'ca0f5ec0-745a-424d-b988-a7ed1e707758', false, true),
  (v_estudiante_id, 'Estudiante Prueba', 'estudiante@anatomia.com', '7d23f18d-1609-4374-986c-c07c06ce4732', false, true)
  ON CONFLICT (id) DO UPDATE 
  SET rol_id = EXCLUDED.rol_id,
      nombre = EXCLUDED.nombre;

END $$;

-- 4. Volver a crear el trigger ARREGLADO para cuando alguien se registre desde la App
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre, rol_id, es_invitado, activo)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'nombre', 'Nuevo Estudiante'), 
    '7d23f18d-1609-4374-986c-c07c06ce4732', -- Rol de estudiante por defecto
    false, 
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
