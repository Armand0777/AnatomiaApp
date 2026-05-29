-- Script SQL para insertar el contenido de AnatomiaApp
-- NOTA: Este script asume que los temas ya existen en la base de datos y busca su ID por el título.
-- Puedes ejecutarlo directamente en el SQL Editor de Supabase.


-- Opcional: Limpiar contenido previo para evitar duplicados
-- DELETE FROM contenido_tema;
-- DELETE FROM multimedia;


-- ================================
-- UNIDAD 1: Osteología y configuración cefálica
-- ================================

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Introducción anatómica de cabeza y cuello';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'La anatomía de cabeza y cuello estudia las estructuras óseas, musculares, nerviosas y funcionales que conforman esta región del cuerpo humano. Su estudio permite comprender la organización anatómica y la relación entre las diferentes estructuras.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Posición anatómica', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Planos anatómicos', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Regiones anatómicas', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Terminología anatómica básica', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Orientar el estudio anatómico', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Facilitar la identificación de estructuras', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Comprender la organización corporal', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Relacionar estructuras anatómicas básicas', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación entre cabeza y cuello', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación entre estructuras óseas y musculares', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación anatómica funcional básica', 3);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Introducción anatómica de cabeza y cuello', E'La anatomía estudia las estructuras del cuerpo humano\nLa región de cabeza y cuello incluye huesos, músculos y nervios\nLa posición anatómica orienta el estudio corporal\nLos planos anatómicos permiten ubicar estructuras\nLa terminología anatómica facilita la identificación corporal', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Huesos del cráneo';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'El cráneo es la estructura ósea que forma la cabeza y protege el encéfalo. Está compuesto por huesos unidos mediante suturas que brindan soporte y protección a las estructuras nerviosas y sensoriales.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Frontal', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Parietales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Temporales', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Occipital', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Esfenoides', 6);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Etmoides', 7);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección del encéfalo', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Formación de cavidades craneales', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Soporte estructural de la cabeza', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Inserción muscular', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección de órganos sensoriales', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con órbitas y cavidad nasal', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con músculos de cabeza y cuello', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con mandíbula y columna cervical', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con vasos y nervios craneales', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Huesos del cráneo', E'El cráneo protege el encéfalo\nEstá formado por huesos unidos mediante suturas\nLos principales huesos son frontal, parietal, temporal y occipital\nForma cavidades craneales y faciales\nParticipa en soporte estructural e inserción muscular', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Huesos de la cara';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Los huesos de la cara forman el esqueleto facial y participan en la formación de cavidades como la oral, nasal y orbital. También brindan soporte a músculos y estructuras dentales.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Maxilar', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Mandíbula', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cigomático', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Nasales', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Palatino', 6);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Vómer', 7);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Formación del esqueleto facial', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Soporte dental', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección de cavidades faciales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación en la masticación', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Inserción muscular', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad oral y nasal', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con músculos de la expresión facial', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con articulación temporomandibular', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con estructuras dentales', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Huesos de la cara', E'Los huesos faciales forman el esqueleto de la cara\nParticipan en la formación de cavidades faciales\nEl maxilar y la mandíbula intervienen en la masticación\nBrindan soporte a estructuras dentales\nSe relacionan con músculos faciales y cavidad oral', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Cavidades craneales';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Las cavidades craneales contienen estructuras anatómicas relacionadas con funciones sensoriales, nerviosas y respiratorias.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cavidad craneal', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cavidad nasal', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Órbitas', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cavidad oral', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección de órganos sensoriales', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Paso de estructuras nerviosas y vasculares', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación respiratoria y digestiva', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Organización anatómica de cabeza y cuello', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con encéfalo y nervios', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con ojos y fosas nasales', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con estructuras faciales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad oral y respiratoria', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Cavidades craneales', E'Las cavidades craneales alojan estructuras anatómicas importantes\nIncluyen cavidad craneal, nasal, oral y órbitas\nParticipan en funciones visuales y respiratorias\nProtegen órganos sensoriales\nPermiten el paso de nervios y vasos sanguíneos', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Articulación temporomandibular';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'La articulación temporomandibular es la estructura que conecta la mandíbula con el hueso temporal. Participa en los movimientos mandibulares necesarios para la masticación y el habla.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cóndilo mandibular', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Hueso temporal', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Disco articular', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Ligamentos', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Apertura y cierre bucal', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Movimientos de masticación', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Movimientos mandibulares funcionales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación en el habla', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con músculos masticatorios', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con mandíbula y cráneo', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación funcional con cavidad oral', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con estructuras faciales y musculares', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Articulación temporomandibular', E'La ATM conecta la mandíbula con el hueso temporal\nParticipa en apertura y cierre bucal\nPermite movimientos de masticación\nSe relaciona con músculos masticatorios\nEs importante para funciones orales y habla', true);
    
  END IF;
