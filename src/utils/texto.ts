// Convierte un título en un slug en minúsculas con guiones bajos, sin
// tildes ni espacios. Ej: "Maxilar Superior" -> "maxilar_superior"
export function generarSlug(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes (marcas diacríticas tras normalize NFD)
    .replace(/[^a-z0-9\s]/g, '') // quita signos de puntuación
    .replace(/\s+/g, '_');
}
