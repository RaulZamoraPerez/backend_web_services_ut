// Seed data para la sección 'Nosotros'
// Exporta CONTENIDO_INICIAL que usa `scripts/seed-nosotros.ts`
export const CONTENIDO_INICIAL = {
  politicaIntegral: {
    imageSrc: 'nosotros/general_1761952210799_4116c822a4a1655d910cbc50c09c95a3.png',
    title: 'Política Integral',
    description:
      'Somos una institución comprometida en la formación de profesionistas con responsabilidad social, sentido humano y ético, que en conjunto con la comunidad universitaria, contribuyen al desarrollo sustentable a través de establecimiento de objetivos integrales, actualización e innovación de los programas educativos, gestión de la propiedad intelectual y la mejora continua del Sistema de Gestión Integral.'
  },
  objetivoIntegral:
    'Formar integralmente profesionistas competentes y socialmente responsables, creativos, emprendedores e innovadores, comprometidos con el cuidado del medio ambiente y la sustentabilidad, mediante procesos educativos de calidad y una planta docente con experiencia y sentido humano.',
  vision: {
    imageSrc: 'nosotros/vision_1759772754247.png',
    title: 'Visión',
    description:
      'En el año 2027 ser una institución de excelencia, reconocida nacional e internacionalmente por su eficiencia, pertinencia, inclusión y vinculación con el sector productivo.'
  },
  mision: {
    imageSrc: 'nosotros/general_1761952064258_e361d82abad6d8113e2ec6074b4ef15a.png',
    title: 'Misión',
    description:
      'Brindar servicios educativos, científicos y tecnológicos con calidad, equidad e inclusión, formando profesionistas con alto sentido humano, compromiso social y capacidad para contribuir al desarrollo regional y nacional.'
  },
  valores: {
    imageSrc: 'nosotros/general_1761952189846_0697273e3d61620d3c56851a66ecec60.png',
    title: 'Valores',
    description: [
      'Austeridad',
      'Honestidad',
      'Empatía',
      'Generosidad',
      'Respeto',
      'Tolerancia',
      'Igualdad',
      'Equidad',
      'Justicia',
      'Fraternidad',
      'Compromiso',
      'Bien Común'
    ]
  },
  noDiscriminacion: [
    ['Apariencia Física', 'Cultura', 'Discapacidad', 'Idioma'],
    ['Estado civil', 'Religión', 'Sexo', 'Embarazo'],
    ['Opiniones', 'Origen étnico o nacional', 'Género', 'Edad']
  ]
};

export default CONTENIDO_INICIAL;
