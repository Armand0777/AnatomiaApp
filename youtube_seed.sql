DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  -- Buscamos el ID del primer tema
  SELECT id INTO v_tema_id FROM public.temas WHERE titulo ILIKE '%Introducción anatómica de cabeza y cuello%' LIMIT 1;

  IF v_tema_id IS NOT NULL THEN
    -- Borramos SOLO los videos anteriores de ese tema (para conservar la imagen y el resumen)
    DELETE FROM public.multimedia WHERE tema_id = v_tema_id AND tipo = 'video';

    -- Insertamos Video 1 de YouTube
    INSERT INTO public.multimedia (tema_id, titulo, tipo, url, descripcion)
    VALUES (
      v_tema_id, 
      'Huesos del cráneo 3D', 
      'video', 
      'https://www.youtube.com/watch?v=kYx4u-bV_eU', -- Ejemplo de un video
      NULL
    );

    -- Insertamos Video 2 de YouTube
    INSERT INTO public.multimedia (tema_id, titulo, tipo, url, descripcion)
    VALUES (
      v_tema_id, 
      'Músculos de la cara anatómicos', 
      'video', 
      'https://www.youtube.com/watch?v=4T1f-N3E-bU', -- Otro ejemplo
      NULL
    );
  END IF;
END $$;