END $$;


-- ================================
-- UNIDAD 2: Miología e inervación básica
-- ================================

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Músculos de cabeza y cuello';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Los músculos de cabeza y cuello participan en movimientos relacionados con la expresión facial, masticación, deglución y movilidad cervical.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Músculos cervicales', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Músculos faciales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Músculos masticatorios', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Músculos superficiales del cuello', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Movimientos de cabeza y cuello', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación en la masticación', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Expresión facial', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Estabilidad y movilidad cervical', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación en la deglución', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con huesos del cráneo y mandíbula', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con vasos y nervios cervicales', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con estructuras faciales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con ATM', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Músculos de cabeza y cuello', E'Los músculos permiten movimientos de cabeza y cuello\nParticipan en expresión facial y deglución\nIncluyen músculos faciales y cervicales\nSe relacionan con huesos y nervios\nTrabajan coordinadamente en funciones anatómicas', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Músculos de la masticación';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Los músculos de la masticación participan en los movimientos mandibulares necesarios para triturar alimentos.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Masetero', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Temporal', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Pterigoideo medial', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Pterigoideo lateral', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Apertura y cierre mandibular', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Movimientos de masticación', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Movimientos laterales de la mandíbula', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación funcional de la ATM', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con mandíbula y cráneo', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con ATM', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con nervio trigémino', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad oral', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Músculos de la masticación', E'Los músculos masticatorios permiten movimientos mandibulares\nIncluyen masetero, temporal y pterigoideos\nParticipan en trituración de alimentos\nSe relacionan con la ATM\nSon fundamentales para la función oral', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Músculos de la expresión facial';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Los músculos de la expresión facial permiten movimientos relacionados con gestos, emociones y comunicación facial.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Orbicular de los ojos', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Orbicular de los labios', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Buccinador', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Frontal', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cigomático', 6);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Expresión facial', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Movimientos labiales', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación en el habla', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección ocular', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Comunicación gestual', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con nervio facial', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con huesos faciales', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad oral y nasal', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con estructuras cutáneas', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Músculos de la expresión facial', E'Los músculos faciales permiten expresiones y gestos\nSe localizan alrededor de ojos, nariz y boca\nParticipan en el habla y comunicación\nSe relacionan con el nervio facial\nIntervienen en movimientos labiales y oculares', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Pares craneales básicos';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Los pares craneales son nervios que emergen del encéfalo y participan en funciones sensitivas y motoras de cabeza y cuello.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Nervio olfatorio', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Nervio óptico', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Nervio trigémino', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Nervio facial', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Nervio hipogloso', 6);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Sensibilidad facial', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Movimientos musculares', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Función visual y olfatoria', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Movimientos linguales', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación sensorial y motora', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con encéfalo y cráneo', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con músculos faciales', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con órganos sensoriales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad oral y nasal', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Pares craneales básicos', E'Los pares craneales emergen del encéfalo\nParticipan en funciones sensitivas y motoras\nIncluyen nervios óptico, facial y trigémino\nIntervienen en visión, sensibilidad y movimiento\nSe relacionan con órganos sensoriales', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Irrigación e inervación de cabeza y cuello';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'La irrigación e inervación de cabeza y cuello permiten el aporte sanguíneo y la comunicación nerviosa.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Arteria carótida', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Vena yugular', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Nervios cervicales', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Nervios craneales básicos', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Transporte sanguíneo', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Drenaje venoso', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Comunicación nerviosa', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Sensibilidad y movimiento', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Regulación funcional anatómica', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con músculos cervicales', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cráneo y mandíbula', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con órganos sensoriales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con estructuras faciales y cervicales', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Irrigación e inervación de cabeza y cuello', E'La irrigación aporta sangre a las estructuras anatómicas\nLa arteria carótida y vena yugular son estructuras principales\nLos nervios permiten sensibilidad y movimiento\nParticipan en funciones funcionales y sensoriales\nSe relacionan con músculos y órganos de cabeza y cuello', true);
    
  END IF;
