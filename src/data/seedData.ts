// Datos académicos para el seed de la base de datos
// Contenido de las 4 unidades y 20 temas de Anatomía de Cabeza y Cuello

export interface SeedTemaData {
  orden: number;
  titulo: string;
  contenidoPrincipal: string;
  estructuras: string[];
  funciones: string[];
  relaciones: string[];
  resumenPuntos: string[];
}

export interface SeedUnidadData {
  numero: number;
  titulo: string;
  emoji: string;
  descripcion: string;
  temas: SeedTemaData[];
}

export const SEED_DATA: SeedUnidadData[] = [
  // ═══════════════════════════════════════════════════════════════
  // UNIDAD 1: Osteología y configuración cefálica
  // ═══════════════════════════════════════════════════════════════
  {
    numero: 1,
    titulo: 'Osteología y configuración cefálica',
    emoji: '💀',
    descripcion: 'Estudio de los huesos del cráneo y la cara',
    temas: [
      {
        orden: 1,
        titulo: 'Introducción anatómica de cabeza y cuello',
        contenidoPrincipal:
          'La anatomía de cabeza y cuello estudia las estructuras óseas, musculares, nerviosas y funcionales que conforman esta región del cuerpo humano. Su estudio permite comprender la organización anatómica y la relación entre las diferentes estructuras.',
        estructuras: [
          'Posición anatómica',
          'Planos anatómicos',
          'Regiones anatómicas',
          'Terminología anatómica básica',
        ],
        funciones: [
          'Orientar el estudio anatómico',
          'Facilitar la identificación de estructuras',
          'Comprender la organización corporal',
          'Relacionar estructuras anatómicas básicas',
        ],
        relaciones: [
          'Relación entre cabeza y cuello',
          'Relación entre estructuras óseas y musculares',
          'Relación anatómica funcional básica',
        ],
        resumenPuntos: [
          'La anatomía estudia las estructuras del cuerpo humano',
          'La región de cabeza y cuello incluye huesos, músculos y nervios',
          'La posición anatómica orienta el estudio corporal',
          'Los planos anatómicos permiten ubicar estructuras',
          'La terminología anatómica facilita la identificación corporal',
        ],
      },
      {
        orden: 2,
        titulo: 'Huesos del cráneo',
        contenidoPrincipal:
          'El cráneo es la estructura ósea que forma la cabeza y protege el encéfalo. Está compuesto por huesos unidos mediante suturas que brindan soporte y protección a las estructuras nerviosas y sensoriales.',
        estructuras: [
          'Frontal',
          'Parietales',
          'Temporales',
          'Occipital',
          'Esfenoides',
          'Etmoides',
        ],
        funciones: [
          'Protección del encéfalo',
          'Formación de cavidades craneales',
          'Soporte estructural de la cabeza',
          'Inserción muscular',
          'Protección de órganos sensoriales',
        ],
        relaciones: [
          'Relación con órbitas y cavidad nasal',
          'Relación con músculos de cabeza y cuello',
          'Relación con mandíbula y columna cervical',
          'Relación con vasos y nervios craneales',
        ],
        resumenPuntos: [
          'El cráneo protege el encéfalo',
          'Está formado por huesos unidos mediante suturas',
          'Los principales huesos son frontal, parietal, temporal y occipital',
          'Forma cavidades craneales y faciales',
          'Participa en soporte estructural e inserción muscular',
        ],
      },
      {
        orden: 3,
        titulo: 'Huesos de la cara',
        contenidoPrincipal:
          'Los huesos de la cara forman el esqueleto facial y participan en la formación de cavidades como la oral, nasal y orbital. También brindan soporte a músculos y estructuras dentales.',
        estructuras: [
          'Maxilar',
          'Mandíbula',
          'Cigomático',
          'Nasales',
          'Palatino',
          'Vómer',
        ],
        funciones: [
          'Formación del esqueleto facial',
          'Soporte dental',
          'Protección de cavidades faciales',
          'Participación en la masticación',
          'Inserción muscular',
        ],
        relaciones: [
          'Relación con cavidad oral y nasal',
          'Relación con músculos de la expresión facial',
          'Relación con articulación temporomandibular',
          'Relación con estructuras dentales',
        ],
        resumenPuntos: [
          'Los huesos faciales forman el esqueleto de la cara',
          'Participan en la formación de cavidades faciales',
          'El maxilar y la mandíbula intervienen en la masticación',
          'Brindan soporte a estructuras dentales',
          'Se relacionan con músculos faciales y cavidad oral',
        ],
      },
      {
        orden: 4,
        titulo: 'Cavidades craneales',
        contenidoPrincipal:
          'Las cavidades craneales contienen estructuras anatómicas relacionadas con funciones sensoriales, nerviosas y respiratorias.',
        estructuras: [
          'Cavidad craneal',
          'Cavidad nasal',
          'Órbitas',
          'Cavidad oral',
        ],
        funciones: [
          'Protección de órganos sensoriales',
          'Paso de estructuras nerviosas y vasculares',
          'Participación respiratoria y digestiva',
          'Organización anatómica de cabeza y cuello',
        ],
        relaciones: [
          'Relación con encéfalo y nervios',
          'Relación con ojos y fosas nasales',
          'Relación con estructuras faciales',
          'Relación con cavidad oral y respiratoria',
        ],
        resumenPuntos: [
          'Las cavidades craneales alojan estructuras anatómicas importantes',
          'Incluyen cavidad craneal, nasal, oral y órbitas',
          'Participan en funciones visuales y respiratorias',
          'Protegen órganos sensoriales',
          'Permiten el paso de nervios y vasos sanguíneos',
        ],
      },
      {
        orden: 5,
        titulo: 'Articulación temporomandibular',
        contenidoPrincipal:
          'La articulación temporomandibular es la estructura que conecta la mandíbula con el hueso temporal. Participa en los movimientos mandibulares necesarios para la masticación y el habla.',
        estructuras: [
          'Cóndilo mandibular',
          'Hueso temporal',
          'Disco articular',
          'Ligamentos',
        ],
        funciones: [
          'Apertura y cierre bucal',
          'Movimientos de masticación',
          'Movimientos mandibulares funcionales',
          'Participación en el habla',
        ],
        relaciones: [
          'Relación con músculos masticatorios',
          'Relación con mandíbula y cráneo',
          'Relación funcional con cavidad oral',
          'Relación con estructuras faciales y musculares',
        ],
        resumenPuntos: [
          'La ATM conecta la mandíbula con el hueso temporal',
          'Participa en apertura y cierre bucal',
          'Permite movimientos de masticación',
          'Se relaciona con músculos masticatorios',
          'Es importante para funciones orales y habla',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIDAD 2: Miología e inervación básica
  // ═══════════════════════════════════════════════════════════════
  {
    numero: 2,
    titulo: 'Miología e inervación básica',
    emoji: '💪',
    descripcion: 'Músculos, nervios y vasos de cabeza y cuello',
    temas: [
      {
        orden: 1,
        titulo: 'Músculos de cabeza y cuello',
        contenidoPrincipal:
          'Los músculos de cabeza y cuello participan en movimientos relacionados con la expresión facial, masticación, deglución y movilidad cervical.',
        estructuras: [
          'Músculos cervicales',
          'Músculos faciales',
          'Músculos masticatorios',
          'Músculos superficiales del cuello',
        ],
        funciones: [
          'Movimientos de cabeza y cuello',
          'Participación en la masticación',
          'Expresión facial',
          'Estabilidad y movilidad cervical',
          'Participación en la deglución',
        ],
        relaciones: [
          'Relación con huesos del cráneo y mandíbula',
          'Relación con vasos y nervios cervicales',
          'Relación con estructuras faciales',
          'Relación con ATM',
        ],
        resumenPuntos: [
          'Los músculos permiten movimientos de cabeza y cuello',
          'Participan en expresión facial y deglución',
          'Incluyen músculos faciales y cervicales',
          'Se relacionan con huesos y nervios',
          'Trabajan coordinadamente en funciones anatómicas',
        ],
      },
      {
        orden: 2,
        titulo: 'Músculos de la masticación',
        contenidoPrincipal:
          'Los músculos de la masticación participan en los movimientos mandibulares necesarios para triturar alimentos.',
        estructuras: [
          'Masetero',
          'Temporal',
          'Pterigoideo medial',
          'Pterigoideo lateral',
        ],
        funciones: [
          'Apertura y cierre mandibular',
          'Movimientos de masticación',
          'Movimientos laterales de la mandíbula',
          'Participación funcional de la ATM',
        ],
        relaciones: [
          'Relación con mandíbula y cráneo',
          'Relación con ATM',
          'Relación con nervio trigémino',
          'Relación con cavidad oral',
        ],
        resumenPuntos: [
          'Los músculos masticatorios permiten movimientos mandibulares',
          'Incluyen masetero, temporal y pterigoideos',
          'Participan en trituración de alimentos',
          'Se relacionan con la ATM',
          'Son fundamentales para la función oral',
        ],
      },
      {
        orden: 3,
        titulo: 'Músculos de la expresión facial',
        contenidoPrincipal:
          'Los músculos de la expresión facial permiten movimientos relacionados con gestos, emociones y comunicación facial.',
        estructuras: [
          'Orbicular de los ojos',
          'Orbicular de los labios',
          'Buccinador',
          'Frontal',
          'Cigomático',
        ],
        funciones: [
          'Expresión facial',
          'Movimientos labiales',
          'Participación en el habla',
          'Protección ocular',
          'Comunicación gestual',
        ],
        relaciones: [
          'Relación con nervio facial',
          'Relación con huesos faciales',
          'Relación con cavidad oral y nasal',
          'Relación con estructuras cutáneas',
        ],
        resumenPuntos: [
          'Los músculos faciales permiten expresiones y gestos',
          'Se localizan alrededor de ojos, nariz y boca',
          'Participan en el habla y comunicación',
          'Se relacionan con el nervio facial',
          'Intervienen en movimientos labiales y oculares',
        ],
      },
      {
        orden: 4,
        titulo: 'Pares craneales básicos',
        contenidoPrincipal:
          'Los pares craneales son nervios que emergen del encéfalo y participan en funciones sensitivas y motoras de cabeza y cuello.',
        estructuras: [
          'Nervio olfatorio',
          'Nervio óptico',
          'Nervio trigémino',
          'Nervio facial',
          'Nervio hipogloso',
        ],
        funciones: [
          'Sensibilidad facial',
          'Movimientos musculares',
          'Función visual y olfatoria',
          'Movimientos linguales',
          'Participación sensorial y motora',
        ],
        relaciones: [
          'Relación con encéfalo y cráneo',
          'Relación con músculos faciales',
          'Relación con órganos sensoriales',
          'Relación con cavidad oral y nasal',
        ],
        resumenPuntos: [
          'Los pares craneales emergen del encéfalo',
          'Participan en funciones sensitivas y motoras',
          'Incluyen nervios óptico, facial y trigémino',
          'Intervienen en visión, sensibilidad y movimiento',
          'Se relacionan con órganos sensoriales',
        ],
      },
      {
        orden: 5,
        titulo: 'Irrigación e inervación de cabeza y cuello',
        contenidoPrincipal:
          'La irrigación e inervación de cabeza y cuello permiten el aporte sanguíneo y la comunicación nerviosa.',
        estructuras: [
          'Arteria carótida',
          'Vena yugular',
          'Nervios cervicales',
          'Nervios craneales básicos',
        ],
        funciones: [
          'Transporte sanguíneo',
          'Drenaje venoso',
          'Comunicación nerviosa',
          'Sensibilidad y movimiento',
          'Regulación funcional anatómica',
        ],
        relaciones: [
          'Relación con músculos cervicales',
          'Relación con cráneo y mandíbula',
          'Relación con órganos sensoriales',
          'Relación con estructuras faciales y cervicales',
        ],
        resumenPuntos: [
          'La irrigación aporta sangre a las estructuras anatómicas',
          'La arteria carótida y vena yugular son estructuras principales',
          'Los nervios permiten sensibilidad y movimiento',
          'Participan en funciones funcionales y sensoriales',
          'Se relacionan con músculos y órganos de cabeza y cuello',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIDAD 3: Órganos de los sentidos y cavidades
  // ═══════════════════════════════════════════════════════════════
  {
    numero: 3,
    titulo: 'Órganos de los sentidos y cavidades',
    emoji: '👁️',
    descripcion: 'Órganos sensoriales y cavidades de la región craneofacial',
    temas: [
      {
        orden: 1,
        titulo: 'Órbita y globo ocular',
        contenidoPrincipal:
          'La órbita es la cavidad ósea que contiene y protege el globo ocular. El ojo es el órgano encargado de la visión.',
        estructuras: [
          'Órbita',
          'Globo ocular',
          'Músculos extraoculares',
          'Nervio óptico',
          'Párpados',
        ],
        funciones: [
          'Protección del globo ocular',
          'Percepción visual',
          'Movimientos oculares',
          'Coordinación visual',
          'Transmisión de estímulos visuales',
        ],
        relaciones: [
          'Relación con huesos faciales',
          'Relación con nervio óptico',
          'Relación con músculos oculares',
          'Relación con cavidad nasal y craneal',
        ],
        resumenPuntos: [
          'La órbita protege el globo ocular',
          'El ojo es el órgano de la visión',
          'Participan músculos oculares y nervio óptico',
          'Permiten movimientos y percepción visual',
          'Se relacionan con cavidad craneal y nasal',
        ],
      },
      {
        orden: 2,
        titulo: 'Oído externo, medio e interno',
        contenidoPrincipal:
          'El oído es el órgano encargado de la audición y equilibrio. Está dividido en oído externo, medio e interno.',
        estructuras: [
          'Pabellón auricular',
          'Conducto auditivo externo',
          'Tímpano',
          'Huesecillos auditivos',
          'Cóclea',
        ],
        funciones: [
          'Audición',
          'Transmisión de ondas sonoras',
          'Equilibrio corporal',
          'Percepción auditiva',
          'Protección de estructuras auditivas',
        ],
        relaciones: [
          'Relación con hueso temporal',
          'Relación con nervios auditivos',
          'Relación con cavidad craneal',
          'Relación con estructuras cervicales',
        ],
        resumenPuntos: [
          'El oído participa en audición y equilibrio',
          'Se divide en oído externo, medio e interno',
          'Incluye tímpano y huesecillos auditivos',
          'Transmite ondas sonoras',
          'Se relaciona con hueso temporal y nervios auditivos',
        ],
      },
      {
        orden: 3,
        titulo: 'Fosas nasales',
        contenidoPrincipal:
          'Las fosas nasales son cavidades anatómicas encargadas del paso del aire y participan en funciones respiratorias y olfatorias.',
        estructuras: [
          'Cornetes nasales',
          'Tabique nasal',
          'Senos paranasales',
          'Mucosa nasal',
        ],
        funciones: [
          'Paso del aire',
          'Filtración respiratoria',
          'Humidificación del aire',
          'Función olfatoria',
          'Protección respiratoria',
        ],
        relaciones: [
          'Relación con cavidad oral',
          'Relación con órbitas',
          'Relación con senos paranasales',
          'Relación con faringe',
        ],
        resumenPuntos: [
          'Las fosas nasales permiten el paso del aire',
          'Participan en funciones respiratorias y olfatorias',
          'Incluyen cornetes y senos paranasales',
          'Filtran y humidifican el aire',
          'Se relacionan con órbitas y faringe',
        ],
      },
      {
        orden: 4,
        titulo: 'Cavidad oral',
        contenidoPrincipal:
          'La cavidad oral es la estructura anatómica donde inicia el proceso digestivo.',
        estructuras: [
          'Labios',
          'Dientes',
          'Encías',
          'Paladar duro y blando',
          'Mucosa oral',
        ],
        funciones: [
          'Masticación',
          'Deglución',
          'Fonación',
          'Participación digestiva',
          'Expresión oral',
        ],
        relaciones: [
          'Relación con lengua y glándulas salivales',
          'Relación con mandíbula y maxilar',
          'Relación con faringe',
          'Relación con músculos faciales',
        ],
        resumenPuntos: [
          'La cavidad oral participa en alimentación y habla',
          'Incluye labios, dientes y paladar',
          'Interviene en masticación y deglución',
          'Se relaciona con lengua y faringe',
          'Forma parte inicial del sistema digestivo',
        ],
      },
      {
        orden: 5,
        titulo: 'Lengua y glándulas salivales',
        contenidoPrincipal:
          'La lengua es un órgano muscular que participa en funciones gustativas y mecánicas. Las glándulas salivales producen saliva para la digestión y lubricación oral.',
        estructuras: [
          'Lengua',
          'Glándula parótida',
          'Glándula submandibular',
          'Glándula sublingual',
        ],
        funciones: [
          'Gustación',
          'Deglución',
          'Producción de saliva',
          'Movimientos linguales',
          'Lubricación oral',
        ],
        relaciones: [
          'Relación con cavidad oral',
          'Relación con músculos linguales',
          'Relación con faringe',
          'Relación con estructuras dentales',
        ],
        resumenPuntos: [
          'La lengua participa en gustación y deglución',
          'Las glándulas salivales producen saliva',
          'Incluyen parótida, submandibular y sublingual',
          'Participan en lubricación oral',
          'Se relacionan con cavidad oral y digestión',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIDAD 4: Vías digestivas y respiratorias superiores
  // ═══════════════════════════════════════════════════════════════
  {
    numero: 4,
    titulo: 'Vías digestivas y respiratorias superiores',
    emoji: '🫁',
    descripcion: 'Estructuras digestivas y respiratorias de la región cervical',
    temas: [
      {
        orden: 1,
        titulo: 'Faringe',
        contenidoPrincipal:
          'La faringe es una estructura muscular que forma parte de los sistemas digestivo y respiratorio. Comunica la cavidad oral y nasal con la laringe y el esófago.',
        estructuras: [
          'Nasofaringe',
          'Orofaringe',
          'Laringofaringe',
        ],
        funciones: [
          'Paso del aire',
          'Paso de alimentos',
          'Participación en la deglución',
          'Comunicación entre cavidades',
          'Protección de vías respiratorias',
        ],
        relaciones: [
          'Relación con cavidad oral y nasal',
          'Relación con laringe y esófago',
          'Relación con estructuras cervicales',
          'Relación con músculos faríngeos',
        ],
        resumenPuntos: [
          'La faringe conecta cavidad oral, nasal y laringe',
          'Participa en funciones digestivas y respiratorias',
          'Se divide en nasofaringe, orofaringe y laringofaringe',
          'Permite paso de aire y alimentos',
          'Se relaciona con estructuras cervicales',
        ],
      },
      {
        orden: 2,
        titulo: 'Laringe',
        contenidoPrincipal:
          'La laringe está ubicada entre la faringe y la tráquea. Participa en funciones respiratorias y fonatorias.',
        estructuras: [
          'Cartílago tiroides',
          'Cartílago cricoides',
          'Epiglotis',
          'Cuerdas vocales',
        ],
        funciones: [
          'Fonación',
          'Paso del aire',
          'Protección respiratoria',
          'Producción de la voz',
          'Participación en la respiración',
        ],
        relaciones: [
          'Relación con faringe y tráquea',
          'Relación con músculos cervicales',
          'Relación con vasos y nervios',
          'Relación con glándula tiroides',
        ],
        resumenPuntos: [
          'La laringe participa en respiración y fonación',
          'Contiene cuerdas vocales y cartílagos laríngeos',
          'Permite producción de la voz',
          'Protege las vías respiratorias',
          'Se relaciona con tráquea y faringe',
        ],
      },
      {
        orden: 3,
        titulo: 'Vías respiratorias superiores',
        contenidoPrincipal:
          'Las vías respiratorias superiores son estructuras encargadas del paso y acondicionamiento del aire.',
        estructuras: [
          'Cavidad nasal',
          'Faringe',
          'Laringe',
        ],
        funciones: [
          'Paso del aire',
          'Filtración respiratoria',
          'Humidificación del aire',
          'Protección de vías respiratorias',
          'Participación en la respiración',
        ],
        relaciones: [
          'Relación con cavidad oral y nasal',
          'Relación con faringe y laringe',
          'Relación con estructuras cervicales',
          'Relación con sistema respiratorio',
        ],
        resumenPuntos: [
          'Las vías respiratorias superiores conducen el aire',
          'Incluyen cavidad nasal, faringe y laringe',
          'Filtran y humidifican el aire inspirado',
          'Participan en respiración',
          'Protegen estructuras respiratorias',
        ],
      },
      {
        orden: 4,
        titulo: 'Relación anatómica digestiva y respiratoria',
        contenidoPrincipal:
          'Las estructuras digestivas y respiratorias de cabeza y cuello trabajan coordinadamente para permitir respiración, alimentación y deglución.',
        estructuras: [
          'Cavidad oral',
          'Faringe',
          'Laringe',
          'Esófago',
        ],
        funciones: [
          'Deglución',
          'Paso del aire y alimentos',
          'Protección respiratoria',
          'Coordinación anatómica funcional',
          'Participación digestiva y respiratoria',
        ],
        relaciones: [
          'Relación entre faringe y laringe',
          'Relación con cavidad oral',
          'Relación con esófago y tráquea',
          'Relación funcional respiratoria y digestiva',
        ],
        resumenPuntos: [
          'Las estructuras digestivas y respiratorias trabajan coordinadamente',
          'Participan en deglución y respiración',
          'Incluyen cavidad oral, faringe y laringe',
          'Permiten paso de aire y alimentos',
          'Mantienen coordinación funcional anatómica',
        ],
      },
      {
        orden: 5,
        titulo: 'Integración anatómica de cabeza y cuello',
        contenidoPrincipal:
          'La integración anatómica de cabeza y cuello comprende la relación funcional entre huesos, músculos, nervios, órganos sensoriales y estructuras digestivas y respiratorias.',
        estructuras: [
          'Cráneo',
          'Músculos faciales y cervicales',
          'Cavidades anatómicas',
          'Órganos sensoriales',
          'Vías digestivas y respiratorias',
        ],
        funciones: [
          'Organización anatómica funcional',
          'Coordinación muscular y nerviosa',
          'Participación respiratoria y digestiva',
          'Protección de órganos sensoriales',
          'Integración funcional de cabeza y cuello',
        ],
        relaciones: [
          'Relación entre huesos y músculos',
          'Relación entre órganos sensoriales y cavidades',
          'Relación entre estructuras digestivas y respiratorias',
          'Relación anatómica general de cabeza y cuello',
        ],
        resumenPuntos: [
          'La cabeza y cuello funcionan de manera integrada',
          'Participan huesos, músculos y órganos sensoriales',
          'Se relacionan estructuras digestivas y respiratorias',
          'Existe coordinación muscular y nerviosa',
          'Mantienen funciones anatómicas de la región craneofacial',
        ],
      },
    ],
  },
];
