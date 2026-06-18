// Identidad visual por unidad: un ícono y color temáticos según el contenido
// (osteología, miología, sentidos, vías digestivas/respiratorias), en vez de
// emojis genéricos repetidos (📚 / 💀) para las 4 unidades.
export interface UnidadVisual {
  icon: string;
  color: string;
  bg: string;
}

export const UNIDADES_VISUAL: Record<number, UnidadVisual> = {
  1: { icon: 'bone', color: '#1E88E5', bg: '#E3F2FD' }, // Osteología y configuración cefálica
  2: { icon: 'arm-flex', color: '#43A047', bg: '#E8F5E9' }, // Miología y sistema neurovascular
  3: { icon: 'eye-outline', color: '#FB8C00', bg: '#FFF3E0' }, // Órganos de los sentidos y cavidades
  4: { icon: 'lungs', color: '#8E24AA', bg: '#F3E5F5' }, // Vías digestivas y respiratorias superiores
};

const DEFAULT_VISUAL: UnidadVisual = { icon: 'book-open-page-variant-outline', color: '#757575', bg: '#F5F5F5' };

export function getUnidadVisual(numero: number): UnidadVisual {
  return UNIDADES_VISUAL[numero] || DEFAULT_VISUAL;
}