END $$;


-- ================================
-- UNIDAD 3: Órganos de los sentidos y cavidades
-- ================================

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Órbita y globo ocular';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'La órbita es la cavidad ósea que contiene y protege el globo ocular. El ojo es el órgano encargado de la visión.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Órbita', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Globo ocular', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Músculos extraoculares', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Nervio óptico', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Párpados', 6);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección del globo ocular', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Percepción visual', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Movimientos oculares', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Coordinación visual', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Transmisión de estímulos visuales', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con huesos faciales', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con nervio óptico', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con músculos oculares', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad nasal y craneal', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Órbita y globo ocular', E'La órbita protege el globo ocular\nEl ojo es el órgano de la visión\nParticipan músculos oculares y nervio óptico\nPermiten movimientos y percepción visual\nSe relacionan con cavidad craneal y nasal', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Oído externo, medio e interno';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'El oído es el órgano encargado de la audición y equilibrio. Está dividido en oído externo, medio e interno.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Pabellón auricular', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Conducto auditivo externo', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Tímpano', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Huesecillos auditivos', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cóclea', 6);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Audición', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Transmisión de ondas sonoras', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Equilibrio corporal', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Percepción auditiva', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección de estructuras auditivas', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con hueso temporal', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con nervios auditivos', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad craneal', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con estructuras cervicales', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Oído externo, medio e interno', E'El oído participa en audición y equilibrio\nSe divide en oído externo, medio e interno\nIncluye tímpano y huesecillos auditivos\nTransmite ondas sonoras\nSe relaciona con hueso temporal y nervios auditivos', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Fosas nasales';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Las fosas nasales son cavidades anatómicas encargadas del paso del aire y participan en funciones respiratorias y olfatorias.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cornetes nasales', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Tabique nasal', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Senos paranasales', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Mucosa nasal', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Paso del aire', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Filtración respiratoria', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Humidificación del aire', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Función olfatoria', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección respiratoria', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad oral', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con órbitas', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con senos paranasales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con faringe', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Fosas nasales', E'Las fosas nasales permiten el paso del aire\nParticipan en funciones respiratorias y olfatorias\nIncluyen cornetes y senos paranasales\nFiltran y humidifican el aire\nSe relacionan con órbitas y faringe', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Cavidad oral';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'La cavidad oral es la estructura anatómica donde inicia el proceso digestivo.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Labios', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Dientes', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Encías', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Paladar duro y blando', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Mucosa oral', 6);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Masticación', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Deglución', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Fonación', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación digestiva', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Expresión oral', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con lengua y glándulas salivales', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con mandíbula y maxilar', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con faringe', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con músculos faciales', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Cavidad oral', E'La cavidad oral participa en alimentación y habla\nIncluye labios, dientes y paladar\nInterviene en masticación y deglución\nSe relaciona con lengua y faringe\nForma parte inicial del sistema digestivo', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Lengua y glándulas salivales';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'La lengua es un órgano muscular que participa en funciones gustativas y mecánicas. Las glándulas salivales producen saliva para la digestión y lubricación oral.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Lengua', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Glándula parótida', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Glándula submandibular', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Glándula sublingual', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Gustación', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Deglución', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Producción de saliva', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Movimientos linguales', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Lubricación oral', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad oral', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con músculos linguales', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con faringe', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con estructuras dentales', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Lengua y glándulas salivales', E'La lengua participa en gustación y deglución\nLas glándulas salivales producen saliva\nIncluyen parótida, submandibular y sublingual\nParticipan en lubricación oral\nSe relacionan con cavidad oral y digestión', true);
    
  END IF;
END $$;


