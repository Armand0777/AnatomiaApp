-- 1. Creamos (o reemplazamos) la función del trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre, rol_id, es_invitado, activo)
  VALUES (
    new.id, 
    new.email, 
    -- Toma el nombre que viene del registro, si no hay, pone 'Nuevo Estudiante'
    COALESCE(new.raw_user_meta_data->>'nombre', 'Nuevo Estudiante'), 
    '7d23f18d-1609-4374-986c-c07c06ce4732', -- ID EXACTO del rol "estudiante"
    false, 
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Borramos el trigger anterior si existía (para evitar duplicados o conflictos)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Creamos el trigger para que escuche cada vez que se inserta en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
