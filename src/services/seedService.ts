// Servicio de seed para poblar la base de datos con datos académicos iniciales
// Verifica si ya existen datos antes de insertar

import { supabase } from './supabase';
import { SEED_DATA, SeedTemaData } from '../data/seedData';

/**
 * Ejecuta el seed de la base de datos.
 * Solo inserta datos si la tabla 'unidades' está vacía.
 */
export async function ejecutarSeed(): Promise<void> {
  try {
    // Verificar si ya existen datos en la tabla 'unidades'
    const { count, error: errorConteo } = await supabase
      .from('unidades')
      .select('*', { count: 'exact', head: true });

    if (errorConteo) {
      console.error('❌ Error al verificar datos existentes:', errorConteo.message);
      return;
    }

    if (count !== null && count > 0) {
      console.log(`✅ La base de datos ya contiene ${count} unidad(es). Seed omitido.`);
      return;
    }

    console.log('🌱 Iniciando seed de la base de datos...');

    // Iterar sobre cada unidad del seed
    for (const unidad of SEED_DATA) {
      try {
        // Insertar la unidad y obtener el id generado
        const { data: unidadInsertada, error: errorUnidad } = await supabase
          .from('unidades')
          .insert({
            numero: unidad.numero,
            titulo: unidad.titulo,
            descripcion: unidad.descripcion,
            imagen_url: unidad.emoji,
            activo: true,
          })
          .select()
          .single();

        if (errorUnidad || !unidadInsertada) {
          console.error(`❌ Error al insertar unidad ${unidad.numero}:`, errorUnidad?.message);
          continue;
        }

        const unidadId: string = unidadInsertada.id;
        console.log(`📘 Unidad ${unidad.numero} insertada: "${unidad.titulo}" (${unidadId})`);

        // Insertar los temas de la unidad
        for (const tema of unidad.temas) {
          try {
            await insertarTema(unidadId, tema);
          } catch (errorTema) {
            const mensaje = errorTema instanceof Error ? errorTema.message : String(errorTema);
            console.error(`❌ Error al insertar tema "${tema.titulo}":`, mensaje);
          }
        }
      } catch (errorUnidadGeneral) {
        const mensaje = errorUnidadGeneral instanceof Error ? errorUnidadGeneral.message : String(errorUnidadGeneral);
        console.error(`❌ Error general en unidad ${unidad.numero}:`, mensaje);
      }
    }

    console.log('✅ Seed completado exitosamente.');
  } catch (errorGeneral) {
    const mensaje = errorGeneral instanceof Error ? errorGeneral.message : String(errorGeneral);
    console.error('❌ Error general en el seed:', mensaje);
  }
}

/**
 * Inserta un tema y todo su contenido asociado (contenido_tema y multimedia).
 */
async function insertarTema(unidadId: string, tema: SeedTemaData): Promise<void> {
  // Insertar el tema y obtener el id generado
  const { data: temaInsertado, error: errorTema } = await supabase
    .from('temas')
    .insert({
      unidad_id: unidadId,
      titulo: tema.titulo,
      orden: tema.orden,
      activo: true,
    })
    .select()
    .single();

  if (errorTema || !temaInsertado) {
    console.error(`❌ Error al insertar tema "${tema.titulo}":`, errorTema?.message);
    return;
  }

  const temaId: string = temaInsertado.id;
  console.log(`  📝 Tema ${tema.orden} insertado: "${tema.titulo}" (${temaId})`);

  // Insertar contenido del tema
  await insertarContenidoTema(temaId, tema);

  // Insertar multimedia (resumen)
  await insertarMultimedia(temaId, tema);
}

/**
 * Inserta los registros de contenido_tema para un tema dado.
 * Incluye: contenido principal, estructuras, funciones y relaciones.
 */
async function insertarContenidoTema(temaId: string, tema: SeedTemaData): Promise<void> {
  const registrosContenido: Array<{
    tema_id: string;
    tipo: string;
    orden: number;
    cuerpo: string;
  }> = [];

  // Contenido principal (tipo='contenido', orden=1)
  registrosContenido.push({
    tema_id: temaId,
    tipo: 'contenido',
    orden: 1,
    cuerpo: tema.contenidoPrincipal,
  });

  // Estructuras (tipo='contenido', orden=2+)
  tema.estructuras.forEach((estructura, index) => {
    registrosContenido.push({
      tema_id: temaId,
      tipo: 'contenido',
      orden: index + 2,
      cuerpo: estructura,
    });
  });

  // Funciones (tipo='funciones', orden=1+)
  tema.funciones.forEach((funcion, index) => {
    registrosContenido.push({
      tema_id: temaId,
      tipo: 'funciones',
      orden: index + 1,
      cuerpo: funcion,
    });
  });

  // Relaciones (tipo='relaciones', orden=1+)
  tema.relaciones.forEach((relacion, index) => {
    registrosContenido.push({
      tema_id: temaId,
      tipo: 'relaciones',
      orden: index + 1,
      cuerpo: relacion,
    });
  });

  // Insertar todos los registros de contenido
  const { error: errorContenido } = await supabase
    .from('contenido_tema')
    .insert(registrosContenido);

  if (errorContenido) {
    console.error(`  ❌ Error al insertar contenido de "${tema.titulo}":`, errorContenido.message);
  } else {
    console.log(`    📄 ${registrosContenido.length} registros de contenido insertados`);
  }
}

/**
 * Inserta el registro de multimedia (resumen) para un tema dado.
 */
async function insertarMultimedia(temaId: string, tema: SeedTemaData): Promise<void> {
  const { error: errorMultimedia } = await supabase
    .from('multimedia')
    .insert({
      tema_id: temaId,
      tipo: 'resumen',
      url: '#',
      titulo: tema.titulo,
      descripcion: tema.resumenPuntos.join('\n'),
      activo: true,
    });

  if (errorMultimedia) {
    console.error(`  ❌ Error al insertar multimedia de "${tema.titulo}":`, errorMultimedia.message);
  } else {
    console.log(`    🎬 Multimedia (resumen) insertada`);
  }
}