-- ================================
-- UNIDAD 4: Vías digestivas y respiratorias superiores
-- ================================

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Faringe';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'La faringe es una estructura muscular que forma parte de los sistemas digestivo y respiratorio. Comunica la cavidad oral y nasal con la laringe y el esófago.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Nasofaringe', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Orofaringe', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Laringofaringe', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Paso del aire', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Paso de alimentos', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación en la deglución', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Comunicación entre cavidades', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección de vías respiratorias', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad oral y nasal', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con laringe y esófago', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con estructuras cervicales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con músculos faríngeos', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Faringe', E'La faringe conecta cavidad oral, nasal y laringe\nParticipa en funciones digestivas y respiratorias\nSe divide en nasofaringe, orofaringe y laringofaringe\nPermite paso de aire y alimentos\nSe relaciona con estructuras cervicales', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Laringe';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'La laringe está ubicada entre la faringe y la tráquea. Participa en funciones respiratorias y fonatorias.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cartílago tiroides', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cartílago cricoides', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Epiglotis', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cuerdas vocales', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Fonación', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Paso del aire', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección respiratoria', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Producción de la voz', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación en la respiración', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con faringe y tráquea', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con músculos cervicales', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con vasos y nervios', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con glándula tiroides', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Laringe', E'La laringe participa en respiración y fonación\nContiene cuerdas vocales y cartílagos laríngeos\nPermite producción de la voz\nProtege las vías respiratorias\nSe relaciona con tráquea y faringe', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Vías respiratorias superiores';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Las vías respiratorias superiores son estructuras encargadas del paso y acondicionamiento del aire.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cavidad nasal', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Faringe', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Laringe', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Paso del aire', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Filtración respiratoria', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Humidificación del aire', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección de vías respiratorias', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación en la respiración', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad oral y nasal', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con faringe y laringe', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con estructuras cervicales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con sistema respiratorio', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Vías respiratorias superiores', E'Las vías respiratorias superiores conducen el aire\nIncluyen cavidad nasal, faringe y laringe\nFiltran y humidifican el aire inspirado\nParticipan en respiración\nProtegen estructuras respiratorias', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Relación anatómica digestiva y respiratoria';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Las estructuras digestivas y respiratorias de cabeza y cuello trabajan coordinadamente para permitir respiración, alimentación y deglución.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cavidad oral', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Faringe', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Laringe', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Esófago', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Deglución', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Paso del aire y alimentos', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección respiratoria', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Coordinación anatómica funcional', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación digestiva y respiratoria', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación entre faringe y laringe', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con cavidad oral', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación con esófago y tráquea', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación funcional respiratoria y digestiva', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Relación anatómica digestiva y respiratoria', E'Las estructuras digestivas y respiratorias trabajan coordinadamente\nParticipan en deglución y respiración\nIncluyen cavidad oral, faringe y laringe\nPermiten paso de aire y alimentos\nMantienen coordinación funcional anatómica', true);
    
  END IF;
END $$;

DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = 'Integración anatómica de cabeza y cuello';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'La integración anatómica de cabeza y cuello comprende la relación funcional entre huesos, músculos, nervios, órganos sensoriales y estructuras digestivas y respiratorias.', 1);
    
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cráneo', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Músculos faciales y cervicales', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Cavidades anatómicas', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Órganos sensoriales', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', 'Vías digestivas y respiratorias', 6);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Organización anatómica funcional', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Coordinación muscular y nerviosa', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Participación respiratoria y digestiva', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Protección de órganos sensoriales', 4);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', 'Integración funcional de cabeza y cuello', 5);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación entre huesos y músculos', 1);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación entre órganos sensoriales y cavidades', 2);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación entre estructuras digestivas y respiratorias', 3);
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', 'Relación anatómica general de cabeza y cuello', 4);

    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', 'Integración anatómica de cabeza y cuello', E'La cabeza y cuello funcionan de manera integrada\nParticipan huesos, músculos y órganos sensoriales\nSe relacionan estructuras digestivas y respiratorias\nExiste coordinación muscular y nerviosa\nMantienen funciones anatómicas de la región craneofacial', true);
    
  END IF;
END $$;

