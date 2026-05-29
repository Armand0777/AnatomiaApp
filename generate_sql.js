const fs = require('fs');

const SEED_DATA = [
  {
    numero: 1,
    titulo: 'Osteología y configuración cefálica',
    temas: [
      {
        orden: 1,
        titulo: 'Introducción anatómica de cabeza y cuello',
        contenidoPrincipal: 'La anatomía de cabeza y cuello estudia las estructuras óseas, musculares, nerviosas y funcionales que conforman esta región del cuerpo humano.',
        estructuras: ['Posición anatómica', 'Planos anatómicos', 'Regiones anatómicas', 'Terminología anatómica básica'],
        funciones: ['Orientar el estudio anatómico', 'Facilitar la identificación de estructuras', 'Comprender la organización corporal', 'Relacionar estructuras anatómicas básicas'],
        relaciones: ['Relación entre cabeza y cuello', 'Relación entre estructuras óseas y musculares', 'Relación anatómica funcional básica']
      }
    ]
  }
];

let sql = `-- Script SQL para insertar un ejemplo de contenido
-- Asegúrate de que los temas ya existan en la tabla 'temas'

`;

sql += `INSERT INTO contenido_tema (tema_id, tipo, cuerpo, orden)
SELECT id, 'contenido', 'La anatomía de cabeza y cuello...', 1 FROM temas WHERE titulo = 'Introducción anatómica de cabeza y cuello';\n`;

fs.writeFileSync('seed.sql', sql);
