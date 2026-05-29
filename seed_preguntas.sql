DO $$
DECLARE
  v_unidad_id UUID;
BEGIN
  -- Buscamos el ID de la primera Unidad (Cabeza y Cuello)
  SELECT id INTO v_unidad_id FROM public.unidades WHERE numero = 1 LIMIT 1;

  IF v_unidad_id IS NOT NULL THEN
    -- Borramos preguntas anteriores de esa unidad para evitar duplicados en pruebas
    DELETE FROM public.preguntas WHERE unidad_id = v_unidad_id;

    -- Pregunta 1
    INSERT INTO public.preguntas (unidad_id, enunciado, opciones, respuesta_correcta, explicacion, dificultad)
    VALUES (
      v_unidad_id, 
      '¿Cuántos huesos conforman el neurocráneo humano?', 
      '[{"id": "a", "texto": "14"}, {"id": "b", "texto": "8"}, {"id": "c", "texto": "22"}, {"id": "d", "texto": "6"}]'::jsonb, 
      1, 
      'El neurocráneo está formado por 8 huesos: 1 frontal, 2 parietales, 2 temporales, 1 occipital, 1 esfenoides y 1 etmoides.', 
      1
    );

    -- Pregunta 2
    INSERT INTO public.preguntas (unidad_id, enunciado, opciones, respuesta_correcta, explicacion, dificultad)
    VALUES (
      v_unidad_id, 
      '¿Qué hueso de la cara es el único móvil?', 
      '[{"id": "a", "texto": "Maxilar superior"}, {"id": "b", "texto": "Cigomático"}, {"id": "c", "texto": "Mandíbula (Maxilar inferior)"}, {"id": "d", "texto": "Vómer"}]'::jsonb, 
      2, 
      'La mandíbula o maxilar inferior es el único hueso móvil de la cabeza, articulándose a través de la articulación temporomandibular.', 
      1
    );

    -- Pregunta 3
    INSERT INTO public.preguntas (unidad_id, enunciado, opciones, respuesta_correcta, explicacion, dificultad)
    VALUES (
      v_unidad_id, 
      '¿Cuál de estos músculos es considerado el principal músculo de la masticación?', 
      '[{"id": "a", "texto": "Masetero"}, {"id": "b", "texto": "Buccinador"}, {"id": "c", "texto": "Esternocleidomastoideo"}, {"id": "d", "texto": "Risorio"}]'::jsonb, 
      0, 
      'El músculo masetero es el músculo masticador más potente, encargado de elevar la mandíbula.', 
      2
    );

    -- Pregunta 4
    INSERT INTO public.preguntas (unidad_id, enunciado, opciones, respuesta_correcta, explicacion, dificultad)
    VALUES (
      v_unidad_id, 
      '¿Por cuál foramen del cráneo pasa la médula espinal?', 
      '[{"id": "a", "texto": "Foramen oval"}, {"id": "b", "texto": "Foramen yugular"}, {"id": "c", "texto": "Foramen magno"}, {"id": "d", "texto": "Foramen redondo"}]'::jsonb, 
      2, 
      'El foramen magno (o agujero magno) ubicado en el hueso occipital es la apertura por donde el encéfalo se conecta con la médula espinal.', 
      2
    );

    -- Pregunta 5
    INSERT INTO public.preguntas (unidad_id, enunciado, opciones, respuesta_correcta, explicacion, dificultad)
    VALUES (
      v_unidad_id, 
      'El hueso hioides se caracteriza por:', 
      '[{"id": "a", "texto": "Articularse directamente con la mandíbula"}, {"id": "b", "texto": "No articularse con ningún otro hueso"}, {"id": "c", "texto": "Ser parte de la columna cervical"}, {"id": "d", "texto": "Formar el paladar duro"}]'::jsonb, 
      1, 
      'El hueso hioides, situado en el cuello, es único porque no se articula directamente con ningún otro hueso, sino que se suspende por músculos y ligamentos.', 
      3
    );

  END IF;
END $$;
