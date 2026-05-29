DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  -- 1. Buscamos el ID del primer tema: "Introducción anatómica de cabeza y cuello"
  SELECT id INTO v_tema_id FROM public.temas WHERE titulo ILIKE '%Introducción anatómica de cabeza y cuello%' LIMIT 1;

  IF v_tema_id IS NOT NULL THEN
    -- 2. Borramos el multimedia genérico que tenga ese tema específico
    DELETE FROM public.multimedia WHERE tema_id = v_tema_id;

    -- 3. Insertamos una Imagen real (Formato .png)
    INSERT INTO public.multimedia (tema_id, titulo, tipo, url, descripcion)
    VALUES (
      v_tema_id, 
      'Huesos del cráneo (Vista lateral)', 
      'imagen', 
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Human_skull_side_bones_es.svg/800px-Human_skull_side_bones_es.svg.png',
      NULL
    );

    -- 4. Insertamos un Video de prueba (Formato .mp4)
    -- NOTA: Uso un video de prueba público, aquí en el futuro pondrás el link .mp4 de tu Storage de Supabase
    INSERT INTO public.multimedia (tema_id, titulo, tipo, url, descripcion)
    VALUES (
      v_tema_id, 
      'Video Explicativo (Ejemplo MP4)', 
      'video', 
      'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
      NULL
    );

    -- 5. Insertamos un Resumen con viñetas reales
    INSERT INTO public.multimedia (tema_id, titulo, tipo, url, descripcion)
    VALUES (
      v_tema_id, 
      'Resumen', 
      'resumen', 
      '-',
      'La cabeza humana contiene 22 huesos en total (sin contar los del oído).
El neurocráneo protege el encéfalo y consta de 8 huesos.
El viscerocráneo forma la cara y consta de 14 huesos.
El cuello actúa como puente de conexión vascular y nerviosa.'
    );

  END IF;
END $$;
