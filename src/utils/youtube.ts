// Extrae el ID de un video de YouTube a partir de una URL completa o lo
// devuelve tal cual si ya es solo el ID (así el docente puede pegar el link
// completo o solo el ID, y siempre se guarda solo el ID).
export function extraerYoutubeId(input: string): string {
  const texto = input.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = texto.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  return texto;
}
