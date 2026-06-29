// Contenido fijo de la sección "Acerca de" (sin base de datos).
export type SeccionAcerca =
  | { key: string; icono: string; titulo: string; tipo: 'parrafo'; contenido: string }
  | { key: string; icono: string; titulo: string; tipo: 'datos'; contenido: { etiqueta: string; valor: string }[] }
  | { key: string; icono: string; titulo: string; tipo: 'referencias'; contenido: string[] };

export const SECCIONES_ACERCA: SeccionAcerca[] = [
  {
    key: 'objetivo',
    icono: '🎯',
    titulo: 'Objetivo educativo',
    tipo: 'parrafo',
    contenido:
      'Fortalecer el rendimiento académico sobre anatomía de cabeza y cuello de los estudiantes del primer semestre de la carrera de Odontología mediante una aplicación educativa móvil que integre contenidos teóricos, recursos multimedia y actividades de autoevaluación para favorecer un aprendizaje significativo.',
  },
  {
    key: 'info_general',
    icono: '📋',
    titulo: 'Información general del proyecto',
    tipo: 'parrafo',
    contenido:
      'Esta aplicación fue desarrollada como parte de un proyecto de investigación de maestría. Sus contenidos y preguntas de autoevaluación se fundamentan en bibliografía especializada, fueron revisados por docentes del área de Anatomía Humana y se encuentran organizados conforme al plan de estudios de la carrera de Odontología. La aplicación comprende las cuatro primeras unidades temáticas de la asignatura Anatomía Humana I, correspondientes a los contenidos desarrollados durante la primera etapa de formación de los estudiantes.',
  },
  {
    key: 'institucional',
    icono: '🏛️',
    titulo: 'Información institucional',
    tipo: 'datos',
    contenido: [
      { etiqueta: 'Universidad', valor: 'Universidad de Aquino Bolivia (UDABOL)' },
      { etiqueta: 'Facultad', valor: 'Facultad de Ciencias de la Salud' },
      { etiqueta: 'Semestre', valor: 'Primero' },
      { etiqueta: 'Carrera', valor: 'Odontología' },
      { etiqueta: 'Gestión', valor: '2026' },
      { etiqueta: 'Versión de la aplicación', valor: 'Versión 1.0' },
      { etiqueta: 'Programa', valor: 'Maestría en Educación Superior Tecnológica' },
    ],
  },
  {
    key: 'proposito',
    icono: '🎓',
    titulo: 'Propósito académico de la aplicación',
    tipo: 'parrafo',
    contenido:
      'La aplicación Anatomía Cabeza y Cuello V1 constituye un recurso didáctico de apoyo para la asignatura Anatomía Humana I. Su finalidad es complementar el proceso de enseñanza y aprendizaje mediante la metodología basada en mobile learning, proporcionando a los estudiantes acceso a contenidos teóricos, recursos multimedia y actividades de autoevaluación desde dispositivos móviles, favoreciendo el estudio autónomo y el refuerzo de los conocimientos adquiridos en el aula.',
  },
  {
    key: 'referencias',
    icono: '📖',
    titulo: 'Referencias bibliográficas',
    tipo: 'referencias',
    contenido: [
      'Drake, R. L., Vogl, W., & Mitchell, A. W. M. (2023). Gray. Anatomía para estudiantes (5.ª ed.). Elsevier.',
      'Moore, K. L., Dalley, A. F., & Agur, A. M. R. (2023). Anatomía con orientación clínica (9.ª ed.). Wolters Kluwer.',
      'Netter, F. H. (2023). Atlas de anatomía humana (8.ª ed.). Elsevier.',
    ],
  },
  {
    key: 'derechos',
    icono: '🛡️',
    titulo: 'Derechos de uso',
    tipo: 'parrafo',
    contenido:
      'Esta aplicación tiene fines exclusivamente educativos y académicos. Los contenidos se utilizan como apoyo al proceso de enseñanza y aprendizaje de Anatomía Humana I y no sustituyen la bibliografía especializada ni la orientación del docente.',
  },
];
