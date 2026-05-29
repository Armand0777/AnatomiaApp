DO $$
DECLARE
  v_tema RECORD;
  v_resumen_texto TEXT := 'Este es un resumen de prueba.
Aprenderás sobre las estructuras principales.
Recuerda repasar los puntos clave antes del examen.';
BEGIN
  -- Bucle por cada tema existente
  FOR v_tema IN SELECT id, titulo FROM public.temas LOOP
    
    -- Insertar un resumen falso si no existe uno
    IF NOT EXISTS (SELECT 1 FROM public.multimedia WHERE tema_id = v_tema.id AND tipo = 'resumen') THEN
      INSERT INTO public.multimedia (tema_id, titulo, tipo, url, descripcion)
      VALUES (
        v_tema.id, 
        'Resumen: ' || v_tema.titulo, 
        'resumen', 
        '-',
        v_resumen_texto
      );
    END IF;

  END LOOP;
END $$;
