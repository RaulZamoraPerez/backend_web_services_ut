import Carrera from '../src/models/Carrera';
import { connectDatabase } from '../src/config/database';

const carrerasData = [
  // TSU - Técnico Superior Universitario
  {
    nombre: 'Tecnologías de la Información y Comunicación',
    siglas: 'TSU TIC',
    nivel: 'TSU',
    modalidad: 'Escolarizada',
    duracion: '2 años (6 cuatrimestres)',
    objetivo: 'Formar profesionistas capaces de diseñar, implementar y administrar infraestructura tecnológica, desarrollar software de aplicación, administrar sistemas de información y gestionar redes computacionales, aplicando estándares y metodologías para satisfacer las necesidades del sector productivo.',
    perfil_ingreso: 'Interés por la tecnología y la informática. Habilidades matemáticas y lógicas. Capacidad de análisis y resolución de problemas. Facilidad para trabajar en equipo. Disposición para el aprendizaje continuo.',
    perfil_egreso: 'Diseña, implementa y administra infraestructura de redes convergentes. Desarrolla aplicaciones web y móviles. Administra bases de datos y servidores. Implementa soluciones de ciberseguridad. Gestiona proyectos de TI. Proporciona soporte técnico especializado.',
    campo_laboral: 'Empresas de desarrollo de software. Departamentos de TI de organizaciones públicas y privadas. Empresas de telecomunicaciones. Consultorías tecnológicas. Instituciones financieras. Emprendimiento tecnológico.',
    imagen: 'tic-tsu.jpg',
    orden: 1,
    activo: true
  },
  {
    nombre: 'Administración',
    siglas: 'TSU ADM',
    nivel: 'TSU',
    modalidad: 'Escolarizada',
    duracion: '2 años (6 cuatrimestres)',
    objetivo: 'Formar profesionistas competentes en la gestión administrativa de organizaciones, con capacidad para planear, organizar, dirigir y controlar los recursos empresariales, aplicando técnicas y herramientas modernas de administración.',
    perfil_ingreso: 'Habilidades de liderazgo y comunicación. Capacidad de análisis y toma de decisiones. Interés por los negocios y la administración. Habilidades numéricas. Trabajo en equipo.',
    perfil_egreso: 'Administra recursos humanos, materiales y financieros. Elabora y evalúa proyectos de inversión. Diseña estrategias de mercadotecnia. Gestiona procesos administrativos. Aplica normatividad empresarial. Implementa sistemas de calidad.',
    campo_laboral: 'Empresas industriales, comerciales y de servicios. Instituciones gubernamentales. Despachos de consultoría administrativa. Áreas de recursos humanos. Departamentos de mercadotecnia. Emprendimiento de negocios propios.',
    imagen: 'admin-tsu.jpg',
    orden: 2,
    activo: true
  },
  {
    nombre: 'Procesos Industriales',
    siglas: 'TSU PI',
    nivel: 'TSU',
    modalidad: 'Escolarizada',
    duracion: '2 años (6 cuatrimestres)',
    objetivo: 'Formar técnicos superiores universitarios capaces de coordinar y supervisar procesos de manufactura, implementar sistemas de calidad y productividad, y gestionar la producción en empresas industriales mediante el uso de tecnologías y metodologías actuales.',
    perfil_ingreso: 'Habilidades matemáticas y físicas. Capacidad de análisis y resolución de problemas. Interés por la industria y la manufactura. Habilidad para trabajar en equipo. Disposición para trabajo en campo y laboratorio.',
    perfil_egreso: 'Supervisa procesos de manufactura. Implementa sistemas de gestión de calidad. Coordina programas de producción. Aplica técnicas de mejora continua. Gestiona el mantenimiento industrial. Optimiza procesos productivos.',
    campo_laboral: 'Industria manufacturera. Empresas de producción. Áreas de calidad y producción. Empresas de manufactura automotriz. Industria alimentaria. Empresas de transformación de materiales.',
    imagen: 'procesos-tsu.jpg',
    orden: 3,
    activo: true
  },
  {
    nombre: 'Energías Renovables',
    siglas: 'TSU ER',
    nivel: 'TSU',
    modalidad: 'Escolarizada',
    duracion: '2 años (6 cuatrimestres)',
    objetivo: 'Formar profesionales técnicos especializados en el diseño, instalación, operación y mantenimiento de sistemas de energías renovables, contribuyendo al desarrollo sustentable y la transición energética del país.',
    perfil_ingreso: 'Interés por el medio ambiente y sustentabilidad. Habilidades matemáticas y físicas. Capacidad de análisis. Disposición para trabajo de campo. Compromiso con el desarrollo sustentable.',
    perfil_egreso: 'Diseña e instala sistemas fotovoltaicos. Implementa sistemas de energía eólica. Gestiona proyectos de energías renovables. Realiza estudios de factibilidad energética. Mantenimiento de sistemas alternativos de energía. Evalúa el impacto ambiental de proyectos energéticos.',
    campo_laboral: 'Empresas de instalación de paneles solares. Proyectos de energía eólica. Consultorías en energías renovables. Dependencias gubernamentales de energía. Empresas de construcción sustentable. Emprendimiento en soluciones energéticas.',
    imagen: 'energias-tsu.jpg',
    orden: 4,
    activo: true
  },
  {
    nombre: 'Contaduría',
    siglas: 'TSU CON',
    nivel: 'TSU',
    modalidad: 'Escolarizada',
    duracion: '2 años (6 cuatrimestres)',
    objetivo: 'Formar técnicos superiores universitarios competentes en el registro, análisis e interpretación de información financiera, fiscal y contable de las organizaciones, aplicando la normatividad vigente y utilizando tecnologías de información.',
    perfil_ingreso: 'Habilidades numéricas y matemáticas. Capacidad de análisis y organización. Ética profesional. Atención al detalle. Manejo básico de computadoras.',
    perfil_egreso: 'Registra operaciones contables. Elabora estados financieros. Calcula impuestos y cumple obligaciones fiscales. Analiza información financiera. Utiliza software contable. Gestiona nóminas y recursos financieros.',
    campo_laboral: 'Despachos contables y fiscales. Departamentos de contabilidad de empresas. Instituciones financieras. Empresas de auditoría. Dependencias gubernamentales. Asesoría fiscal independiente.',
    imagen: 'contaduria-tsu.jpg',
    orden: 5,
    activo: true
  },

  // INGENIERÍAS
  {
    nombre: 'Ingeniería en Tecnologías de la Información y Comunicación',
    siglas: 'ING TIC',
    nivel: 'Ingenieria',
    modalidad: 'Escolarizada',
    duracion: '2 años adicionales (5 cuatrimestres)',
    objetivo: 'Formar ingenieros capaces de diseñar, desarrollar, implementar y administrar sistemas de información y comunicaciones, utilizando tecnologías emergentes para generar soluciones innovadoras que contribuyan al desarrollo tecnológico y competitivo de las organizaciones.',
    perfil_ingreso: 'Título de TSU en área relacionada. Conocimientos sólidos de programación. Comprensión de redes y sistemas. Habilidades de análisis y diseño. Capacidad de innovación.',
    perfil_egreso: 'Desarrolla sistemas de información empresariales. Diseña arquitecturas de software escalables. Implementa soluciones de inteligencia artificial. Gestiona proyectos tecnológicos complejos. Administra infraestructura en la nube. Lidera equipos de desarrollo. Innova en soluciones tecnológicas.',
    campo_laboral: 'Empresas de tecnología multinacionales. Startups tecnológicas. Centros de investigación. Industria 4.0. Consultoría tecnológica especializada. Direcciones de TI. Emprendimiento tech.',
    imagen: 'ing-tic.jpg',
    orden: 11,
    activo: true
  },
  {
    nombre: 'Ingeniería en Gestión Empresarial',
    siglas: 'ING GE',
    nivel: 'Ingenieria',
    modalidad: 'Escolarizada',
    duracion: '2 años adicionales (5 cuatrimestres)',
    objetivo: 'Formar ingenieros capaces de diseñar, crear, gestionar, desarrollar, fortalecer y dirigir organizaciones productivas, sociales y de servicios, mediante la aplicación de técnicas y herramientas de ingeniería, con visión emprendedora, ética y de responsabilidad social.',
    perfil_ingreso: 'Título de TSU en Administración o afín. Conocimientos en gestión empresarial. Habilidades de liderazgo. Visión estratégica. Capacidad emprendedora.',
    perfil_egreso: 'Diseña e implementa estrategias empresariales. Gestiona cadenas de suministro. Dirige proyectos de inversión. Desarrolla planes de negocio. Implementa sistemas de gestión de calidad. Lidera procesos de innovación organizacional. Toma decisiones estratégicas basadas en datos.',
    campo_laboral: 'Dirección general de empresas. Gerencias de áreas funcionales. Consultoría de negocios. Desarrollo de proyectos de inversión. Emprendimiento empresarial. Organismos públicos y privados. Direcciones de operaciones.',
    imagen: 'ing-gestion.jpg',
    orden: 12,
    activo: true
  },
  {
    nombre: 'Ingeniería en Procesos Bioalimentarios',
    siglas: 'ING PBA',
    nivel: 'Ingenieria',
    modalidad: 'Escolarizada',
    duracion: '2 años adicionales (5 cuatrimestres)',
    objetivo: 'Formar ingenieros especializados en el procesamiento, transformación, conservación y control de calidad de alimentos, aplicando tecnologías sustentables e innovadoras para garantizar la seguridad alimentaria y el desarrollo de productos bioalimentarios competitivos.',
    perfil_ingreso: 'Título de TSU en área relacionada. Interés por la industria alimentaria. Conocimientos de química y biología. Compromiso con la calidad e inocuidad. Pensamiento innovador.',
    perfil_egreso: 'Diseña procesos de transformación de alimentos. Implementa sistemas de gestión de inocuidad. Desarrolla productos alimentarios innovadores. Gestiona plantas procesadoras. Asegura la calidad en la cadena alimentaria. Aplica biotecnología alimentaria. Optimiza procesos bioalimentarios.',
    campo_laboral: 'Industria alimentaria. Empresas procesadoras de alimentos. Laboratorios de control de calidad. Organismos de certificación. Investigación y desarrollo. Consultoría en inocuidad alimentaria. Emprendimiento en alimentos procesados.',
    imagen: 'ing-bioalimentarios.jpg',
    orden: 13,
    activo: true
  },
  {
    nombre: 'Ingeniería en Energías Renovables',
    siglas: 'ING ER',
    nivel: 'Ingenieria',
    modalidad: 'Escolarizada',
    duracion: '2 años adicionales (5 cuatrimestres)',
    objetivo: 'Formar ingenieros especializados en el desarrollo, implementación y gestión de proyectos de energías renovables, capaces de proponer soluciones sustentables que contribuyan a la transición energética y al cuidado del medio ambiente.',
    perfil_ingreso: 'Título de TSU en Energías Renovables o afín. Conocimientos sólidos de sistemas energéticos. Compromiso ambiental. Habilidades de diseño e innovación. Visión de sustentabilidad.',
    perfil_egreso: 'Desarrolla proyectos de generación de energía limpia. Diseña sistemas híbridos de energía. Gestiona parques eólicos y solares. Evalúa viabilidad técnico-económica de proyectos energéticos. Implementa sistemas de almacenamiento de energía. Lidera la transición energética en organizaciones. Investiga nuevas tecnologías energéticas.',
    campo_laboral: 'Grandes proyectos de energía renovable. Empresas generadoras de electricidad. Consultorías especializadas en energía. Organismos gubernamentales de energía. Investigación y desarrollo tecnológico. Gestión de proyectos internacionales. Emprendimiento en energías limpias.',
    imagen: 'ing-energias.jpg',
    orden: 14,
    activo: true
  },

  // LICENCIATURAS (Ejecutivas)
  {
    nombre: 'Licenciatura en Innovación de Negocios y Mercadotecnia',
    siglas: 'LIC INM',
    nivel: 'Licenciatura',
    modalidad: 'Ejecutiva',
    duracion: '2 años adicionales (5 cuatrimestres)',
    objetivo: 'Formar profesionales capaces de diseñar estrategias innovadoras de negocios y mercadotecnia, utilizando herramientas digitales y análisis de mercado para impulsar el crecimiento y competitividad de las organizaciones en entornos globales y dinámicos.',
    perfil_ingreso: 'Título de TSU en Administración o afín. Experiencia laboral deseable. Interés en marketing digital. Visión emprendedora. Creatividad e innovación.',
    perfil_egreso: 'Diseña estrategias de marketing digital. Desarrolla modelos de negocio innovadores. Gestiona marcas y posicionamiento. Analiza comportamiento del consumidor. Implementa estrategias de comercio electrónico. Lidera proyectos de transformación digital. Innova en experiencias del cliente.',
    campo_laboral: 'Agencias de marketing y publicidad. Áreas de mercadotecnia de empresas. Comercio electrónico. Gestión de marcas. Consultoría en negocios. Emprendimiento digital. Startups y empresas innovadoras.',
    imagen: 'lic-innovacion.jpg',
    orden: 21,
    activo: true
  },
  {
    nombre: 'Licenciatura en Gestión del Capital Humano',
    siglas: 'LIC GCH',
    nivel: 'Licenciatura',
    modalidad: 'Ejecutiva',
    duracion: '2 años adicionales (5 cuatrimestres)',
    objetivo: 'Formar profesionales especializados en la gestión estratégica del talento humano, capaces de diseñar e implementar políticas de desarrollo organizacional, clima laboral y gestión por competencias que fortalezcan el capital humano como ventaja competitiva.',
    perfil_ingreso: 'Título de TSU en Administración o afín. Habilidades de comunicación y liderazgo. Interés por el desarrollo humano. Empatía y capacidad de negociación. Experiencia laboral recomendada.',
    perfil_egreso: 'Diseña estrategias de gestión del talento. Implementa sistemas de compensación y beneficios. Gestiona el clima y cultura organizacional. Desarrolla programas de capacitación. Aplica coaching y desarrollo organizacional. Administra relaciones laborales. Lidera procesos de cambio organizacional.',
    campo_laboral: 'Direcciones de recursos humanos. Consultorías en capital humano. Empresas de capacitación. Áreas de desarrollo organizacional. Headhunters. Coaching ejecutivo. Gestión del talento en multinacionales.',
    imagen: 'lic-capital-humano.jpg',
    orden: 22,
    activo: true
  }
];

async function seedCarreras() {
  try {
    await connectDatabase();
    console.log('✅ Conectado a la base de datos');

    // Limpiar tabla existente
    await Carrera.destroy({ where: {} });
    console.log('🗑️  Datos anteriores eliminados');

    // Insertar carreras
    for (const carreraData of carrerasData) {
      await Carrera.create(carreraData);
      console.log(`✅ Carrera creada: ${carreraData.nombre}`);
    }

    console.log('\n🎉 ¡Seed de carreras completado exitosamente!');
    console.log(`📊 Total de carreras creadas: ${carrerasData.length}`);
    console.log('\n📋 Distribución:');
    console.log(`   - TSU: ${carrerasData.filter(c => c.nivel === 'TSU').length} carreras`);
    console.log(`   - Ingenierías: ${carrerasData.filter(c => c.nivel === 'Ingenieria').length} carreras`);
    console.log(`   - Licenciaturas: ${carrerasData.filter(c => c.nivel === 'Licenciatura').length} carreras`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar seed de carreras:', error);
    process.exit(1);
  }
}

seedCarreras();