DO $$
DECLARE
  v_tema RECORD;
  v_img_url TEXT := 'https://images.unsplash.com/photo-1530213786676-412bd6715045?w=800&q=80'; -- Imagen genérica de cráneo/medicina
  v_vid_url TEXT := 'https://www.youtube.com/watch?v=1-O0y5E1Pbs'; -- Video genérico
BEGIN
  -- Limpiar la tabla multimedia para evitar duplicados si se corre varias veces
  DELETE FROM public.multimedia;

  -- Bucle por cada tema existente en la base de datos
  FOR v_tema IN SELECT id, titulo FROM public.temas LOOP
    
    -- Insertar una imagen para el tema
    INSERT INTO public.multimedia (tema_id, titulo, tipo, url)
    VALUES (
      v_tema.id, 
      'Imagen ilustrativa: ' || v_tema.titulo, 
      'imagen', 
      v_img_url
    );

    -- Insertar un video genérico de YouTube para el tema
    INSERT INTO public.multimedia (tema_id, titulo, tipo, url)
    VALUES (
      v_tema.id, 
      'Video Explicativo: ' || v_tema.titulo, 
      'video', 
      'https://www.youtube.com/watch?v=kYx4u-bV_eU'
    );

  END LOOP;
END $$;
