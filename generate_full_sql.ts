import fs from 'fs';
import { SEED_DATA } from './src/data/seedData';

let sql = `-- Script SQL para insertar el contenido de AnatomiaApp
-- NOTA: Este script asume que los temas ya existen en la base de datos y busca su ID por el título.
-- Puedes ejecutarlo directamente en el SQL Editor de Supabase.

`;

sql += `
-- Opcional: Limpiar contenido previo para evitar duplicados
-- DELETE FROM contenido_tema;
-- DELETE FROM multimedia;

`;

for (const unidad of SEED_DATA) {
  sql += `\n-- ================================\n`;
  sql += `-- UNIDAD ${unidad.numero}: ${unidad.titulo}\n`;
  sql += `-- ================================\n\n`;

  for (const tema of unidad.temas) {
    sql += `DO $$
DECLARE
  v_tema_id UUID;
BEGIN
  SELECT id INTO v_tema_id FROM temas WHERE titulo = '${tema.titulo.replace(/'/g, "''")}';
  
  IF v_tema_id IS NOT NULL THEN
    -- Contenido Principal
    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', '${tema.contenidoPrincipal.replace(/'/g, "''")}', 1);
    
`;

    // Estructuras
    tema.estructuras.forEach((estr, idx) => {
      sql += `    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'contenido', '${estr.replace(/'/g, "''")}', ${idx + 2});\n`;
    });

    // Funciones
    tema.funciones.forEach((func, idx) => {
      sql += `    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'funciones', '${func.replace(/'/g, "''")}', ${idx + 1});\n`;
    });

    // Relaciones
    tema.relaciones.forEach((rel, idx) => {
      sql += `    INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
    VALUES (v_tema_id, 'relaciones', '${rel.replace(/'/g, "''")}', ${idx + 1});\n`;
    });

    // Resumen (Multimedia)
    const resumenStr = tema.resumenPuntos.join('\\n').replace(/'/g, "''");
    sql += `
    INSERT INTO multimedia (tema_id, tipo, url, titulo, descripcion, activo)
    VALUES (v_tema_id, 'resumen', '#', '${tema.titulo.replace(/'/g, "''")}', E'${resumenStr}', true);
    
  END IF;
END $$;
\n`;
  }
}

fs.writeFileSync('seed.sql', sql);
console.log('SQL generado en seed.sql');
