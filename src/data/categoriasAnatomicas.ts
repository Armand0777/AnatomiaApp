import { CategoriaAnatomica } from '../types';

export interface CategoriaInfo {
  categoria: CategoriaAnatomica;
  titulo: string;
  icono: string;
}

// Las 4 categorías temáticas que comparten Esquemas y Videos de la Biblioteca
export const CATEGORIAS_ANATOMICAS: CategoriaInfo[] = [
  { categoria: 'osteologia', titulo: 'Osteología', icono: '🦴' },
  { categoria: 'miologia', titulo: 'Miología', icono: '💪' },
  { categoria: 'organos_sentidos', titulo: 'Órganos de los sentidos', icono: '👁️' },
  { categoria: 'vias_respiratorias', titulo: 'Vías respiratorias superiores', icono: '🫁' },
];
