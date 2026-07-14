import sequelize from '../config/database';
import BibliotecaLink from './BibliotecaLink';

const links = [
  {
    title: "eLibro - Biblioteca Digital",
    description: "Plataforma de libros electrónicos académicos. Acceso a miles de títulos en español.",
    url: "https://elibro.net/es/lc/uttecam/login_usuario/?next=/es/lc/uttecam/inicio/",
    icon: "BookOpen",
    order: 1
  },
  {
    title: "Biblioteca Colmex",
    description: "Recursos bibliográficos y acervos digitales de El Colegio de México.",
    url: "https://biblioteca.colmex.mx/",
    icon: "Library",
    order: 2
  },
  {
    title: "Contaduría y Administración UNAM",
    description: "Revista internacional de investigación financiera y administrativa.",
    url: "http://www.cya.unam.mx/index.php/cya",
    icon: "FileText",
    order: 3
  },
  {
    title: "Biblioteca RAE",
    description: "Colección bibliográfica y recursos lingüísticos de la Real Academia Española.",
    url: "https://www.rae.es/biblioteca",
    icon: "BookA",
    order: 4
  },
  {
    title: "Biblioteca Virtual Miguel de Cervantes",
    description: "Fondo digital de obras clásicas en lenguas hispánicas.",
    url: "https://www.cervantesvirtual.com/",
    icon: "BookOpen",
    order: 5
  },
  {
    title: "Redalyc",
    description: "Red de Revistas Científicas de América Latina y el Caribe, España y Portugal.",
    url: "https://www.redalyc.org/",
    icon: "Globe",
    order: 6
  },
  {
    title: "SciELO México",
    description: "Biblioteca científica electrónica en línea con acceso abierto.",
    url: "https://scielo.org.mx/",
    icon: "Search",
    order: 7
  },
  {
    title: "Biblioteca Digital UNAM",
    description: "Acceso libre a tesis, libros y revistas de la Universidad Nacional Autónoma de México.",
    url: "https://bidi.unam.mx/acceso-libre",
    icon: "GraduationCap",
    order: 8
  },
  {
    title: "Biblioteca Digital SCJN",
    description: "Acervo jurídico y documental de la Suprema Corte de Justicia de la Nación.",
    url: "https://bibliotecadigital.scjn.gob.mx/",
    icon: "Scale",
    order: 9
  },
  {
    title: "ILCE",
    description: "Recursos educativos del Instituto Latinoamericano de la Comunicación Educativa.",
    url: "https://www.ilce.edu.mx/",
    icon: "MonitorPlay",
    order: 10
  },
  {
    title: "Biblioteca Chapingo",
    description: "Recursos especializados en agronomía y ciencias afines.",
    url: "https://biblioteca.chapingo.mx/biblioteca-digital-3/",
    icon: "Sprout",
    order: 11
  },
  {
    title: "PruebaT",
    description: "Plataforma de aprendizaje y biblioteca digital gratuita de la Fundación Carlos Slim.",
    url: "https://pruebat.org/biblioteca-digital",
    icon: "Laptop",
    order: 12
  },
  {
    title: "Ciencias Agrícolas INIFAP",
    description: "Revista Mexicana de Ciencias Agrícolas.",
    url: "https://cienciasagricolas.inifap.gob.mx/index.php/agricolas",
    icon: "Wheat",
    order: 13
  },
  {
    title: "Recursos Digitales UANL",
    description: "Bases de datos y colecciones de la Universidad Autónoma de Nuevo León.",
    url: "https://recursos.db.uanl.mx/",
    icon: "Database",
    order: 14
  }
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida.');
    await BibliotecaLink.sync({ alter: true });
    
    // Check if table is empty
    const count = await BibliotecaLink.count();
    if (count === 0) {
      console.log('Sembrando datos...');
      await BibliotecaLink.bulkCreate(links);
      console.log('Datos sembrados correctamente.');
    } else {
      console.log('La tabla ya tiene datos.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
};

seed();
