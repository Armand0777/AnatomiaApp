import * as SQLite from 'expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';

// Base de datos local SQLite para que la app funcione sin conexión.
// Parte 1: solo se crean las tablas (espejo del contenido esencial de
// Supabase). La sincronización real de datos llega en la Parte 2.
const NOMBRE_BASE = 'anatomia.db';

let db: SQLiteDatabase | null = null;

// Patrón singleton: la base se abre una sola vez y se reutiliza la instancia
async function obtenerInstancia(): Promise<SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(NOMBRE_BASE);
  }
  return db;
}

export function getDb(): SQLiteDatabase {
  if (!db) {
    throw new Error('La base local todavía no fue inicializada. Llama a initLocalDb() primero.');
  }
  return db;
}

// Crea las tablas locales si no existen. Debe llamarse una sola vez al
// arrancar la app, antes de leer o escribir en la base local.
export async function initLocalDb(): Promise<void> {
  try {
    const instancia = await obtenerInstancia();

    await instancia.execAsync(`
      CREATE TABLE IF NOT EXISTS unidades (
        id TEXT PRIMARY KEY, numero INTEGER, titulo TEXT, descripcion TEXT, imagen_url TEXT, orden INTEGER
      );
      CREATE TABLE IF NOT EXISTS temas (
        id TEXT PRIMARY KEY, unidad_id TEXT, titulo TEXT, orden INTEGER
      );
      CREATE TABLE IF NOT EXISTS contenido_tema (
        id TEXT PRIMARY KEY, tema_id TEXT, tipo TEXT, cuerpo TEXT, orden INTEGER
      );
      CREATE TABLE IF NOT EXISTS preguntas (
        id TEXT PRIMARY KEY, unidad_id TEXT, enunciado TEXT, opciones TEXT,
        respuesta_correcta INTEGER, explicacion TEXT, dificultad INTEGER
      );
      CREATE TABLE IF NOT EXISTS esquemas_interactivos (
        id TEXT PRIMARY KEY, categoria TEXT, tema_key TEXT, titulo TEXT, imagen_url TEXT, orden INTEGER
      );
      CREATE TABLE IF NOT EXISTS etiquetas_esquema (
        id TEXT PRIMARY KEY, esquema_id TEXT, nombre TEXT, descripcion TEXT, icono TEXT,
        pos_x REAL, pos_y REAL, orden INTEGER
      );
      CREATE TABLE IF NOT EXISTS meta (
        clave TEXT PRIMARY KEY, valor TEXT
      );
    `);

    console.log('✅ Base local lista');
  } catch (error) {
    console.error('Error al inicializar la base local:', error);
  }
}

// Helpers para la tabla "meta" (se usará para guardar la fecha de última
// sincronización en la Parte 2).
export async function setMeta(clave: string, valor: string): Promise<void> {
  try {
    const instancia = await obtenerInstancia();
    await instancia.runAsync(
      'INSERT INTO meta (clave, valor) VALUES (?, ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor;',
      [clave, valor]
    );
  } catch (error) {
    console.error(`Error al guardar el valor de meta "${clave}":`, error);
  }
}

export async function getMeta(clave: string): Promise<string | null> {
  try {
    const instancia = await obtenerInstancia();
    const fila = await instancia.getFirstAsync<{ valor: string }>(
      'SELECT valor FROM meta WHERE clave = ?;',
      [clave]
    );
    return fila?.valor ?? null;
  } catch (error) {
    console.error(`Error al leer el valor de meta "${clave}":`, error);
    return null;
  }
}
