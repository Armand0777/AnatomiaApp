import { supabase } from './supabase';
import { SEED_DATA } from '../data/seedData';

export async function poblarContenidoFaltante(): Promise<void> {
  try {
    const { count } = await supabase
      .from('contenido_tema')
      .select('*', { count: 'exact', head: true });

    if (count !== null && count > 0) {
      console.log('✅ El contenido de los temas ya existe. No se requiere acción.');
      return;
    }

    console.log('🌱 Poblando contenido_tema y multimedia para los temas existentes...');

    // Obtener temas existentes
    const { data: temasExistentes, error } = await supabase.from('temas').select('*');
    if (error) throw error;

    for (const unidad of SEED_DATA) {
      for (const temaData of unidad.temas) {
        const temaDb = temasExistentes?.find((t: any) => t.titulo.toLowerCase().trim() === temaData.titulo.toLowerCase().trim());
        
        if (temaDb) {
          const temaId = temaDb.id;
          
          // Preparar los registros
          const registrosContenido: any[] = [];
          
          registrosContenido.push({
            tema_id: temaId,
            tipo: 'contenido',
            orden: 1,
            cuerpo: temaData.contenidoPrincipal,
          });

          temaData.estructuras.forEach((estructura, index) => {
            registrosContenido.push({ tema_id: temaId, tipo: 'contenido', orden: index + 2, cuerpo: estructura });
          });

          temaData.funciones.forEach((funcion, index) => {
            registrosContenido.push({ tema_id: temaId, tipo: 'funciones', orden: index + 1, cuerpo: funcion });
          });

          temaData.relaciones.forEach((relacion, index) => {
            registrosContenido.push({ tema_id: temaId, tipo: 'relaciones', orden: index + 1, cuerpo: relacion });
          });

          // Insertar
          const { error: insertError } = await supabase.from('contenido_tema').insert(registrosContenido);
          if (insertError) {
             console.error('Error insertando contenido para', temaData.titulo, insertError);
             throw insertError;
          }

          // Insertar multimedia (resumen)
          const { error: mediaError } = await supabase.from('multimedia').insert({
            tema_id: temaId,
            tipo: 'resumen',
            url: '#',
            titulo: temaData.titulo,
            descripcion: temaData.resumenPuntos.join('\n'),
            activo: true,
          });

          console.log(`✅ Contenido insertado para el tema: ${temaData.titulo}`);
        } else {
          console.warn(`⚠️ No se encontró en la BD el tema: ${temaData.titulo}`);
        }
      }
    }
    console.log('🎉 Población de contenido faltante terminada.');
  } catch (err) {
    console.error('❌ Error al poblar el contenido:', err);
  }
}
