// URLs de medios educativos organizados por unidad y tema
// Imágenes de Wikimedia Commons para anatomía de cabeza y cuello

export const MEDIA_LINKS: Record<string, Record<string, { imagen: string; video: string }>> = {
  unidad1: {
    // Osteología y configuración cefálica
    tema1: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Human_skull_side_simplified_%28bones%29.svg/800px-Human_skull_side_simplified_%28bones%29.svg.png',
      video: 'VIDEO_HUESOS_CRANEO',
    },
    tema2: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Anterior_skull_-_bones_%28highlighted%29.png/800px-Anterior_skull_-_bones_%28highlighted%29.png',
      video: 'VIDEO_HUESOS_CARA',
    },
    tema3: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Human_skull_-_inferior_view.png/800px-Human_skull_-_inferior_view.png',
      video: 'VIDEO_CAVIDADES_CRANEALES',
    },
    tema4: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Temporomandibular_joint.jpg/800px-Temporomandibular_joint.jpg',
      video: 'VIDEO_ATM',
    },
    tema5: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Cranial_sutures_-_top_view.png/800px-Cranial_sutures_-_top_view.png',
      video: 'VIDEO_SUTURAS_CRANEALES',
    },
  },
  unidad2: {
    // Miología y sistema neurovascular
    tema1: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Facial_muscles_2.svg/800px-Facial_muscles_2.svg.png',
      video: 'VIDEO_MUSCULOS_FACIALES',
    },
    tema2: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Muscles_of_mastication_-_lateral_view.png/800px-Muscles_of_mastication_-_lateral_view.png',
      video: 'VIDEO_MUSCULOS_MASTICACION',
    },
    tema3: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Brain_human_normal_inferior_view_with_labels_en-2.svg/800px-Brain_human_normal_inferior_view_with_labels_en-2.svg.png',
      video: 'VIDEO_PARES_CRANEALES',
    },
    tema4: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Blausen_0200_CerebralCortex_SuperiorView.png/800px-Blausen_0200_CerebralCortex_SuperiorView.png',
      video: 'VIDEO_SISTEMA_NEUROVASCULAR',
    },
    tema5: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Head_ap_anatomy.jpg/800px-Head_ap_anatomy.jpg',
      video: 'VIDEO_INERVACION_FACIAL',
    },
  },
  unidad3: {
    // Órganos de los sentidos y cavidades
    tema1: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Schematic_diagram_of_the_human_eye_en.svg/800px-Schematic_diagram_of_the_human_eye_en.svg.png',
      video: 'VIDEO_OJO_ORBITA',
    },
    tema2: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Anatomy_of_the_Human_Ear_en.svg/800px-Anatomy_of_the_Human_Ear_en.svg.png',
      video: 'VIDEO_OIDO',
    },
    tema3: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Blausen_0861_Taste_Buds.png/800px-Blausen_0861_Taste_Buds.png',
      video: 'VIDEO_FOSAS_NASALES',
    },
    tema4: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Blausen_0860_Tongue_Anatomy.png/800px-Blausen_0860_Tongue_Anatomy.png',
      video: 'VIDEO_CAVIDAD_ORAL',
    },
    tema5: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Blausen_0653_NoseAnatomy_01.png/800px-Blausen_0653_NoseAnatomy_01.png',
      video: 'VIDEO_LENGUA',
    },
  },
  unidad4: {
    // Aparato digestivo y respiratorio (vías superiores)
    tema1: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Illu_pharynx.jpg/800px-Illu_pharynx.jpg',
      video: 'VIDEO_FARINGE',
    },
    tema2: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Larynx_external_en.svg/800px-Larynx_external_en.svg.png',
      video: 'VIDEO_LARINGE',
    },
    tema3: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Illu_conducting_passages.svg/800px-Illu_conducting_passages.svg.png',
      video: 'VIDEO_VIAS_RESPIRATORIAS',
    },
    tema4: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Illu_esophagus.jpg/800px-Illu_esophagus.jpg',
      video: 'VIDEO_ESOFAGO_SUPERIOR',
    },
    tema5: {
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Blausen_0872_UpperRespiratorySystem.png/800px-Blausen_0872_UpperRespiratorySystem.png',
      video: 'VIDEO_SISTEMA_RESPIRATORIO_SUPERIOR',
    },
  },
};
