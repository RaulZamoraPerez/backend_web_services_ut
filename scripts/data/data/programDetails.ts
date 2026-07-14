export interface ProgramDetail {
  programId: number
  videoUrl?: string
  profileImage: string
  educationalObjectives?: string[]
  graduateAttributes?: string[]
  admissionProfile: string
  graduateProfile: string
  competencies?: string[]
  laborField?: string[]
  studyPlan: {
    semester: string
    subjects: string[]
  }[]
}

export const programDetails: ProgramDetail[] = [
  //SOFTWARE
  {
    programId: 1,
    profileImage: "/PORTADASPE/SOFTWARE.jpg",
    videoUrl: "/VIDEOSPE2025/TICS.mp4",

    admissionProfile: `
Habilidades y capacidades del aspirante:
Indagar, analizar, transmitir y comunicar información eficazmente a través del trabajo colaborativo e iniciativa propia para la resolución de problemas metodológicamente, guiando sus actividades con respeto a la diversidad cultural de forma cívica y ética para mejorar su entorno.

Habilidades y capacidades específicas del aspirante:
Pensamiento crítico, conocimientos básicos en matemáticas y ciencias, capacidad de organización para el desarrollo de proyectos e interés en el desarrollo tecnológico.
  `,

    graduateProfile: `
El Ingeniero en Tecnologías de la Información e Innovación Digital posee las competencias profesionales esenciales que respaldan su desempeño en el dinámico entorno laboral, tanto en el ámbito local, como regional y nacional, que le permitan desarrollar soluciones innovadoras de integración de tecnologías de la información mediante metodologías y herramientas de desarrollo de software, redes inteligentes, seguridad informática, internet de las cosas, sistemas inteligentes y administración de proyectos; con base en las normas y estándares aplicables enfocados a atender las áreas de oportunidad y optimizar los procesos y recursos de los diversos sectores empresariales.
  `,

    laborField: [
      "Desarrollador Front-End, Back-End o Full Stack",
      "Desarrollador de aplicaciones móviles",
      "Líder de proyectos de Tecnologías de la Información",
      "Director de proyectos de innovación digital",
      "Desarrollador de videojuegos",
      "Creador de contenidos digitales",
      "Director de negocios digitales",
      "Ingeniero de redes digitales",
      "Ingeniero de cómputo en la nube y virtualización",
      "Ingeniero DevOps",
      "Especialista en ciberseguridad y protección de datos",
      "Integrador de soluciones de infraestructura de redes inteligentes",
      "Líder de proyectos de infraestructura de redes inteligentes y ciberseguridad",
      "Administrador de TI",
      "Auditor de TI",
      "Administrador de redes",
      "Analista de Ciberseguridad",
      "Administrador de bases de datos",
      "Científico de datos",
      "Integrador de proyectos IoT",
      "Integrador de proyectos de Inteligencia Artificial y aprendizaje automático",
      "Consultor de proyectos de Tecnologías de la Información",
      "Educador tecnológico",
      "Ingeniero de calidad de software y pruebas",
      "Ingeniero de soporte y servicios",
      "Director de TI",
      "Arquitecto de software",
      "Diseñador de experiencia de usuario"
    ],

    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Fundamentos de Redes",
          "Física",
          "Fundamentos de Programación",
          "Comunicación y Habilidades Digitales"
        ],
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Cálculo Diferencial",
          "Conmutación y Enrutamiento de Redes",
          "Probabilidad y Estadística",
          "Programación Estructurada",
          "Sistemas Operativos"
        ],
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Cálculo Integral",
          "Tópicos de Calidad para el Diseño de Software",
          "Bases de Datos",
          "Programación Orientada a Objetos",
          "Proyecto Integrador I"
        ],
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Cálculo de Varias Variables",
          "Aplicaciones Web",
          "Estructura de Datos",
          "Desarrollo de Aplicaciones Móviles",
          "Análisis y Diseño de Software"
        ],
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Ecuaciones Diferenciales",
          "Aplicaciones Web Orientadas a Servicios",
          "Bases de Datos Avanzadas",
          "Estándares y Métricas para el Desarrollo de Software",
          "Proyecto Integrador II"
        ],
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Formulación de Proyectos de Tecnología",
          "Fundamentos de Inteligencia Artificial",
          "Ética y Legislación en Tecnologías de la Información",
          "Optativa I",
          "Seguridad Informática"
        ],
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Electrónica Digital",
          "Gestión de Proyectos de Tecnología",
          "Programación para Inteligencia Artificial",
          "Administración de Servidores",
          "Optativa II",
          "Informática Forense"
        ],
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Internet de las Cosas",
          "Evaluación de Proyectos de Tecnología",
          "Ciencia de Datos",
          "Tecnologías Disruptivas",
          "Optativa III",
          "Proyecto Integrador III"
        ],
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  }
  ,
  //REDES
  {
    programId: 2,
    profileImage: "/PORTADASPE/TICS.jpg",
    videoUrl: "/VIDEOSPE2025/TICS.mp4",

    admissionProfile: `
Habilidades y capacidades del aspirante:
Indagar, analizar, transmitir y comunicar información eficazmente a través del trabajo colaborativo e iniciativa propia para la resolución de problemas metodológicamente, guiando sus actividades con respeto a la diversidad cultural de forma cívica y ética para mejorar su entorno.

Habilidades y capacidades específicas del aspirante:
Pensamiento crítico, conocimientos básicos en matemáticas y ciencias, capacidad de organización para el desarrollo de proyectos e interés en el desarrollo tecnológico.
  `,

    graduateProfile: `
El Ingeniero en Tecnologías de la Información e Innovación Digital posee las competencias profesionales esenciales que respaldan su desempeño en el dinámico entorno laboral, tanto en el ámbito local, como regional y nacional, que le permitan desarrollar soluciones innovadoras de integración de tecnologías de la información mediante metodologías y herramientas de desarrollo de software, redes inteligentes, seguridad informática, internet de las cosas, sistemas inteligentes y administración de proyectos; con base en las normas y estándares aplicables enfocados a atender las áreas de oportunidad y optimizar los procesos y recursos de los diversos sectores empresariales.
  `,

    laborField: [
      "Desarrollador Front-End, Back-End o Full Stack",
      "Desarrollador de aplicaciones móviles",
      "Líder de proyectos de Tecnologías de la Información",
      "Director de proyectos de innovación digital",
      "Desarrollador de videojuegos",
      "Creador de contenidos digitales",
      "Director de negocios digitales",
      "Ingeniero de redes digitales",
      "Ingeniero de cómputo en la nube y virtualización",
      "Ingeniero DevOps",
      "Especialista en ciberseguridad y protección de datos",
      "Integrador de soluciones de infraestructura de redes inteligentes",
      "Líder de proyectos de infraestructura de redes inteligentes y ciberseguridad",
      "Administrador de TI",
      "Auditor de TI",
      "Administrador de redes",
      "Analista de Ciberseguridad",
      "Administrador de bases de datos",
      "Científico de datos",
      "Integrador de proyectos IoT",
      "Integrador de proyectos de Inteligencia Artificial y aprendizaje automático",
      "Consultor de proyectos de Tecnologías de la Información",
      "Educador tecnológico",
      "Ingeniero de calidad de software y pruebas",
      "Ingeniero de soporte y servicios",
      "Director de TI",
      "Arquitecto de software",
      "Diseñador de experiencia de usuario"
    ],

    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Fundamentos de Redes",
          "Física",
          "Fundamentos de Programación",
          "Comunicación y Habilidades Digitales"
        ],
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Cálculo Diferencial",
          "Conmutación y Enrutamiento de Redes",
          "Probabilidad y Estadística",
          "Programación Estructurada",
          "Sistemas Operativos"
        ],
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Cálculo Integral",
          "Tópicos de Calidad para el Diseño de Software",
          "Bases de Datos",
          "Programación Orientada a Objetos",
          "Proyecto Integrador I"
        ],
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Cálculo de Varias Variables",
          "Escalabilidad de Redes",
          "Programación de Redes",
          "Centro de Datos",
          "Infraestructura de Redes de Datos"
        ],
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Ecuaciones Diferenciales",
          "Conexión de Redes WAN",
          "Cómputo en la Nube",
          "Seguridad en Redes",
          "Proyecto Integrador II"
        ],
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Formulación de Proyectos de Tecnología",
          "Fundamentos de Inteligencia Artificial",
          "Ética y Legislación en Tecnologías de la Información",
          "Optativa I",
          "Seguridad Informática"
        ],
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Electrónica Digital",
          "Gestión de Proyectos de Tecnología",
          "Programación para Inteligencia Artificial",
          "Administración de Servidores",
          "Optativa II",
          "Informática Forense"
        ],
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Internet de las Cosas",
          "Evaluación de Proyectos de Tecnología",
          "Ciencia de Datos",
          "Tecnologías Disruptivas",
          "Optativa III",
          "Proyecto Integrador III"
        ],
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  },

  //AGRICULTURA
  {
    programId: 3,
    profileImage: "/PORTADASPE/AGRICULTURA.jpg",
    videoUrl: "/VIDEOSPE2025/AGRICULTURA.mp4",
    admissionProfile: `
• Vocación hacia las actividades que integran el proceso de producción agrícola.
• Capacidad para contribuir al desarrollo de su comunidad.
• Capacidad de análisis y crítica de situaciones del ámbito agrícola para proponer soluciones en el corto, mediano y largo plazo.
• Convicción sobre la preservación del medio ambiente y aprovechamiento racional de los recursos naturales, integrándose a una cultura de sustentabilidad.
• Conocimientos en las ciencias básicas de matemáticas, física, química y biología.
• Capacidad para integrarse y trabajar en equipo.
• Comprensión de la importancia del sector agrícola en el suministro de alimentos.
• Capacidad para innovar en diversas áreas de la producción agrícola.
• Capacidad para comunicar y transferir conocimientos.
• Conocimientos básicos en el manejo de software.
• Capacidad para relacionarse en distintas situaciones.
• Actitud orientada a la solución de problemas.
  `,

    graduateProfile: `
El Ingeniero en Agricultura Sustentable y Protegida se distingue por poseer las competencias profesionales esenciales que respaldan su desempeño con éxito en el dinámico entorno laboral, abarcando tanto el ámbito local como el regional y nacional. Este perfil integral no solo se ajusta a las demandas actuales del sector, sino que también anticipa y se adapta a las transformaciones y desafíos emergentes del Ingeniero en Agricultura Sustentable y Protegida. Su capacidad para integrar conocimientos técnicos especializados, habilidades analíticas y una visión innovadora lo posiciona como un profesional altamente calificado y preparado para contribuir significativamente al avance de la disciplina y a la resolución eficiente de problemáticas complejas en distintos contextos.
  `,

    laborField: [
      "Director, Coordinador y Jefe de Área en instituciones gubernamentales relacionadas con la producción, investigación, docencia y transferencia tecnológica en el sector agrícola.",
      "Asesor y capacitador agrícola en unidades de producción a campo abierto.",
      "Asesor y capacitador en grandes, medianas, pequeñas y micro empresas de agricultura protegida.",
      "Gerente de producción en unidades de producción protegida.",
      "Supervisor del proceso de producción en agricultura protegida.",
      "Investigador en instituciones públicas y privadas.",
      "Gestor de proyectos agrícolas.",
      "Administrador en áreas de producción agrícola.",
      "Investigador de mercados de productos hortofrutícolas.",
      "Supervisor de productos hortofrutícolas en empacadoras, comercializadoras y aduanas.",
      "Consultor técnico en el manejo agronómico de cultivos."
    ],

    studyPlan: [
      {
        semester: "Primer Cuatrimestre",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Botánica",
          "Sustentabilidad Agrícola",
          "Química Agrícola",
          "Comunicación y Habilidades Digitales"
        ],
      },
      {
        semester: "Segundo Cuatrimestre",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Cálculo Diferencial",
          "Física",
          "Probabilidad y Estadística",
          "Entomología Agrícola",
          "Edafología"
        ],
      },
      {
        semester: "Tercer Cuatrimestre",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Cálculo Integral",
          "Sistemas de Producción Agrícola Sustentable",
          "Microbiología Agrícola",
          "Fisiología Vegetal",
          "Proyecto Integrador I"
        ],
      },
      {
        semester: "Cuarto Cuatrimestre",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Cálculo de Varias Variables",
          "Fitopatología",
          "Manejo de Malezas",
          "Fertirrigación",
          "Agricultura Protegida"
        ],
      },
      {
        semester: "Quinto Cuatrimestre",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Ecuaciones Diferenciales",
          "Fruticultura",
          "Horticultura y Floricultura Protegida",
          "Topografía y Sistemas Geoespaciales",
          "Proyecto Integrador II"
        ],
      },
      {
        semester: "Sexto Cuatrimestre",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo Cuatrimestre",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Legislación y Certificación Agrícola",
          "Diseños Experimentales",
          "Administración de Proyectos Agrícolas",
          "Nutrición Vegetal",
          "Control de Variables Agroclimatológicas"
        ],
      },
      {
        semester: "Octavo Cuatrimestre",
        subjects: [
          "Inglés VII",
          "Fitogenética",
          "Manejo Postcosecha",
          "Innovación y Desarrollo Agrícola",
          "Agronegocios I",
          "Manejo Integrado de Plagas",
          "Diseño de Sistemas Agrícolas I"
        ],
      },
      {
        semester: "Noveno Cuatrimestre",
        subjects: [
          "Inglés VIII",
          "Diseño de Sistemas Agrícolas II",
          "Agrónica",
          "Transferencia de Tecnología",
          "Agronegocios II",
          "Manejo Integrado de Enfermedades",
          "Proyecto Integrador III"
        ],
      },
      {
        semester: "Décimo Cuatrimestre",
        subjects: ["Estadía"]
      }
    ]
  },

  // MECATRONICA
  {
    programId: 4,
    profileImage: "/PORTADASPE/MECATRONICA.jpg",
    videoUrl: "/VIDEOSPE2025/MECATRONICA.mp4",
    admissionProfile: `
Conocimientos en ciencias básicas, preferentemente en áreas de Física y Matemáticas.
Preferentemente con habilidades digitales.
Preferentemente habilidades digitales, lógica y programación.
Interés por la innovación y nuevas tecnologías.
Solución a problemas del mundo real a través del análisis, la aplicación de las ciencias básicas e investigación.
Preferentemente comprensión de textos en inglés.
  `,

    graduateProfile: `
El egresado en la Licenciatura en Ingeniería en Mecatrónica podrá desenvolverse en las siguientes unidades productivas y sociales tales como:

Empresas públicas y privadas dedicadas a procesos productivos industriales.
Empresas concesionarias de equipos, maquinaria automatizada y venta de partes.
Empresa propia de diseño, desarrollo y mantenimiento en sistemas industriales mecatrónicos en automatización y control.
  `,

    laborField: [
      "Ingeniero de diseño de sistemas mecatrónicos en automatización y control",
      "Consultor de proyectos de integración de sistemas automáticos y de control",
      "Investigador y desarrollador de tecnologías en automatización"
    ],

    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Procesos Industriales",
          "Metodología de la Programación",
          "Metrología",
          "Comunicación y Habilidades Digitales"
        ],
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Cálculo Diferencial",
          "Física",
          "Probabilidad y Estadística",
          "Circuitos Eléctricos",
          "Dibujo para Ingeniería"
        ],
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Cálculo Integral",
          "Elementos Mecánicos",
          "Electrónica Digital",
          "Electrónica Analógica y de Potencia",
          "Proyecto Integrador I"
        ],
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Cálculo de Varias Variables",
          "Estructura y Propiedad de los Materiales",
          "Control de Motores Eléctricos",
          "Sistemas Neumáticos e Hidráulicos",
          "Instrumentación Industrial"
        ],
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Rendimiento",
          "Ecuaciones Diferenciales",
          "Controladores Lógicos Programables",
          "Procesos de Manufactura",
          "Implementación de Sistemas Automáticos",
          "Proyecto Integrador II"
        ],
      },
      {
        semester: "Sexto",
        subjects: [
          "Estadía"
        ],
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Modelado y Simulación de Sistemas",
          "Cinemática y Dinámica de Robots",
          "Análisis de Mecanismos",
          "Instrumentación Virtual",
          "Sistemas embebidos"
        ],
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Diseño Asistido por Computadora",
          "Ingeniería de Control",
          "Programación de Robots Industriales",
          "Diseño mecánico",
          "Sistemas CAM CNC",
          "Diseño de Sistemas Mecatrónicos"
        ],
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Sistemas Eléctricos Industriales",
          "Control Avanzado",
          "Administración de Mantenimiento",
          "Ingeniería Asistida por Computadora",
          "Sistemas de Manufactura Flexible",
          "Proyecto Integrador III"
        ],
      },
      {
        semester: "Décimo",
        subjects: [
          "Estadía"
        ],
      }
    ]
  },


  //MANTENIMIENTO INDUSTRIAL
  {
    programId: 5,
    profileImage: "/PORTADASPE/MANTENIMIENTO.jpg",
    videoUrl: "/VIDEOSPE2025/MANTENIMIENTO.mp4",
    admissionProfile: `
● Habilidades de pensamiento crítico y analítico.
● Habilidades de pensamiento lógico y matemático.
● Capacidad para relacionarse interpersonalmente.
● Habilidades de gestión del tiempo.
● Creatividad e innovación para la mejora continua.
● Conocimiento e interacción con el mundo físico.
● Capacidad para trabajar bajo presión.
● Habilidades de liderazgo y compromiso.
● Capacidad de manejo de equipo de cómputo y herramientas digitales.
● Habilidad para el manejo básico de herramientas manuales.
  `,

    graduateProfile: `
Se distingue por poseer las competencias profesionales esenciales que respaldan su desempeño con éxito en el dinámico entorno laboral, abarcando tanto el ámbito local, como el regional y nacional. Este perfil integral no solo se ajusta a las demandas actuales del sector, sino que también anticipa y se adapta a las transformaciones y desafíos emergentes de la Licenciatura en Ingeniería en Mantenimiento Industrial. Su capacidad para integrar conocimientos técnicos especializados, habilidades analíticas y una visión innovadora lo posiciona como un profesional altamente cualificado y preparado para contribuir significativamente al avance de la disciplina y a la resolución eficiente de problemáticas complejas en distintos contextos.
  `,

    laborField: [
      "Empresas grandes, medianas, pequeñas y microempresas.",
      "Empresas metalmecánicas, alimenticias, del plástico, químicas, petroleras, minería, textil, aeronáuticas, automotrices, de electrodomésticos, farmacéuticas.",
      "Empresas de servicios: transporte, hoteleras, telecomunicaciones, hospitales, centros comerciales.",
      "Empresas de generación, transmisión y distribución de energía eléctrica.",
      "Empresas asociadas al sector financiero de apoyo y fomento a MiPyMES.",
      "Instituciones gubernamentales de apoyo y fomento al desarrollo.",
      "Organizaciones No Gubernamentales.",
      "Empresas nacionales e internacionales.",
      "Empresas de consultoría en formulación y evaluación de proyectos.",
      "Su propia empresa."
    ],

    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Fundamentos de Mantenimiento",
          "Dibujo Industrial",
          "Seguridad Industrial",
          "Comunicación y Habilidades Digitales"
        ]
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Cálculo Diferencial",
          "Física",
          "Probabilidad y Estadística",
          "Gestión del Mantenimiento",
          "Termodinámica"
        ]
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Cálculo Integral",
          "Sistemas Eléctricos",
          "Máquinas y Mecanismos",
          "Electrónica Analógica",
          "Proyecto Integrador I"
        ]
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Cálculo de Varias Variables",
          "Máquinas Eléctricas",
          "Mantenimiento a Procesos de Manufactura",
          "Electrónica Digital",
          "Sistemas Neumáticos e Hidráulicos"
        ]
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Rendimiento",
          "Ecuaciones Diferenciales",
          "Automatización y Robótica",
          "Sistemas Térmicos e Industriales",
          "Ciencia de los Materiales",
          "Proyecto Integrador II"
        ]
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Física para Ingeniería",
          "Administración estratégica para Mantenimiento",
          "Tribología",
          "Instalaciones Eléctricas",
          "Métodos y Sistemas de Trabajo"
        ]
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Ingeniería Económica",
          "Mantenimiento Predictivo Mecánico",
          "Técnicas TPM Y RCM",
          "Ensayos Destructivos",
          "Sistemas Automatizados y Redes Industriales",
          "Protocolos de Operación y Mantenimiento"
        ]
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Gestión Ambiental",
          "Manufactura Asistida por Computadora",
          "Gestión del Talento Humano",
          "Ensayos no Destructivos",
          "Visualización y Control de Procesos",
          "Proyecto Integrador III"
        ]
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  }

  ,

  //PROCESOS ALIMENTICIOS
  {
    programId: 6,
    profileImage: "/PORTADASPE/ALIMENTOS.jpg",
    videoUrl: "/VIDEOSPE2025/ALIMENTOS.mp4",
    admissionProfile: `
● Interés por la ciencia y tecnología.
● Conocimientos básicos en el área de Física, Química, Biología y Matemáticas.
● Gusto por el trabajo en laboratorio.
● Habilidad de trabajo en equipo.
● Curiosidad e interés por los alimentos y su contenido nutrimental.
● Preocupación por el impacto ambiental y social del sector alimentario.
● Deseo de contribuir a la creación de alimentos más nutritivos, sabrosos y sostenibles.
● Interés por el desarrollo de nuevas tecnologías en el ramo alimentario.
● Inquietud por generar su propia empresa del sector agroalimentario.
  `,

    graduateProfile: `
El Ingeniero en Alimentos se caracteriza por poseer las competencias profesionales esenciales que respaldan su desempeño con éxito en el dinámico entorno laboral, abarcando tanto el ámbito local como el regional y nacional. Este perfil integral no solo se ajusta a las demandas actuales del sector, sino que también anticipa y se adapta a las transformaciones y desafíos emergentes para el área de Alimentos. Su capacidad para integrar conocimientos técnicos especializados, habilidades analíticas y una visión innovadora lo posiciona como un profesional altamente cualificado y preparado para contribuir significativamente al avance de la disciplina y a la resolución eficiente de problemáticas complejas en distintos contextos.
  `,

    laborField: [
      "Empresas micro, medianas y grandes, públicas y privadas dedicadas a la transformación y comercialización de alimentos.",
      "Instituciones especializadas en la investigación de alimentos.",
      "Empresas privadas para el desarrollo e investigación de nuevos productos, análisis de alimentos e implementación de procesos.",
      "Asesoría y consultoría en el desarrollo de proyectos productivos agroalimentarios.",
      "Laboratorios de análisis, consultorías especializadas en calidad y certificaciones en el sector alimentario.",
      "Consultorías especializadas en legislación alimentaria e implementación de sistemas de inocuidad.",
      "Organismos gubernamentales encargados de supervisar la inocuidad alimentaria.",
      "Empresa propia al elaborar y comercializar productos agroindustriales."
    ],

    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Biología",
          "Química General",
          "Metodología de la Investigación",
          "Comunicación y Habilidades Digitales"
        ]
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Cálculo Diferencial",
          "Física",
          "Probabilidad y Estadística",
          "Química Analítica",
          "Microbiología"
        ]
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Cálculo Integral",
          "Tecnología de Alimentos I",
          "Química de Alimentos",
          "Tecnología de Conservación de Alimentos",
          "Proyecto Integrador I"
        ]
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Cálculo de Varias Variables",
          "Análisis de Alimentos",
          "Inocuidad Alimentaria",
          "Microbiología de Alimentos",
          "Tecnología de Alimentos II"
        ]
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Ecuaciones Diferenciales",
          "Administración de la Producción",
          "Sistemas de Calidad",
          "Tecnología de Alimentos III",
          "Proyecto Integrador II"
        ]
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Bioquímica",
          "Termodinámica",
          "Balance de Materia y Energía",
          "Operaciones Unitarias I",
          "Diseño de Experimentos"
        ]
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Gestión de la Producción",
          "Emprendimiento e Innovación",
          "Formulación y Evaluación de Proyectos",
          "Estandarización de Procesos Alimentarios",
          "Operaciones Unitarias II",
          "Industrias Alimentarias Sostenibles"
        ]
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Diseño de Plantas",
          "Diseño de Procesos",
          "Consultoría y Capacitación a Empresas",
          "Bioingeniería",
          "Operaciones Unitarias III",
          "Proyecto Integrador III"
        ]
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  }
  ,

  //INGENIERIA INDUSTRIAL
  {
    programId: 7,
    profileImage: "/PORTADASPE/INDUSTRIAL.jpg",
    videoUrl: "/VIDEOSPE2025/INDUSTRIAL.mp4",
    admissionProfile: `
● Habilidades de pensamiento crítico: La capacidad de analizar, evaluar y resolver problemas.
● Capacidad de razonamiento verbal.
● Capacidad de razonamiento lógico y matemático.
● Habilidad para aplicar el razonamiento científico al estudio y solución de problemas prácticos.
● Habilidad en las nuevas tecnologías.
● Capacidad de observación, buena memoria, imaginación e inventiva.
  `,

    graduateProfile: `
El Ingeniero Industrial se distingue por poseer las competencias profesionales esenciales que respaldan su desempeño con éxito en el dinámico entorno laboral, abarcando tanto el ámbito local como el regional y nacional. Este perfil integral no solo se ajusta a las demandas actuales del sector, sino que también anticipa y se adapta a las transformaciones y desafíos emergentes de la/el Ingeniero Industrial. Su capacidad para integrar conocimientos técnicos especializados, habilidades analíticas y una visión innovadora lo posiciona como un profesional altamente cualificado y preparado para contribuir significativamente al avance de la disciplina y a la resolución eficiente de problemáticas complejas en distintos contextos.
  `,

    laborField: [
      "Ingeniero en diseño y desarrollo de productos y procesos.",
      "Ingeniero en mejora continua.",
      "Ingeniero en desarrollo y control de proyectos.",
      "Ingeniero de calidad.",
      "Ingeniero de producción.",
      "Responsable del sistema de gestión de calidad.",
      "Ingeniero en logística.",
      "Ingeniero de manufactura.",
      "Responsable de la administración de la cadena de suministros.",
      "Ingeniero en innovación tecnológica.",
      "Jefe/Supervisor/Gerente/Director en áreas como seguridad, producción, calidad, materiales, ingeniería, entre otros.",
      "Consultor y auditor.",
      "Empresario"
    ],

    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Dibujo Industrial",
          "Química Básica",
          "Metrología",
          "Comunicación y Habilidades Digitales"
        ]
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Cálculo Diferencial",
          "Física",
          "Probabilidad y Estadística",
          "Seguridad, Higiene y Medio Ambiente",
          "Costos de Producción"
        ]
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Cálculo Integral",
          "Control de Calidad",
          "Procesos de Fabricación",
          "Estudio del Trabajo",
          "Proyecto Integrador I"
        ]
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Cálculo de Varias Variables",
          "Ingeniería de Planta y Estudio del Trabajo",
          "Administración y Control de la Calidad",
          "Tecnologías de Transformación de Materiales",
          "Ingeniería Económica"
        ]
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Ecuaciones Diferenciales",
          "Administración y Control de Operaciones",
          "Gestión Ambiental en Procesos Industriales",
          "Sistemas de Manufactura Aplicada",
          "Proyecto Integrador II"
        ]
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Ingeniería de Planta",
          "Investigación de Operaciones I",
          "Manufactura Esbelta",
          "Automatización y Control de Procesos",
          "Tópicos de Nuevas Tecnologías de Manufactura"
        ]
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Sistemas de Gestión de la Calidad",
          "Logística",
          "Investigación de Operaciones II",
          "6 Sigma",
          "Diseño del Producto",
          "Evaluación y Administración de Proyectos"
        ]
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Legislación Industrial",
          "Administración Industrial y de Servicios",
          "Simulación de Procesos",
          "Administración del Mantenimiento",
          "Manufactura Integrada por Computadora",
          "Proyecto Integrador III"
        ]
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  }
  ,

  //CONTADURIA
  {
    programId: 8,
    profileImage: "/PORTADASPE/CONTADURIA.jpg",
    videoUrl: "/VIDEOSPE2025/CONTADURIA.mp4",
    admissionProfile: `
• Habilidad para indagar, analizar y transmitir información procedente de diversas fuentes.
• Habilidad para escuchar, interpretar y expresar mensajes en distintos contextos.
• Capacidad para expresar de forma clara sus ideas, tanto oral como escrita.
• Capacidad para resolver problemas a partir de métodos establecidos.
• Capacidad para aprender por iniciativa propia a lo largo de la vida.
• Capacidad de trabajar de manera colaborativa para el cumplimiento de metas.
• Fomentar la inclusión, reconocimiento y respeto por la diversidad cultural de creencias, valores, ideas, prácticas sociales y de género.
• Interés por participar con una conciencia cívica y ética en la vida de su comunidad, región, entidad, México y el mundo.
  `,

    graduateProfile: `
El egresado en Contaduría tiene las competencias profesionales de verificar información financiera, así como implementar soluciones a problemas financieros para satisfacer las necesidades del sector social y productivo a través de la aplicación de sus habilidades, conocimientos y la emisión de opiniones profesionales de utilidad pública para entes públicos y privados, en beneficio de su región, estado y nación.
  `,

    laborField: [
      "Empresas grandes, medianas, pequeñas y microempresas.",
      "Empresas privadas dedicadas a la producción y comercialización de bienes y servicios.",
      "Dependencias públicas federales, estatales y municipales.",
      "Su propio despacho proporcionando servicios de consultoría (contable, financiera, auditoría y fiscal).",
      "Su propia empresa.",
      "Contador general e independiente",
      "Auditor interno y externo",
      "Contralor interno",
      "Asesor fiscal",
      "Emprendedor",
      "Analista de costos",
      "Asesor financiero",
      "Perito contable"
    ],

    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Matemáticas para Negocios",
          "Informática",
          "Fundamentos de Administración",
          "Contabilidad Básica",
          "Comunicación y Habilidades Digitales"
        ]
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Estadística para Negocios",
          "Derecho Laboral",
          "Derecho Mercantil y Civil",
          "Contabilidad Intermedia",
          "Economía"
        ]
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Matemáticas Financieras",
          "Derecho Fiscal",
          "Contabilidad de Sociedades",
          "Contabilidad Superior",
          "Proyecto Integrador I"
        ]
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Análisis e Interpretación de Estados Financieros",
          "Contribuciones de Personas Morales",
          "Presupuestos",
          "Contabilidad de Costos I",
          "Comercio Exterior"
        ]
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Fundamentos de Auditoría",
          "Contribuciones de Personas Físicas",
          "Sueldos y Salarios",
          "Contabilidad de Costos II",
          "Proyecto Integrador II"
        ]
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Mercado de Valores",
          "Administración Financiera",
          "Seminario Fiscal de Personas Morales",
          "Seminario Fiscal de Asociaciones y Sociedades Civiles",
          "Auditoría Financiera"
        ]
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Contabilidad Gubernamental",
          "Estructura de Capital",
          "Contabilidades Especiales",
          "Seminario Fiscal de Personas Físicas",
          "Seguridad Social",
          "Desarrollo Organizacional"
        ]
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Auditoría Gubernamental",
          "Evaluación Financiera",
          "Auditoría Fiscal",
          "Seminario de Defensa Fiscal",
          "Administración de Costos e Inventarios",
          "Proyecto Integrador III"
        ]
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  }
  ,

  //CAPITAL HUMANO
  {
    programId: 9,
    profileImage: "/PORTADASPE/ADMINISTRACION.jpg",
    videoUrl: "/VIDEOSPE2025/ADMINISTRACION.mp4",
    admissionProfile: `
• Habilidad de razonamiento básico. 
● Habilidad para plantear y solucionar problemas a partir del análisis estadístico. 
● Habilidad básica de administración para contribuir en el ámbito empresarial y organizacional.
● Habilidades de pensamiento crítico para formular y evaluar proyectos de inversión en las organizaciones públicas, privadas o sociales. 
● Capacidad para aprender y ajustarse a entornos empresariales cambiantes, así como adquirir nuevas habilidades y abordar desafíos con una mentalidad abierta y proactiva. 
● Capacidad de comunicación asertiva y expresión de ideas de manera efectiva en diversos contextos y niveles dentro de una organización. 
● Habilidades interpersonales sólidas, sociables y proactivas para interactuar y fomentar un ambiente laboral saludable y productivo. 
  `,
    graduateProfile: `
Se distingue por poseer las competencias profesionales esenciales que respaldan su desempeño con éxito en el dinámico entorno laboral, abarcando tanto el ámbito local, como el regional y nacional. Este perfil integral no solo se ajusta a las demandas actuales del sector, sino que también anticipa y se adapta a las transformaciones y desafíos emergentes de la Licenciatura en Administración. Su capacidad para integrar conocimientos técnicos especializados, habilidades analíticas y una visión innovadora lo posiciona como un profesional altamente cualificado y preparado para contribuir significativamente al avance de la disciplina y a la resolución eficiente de problemáticas complejas en distintos contextos.
  `,
    laborField: [
      "Empresas de Manufactura y producción.",
      "Empresas asociadas al sector financiero.",
      "Empresas asociadas al apoyo y fomento a MiPyMES.",
      "Instituciones gubernamentales de apoyo y fomento al desarrollo.",
      "Empresas, Organizaciones de servicios de consultoría en emprendimiento, formulación y evaluación de proyectos.",
      "Empresas de giro industrial y comercial.",
      "Organizaciones No Gubernamentales.",
      "Empresas e Instituciones dedicadas a proyectos de desarrollo sostenible y responsabilidad social empresarial",
      "Gerente de Proyectos",
      "Director de Desarrollo de Negocios",
      "Consultor Empresarial",
      "Administrador de Proyectos",
      "Director de Planeación",
      "Analista Financiero",
      "Especialista en Desarrollo de Negocios"
    ],
    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Contabilidad I",
          "Fundamentos de Administración",
          "Marco Legal de las Organizaciones",
          "Comunicación y Habilidades Digitales"
        ]
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Probabilidad y Estadística",
          "Contabilidad II",
          "Planeación Estratégica",
          "Microeconomía",
          "Derecho Corporativo"
        ]
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Fundamentos de Mercadotecnia",
          "Análisis Financiero",
          "Fundamentos de Calidad",
          "Macroeconomía",
          "Proyecto Integrador I"
        ]
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Gestión del Capital Humano",
          "Integración del Capital Humano",
          "Comportamiento Organizacional",
          "Sueldos y Salarios I",
          "Legislación Laboral"
        ]
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Desarrollo del Capital Humano",
          "Seguridad e Higiene Laboral",
          "Desarrollo Organizacional",
          "Sueldos y Salarios II",
          "Proyecto Integrador II"
        ]
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Mercadotecnia Estratégica",
          "Tecnologías Aplicadas a los Negocios",
          "Proyectos de Innovación Sostenibles",
          "Gestión del Talento Humano",
          "Administración de la Producción"
        ]
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Dirección Estratégica",
          "Investigación de Operaciones",
          "Sistemas de la Información Aplicados en la Organización",
          "Modelos de Negocios",
          "Evaluación en el Desempeño del Capital Humano",
          "Administración y Gestión de la Calidad"
        ]
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Comercio y Logística Internacional",
          "Consultoría Empresarial",
          "Gestión de la Propiedad Intelectual",
          "Desarrollo en Proyectos de Emprendimiento Social",
          "Finanzas Corporativas",
          "Proyecto Integrador III"
        ]
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  }
  ,
  //EMPRENDIMIENTO
  {
    programId: 10,
    profileImage: "/PORTADASPE/EMPRENDIMIENTO.jpg",
    videoUrl: "/VIDEOSPE2025/ADMINISTRACION.mp4",
    admissionProfile: `
● Habilidad de razonamiento básico. 
● Habilidad para plantear y solucionar problemas a partir del análisis estadístico. 
● Habilidad básica de administración para contribuir en el ámbito empresarial y organizacional.
● Habilidades de pensamiento crítico para formular y evaluar proyectos de inversión en las organizaciones públicas, privadas o sociales.
● Capacidad para aprender y ajustarse a entornos empresariales cambiantes, así como adquirir nuevas habilidades y abordar desafíos con una mentalidad abierta y proactiva. 
● Capacidad de comunicación asertiva y expresión de ideas de manera efectiva en diversos contextos y niveles dentro de una organización.
● Habilidades interpersonales sólidas, sociables y proactivas para interactuar y fomentar un ambiente laboral saludable y productivo.
  `,
    graduateProfile: `
Se distingue por poseer las competencias profesionales esenciales que respaldan su desempeño con éxito en el dinámico entorno laboral, abarcando tanto el ámbito local, como el regional y nacional. Este perfil integral no solo se ajusta a las demandas actuales del sector, sino que también anticipa y se adapta a las transformaciones y desafíos emergentes de la Licenciatura en Administración. Su capacidad para integrar conocimientos técnicos especializados, habilidades analíticas y una visión innovadora lo posiciona como un profesional altamente cualificado y preparado para contribuir significativamente al avance de la disciplina y a la resolución eficiente de problemáticas complejas en distintos contextos.
  `,
    laborField: [
      "Empresas de Manufactura y producción",
      "Empresas asociadas al sector financiero",
      "Empresas asociadas al apoyo y fomento a MiPyMES",
      "Instituciones gubernamentales de apoyo y fomento al desarrollo",
      "Empresas, Organizaciones de servicios de consultoría en emprendimiento, formulación y evaluación de proyectos",
      "Empresas de giro industrial y comercial",
      "Organizaciones No Gubernamentales",
      "Empresas e Instituciones dedicadas a proyectos de desarrollo sostenible y responsabilidad social empresarial",
      "Gerente de Proyectos",
      "Director de Desarrollo de Negocios",
      "Consultor Empresarial",
      "Administrador de Proyectos",
      "Director de Planeación",
      "Analista Financiero",
      "Especialista en Desarrollo de Negocios"
    ],
    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Contabilidad I",
          "Fundamentos de Administración",
          "Marco Legal de las Organizaciones",
          "Comunicación y Habilidades Digitales"
        ]
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Probabilidad y Estadística",
          "Contabilidad II",
          "Planeación Estratégica",
          "Microeconomía",
          "Derecho Corporativo"
        ]
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Fundamentos de Mercadotecnia",
          "Análisis Financiero",
          "Fundamentos de Calidad",
          "Macroeconomía",
          "Proyecto Integrador I"
        ]
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Innovación y Emprendimiento",
          "Estudio de Mercado",
          "Administración de Proyectos I",
          "Fundamentos de Sistemas de Producción",
          "Estudio Técnico y Organizacional"
        ]
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Diagnóstico Local y Regional",
          "Estudio Financiero",
          "Administración de Proyectos II",
          "Evaluación Financiera de Proyectos",
          "Proyecto Integrador II"
        ]
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Mercadotecnia Estratégica",
          "Tecnologías Aplicadas a los Negocios",
          "Proyectos de Innovación Sostenibles",
          "Gestión del Talento Humano",
          "Administración de la Producción"
        ]
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Dirección Estratégica",
          "Investigación de Operaciones",
          "Sistemas de la Información Aplicados en la Organización",
          "Modelos de Negocios",
          "Evaluación en el Desempeño del Capital Humano",
          "Administración y Gestión de la Calidad"
        ]
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Comercio y Logística Internacional",
          "Consultoría Empresarial",
          "Gestión de la Propiedad Intelectual",
          "Desarrollo en Proyectos de Emprendimiento Social",
          "Finanzas Corporativas",
          "Proyecto Integrador III"
        ]
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  }

  ,

  //MERCADOTECNIA
  {
    programId: 11,
    profileImage: "/PORTADASPE/NEGOCIOS.jpg",

    videoUrl: "/VIDEOSPE2025/MERCADOTECNIA.mp4",
    admissionProfile: `
● Trabajo en Equipo y Liderazgo: Habilidad para colaborar en equipos multidisciplinarios, liderar proyectos y resolver problemas con pensamiento crítico y proactivo.
● Habilidades de Comunicación y de Relaciones Públicas: capacidad para comunicarse de manera efectiva oralmente y por escrito, reconocimiento de las necesidades del cliente y habilidades en relaciones públicas.
● Capacidad para adaptarse a entornos cambiantes y gestionar la incertidumbre: implica ser flexibles, tener una mentalidad abierta tanto a diferentes culturas como a mercados, estar dispuestos a aprender y adecuar estrategias.
  `,
    graduateProfile: `
El Licenciado en Negocios y Mercadotecnia podrá desempeñarse atendiendo los siguientes puestos de trabajo:

● Director comercial
● Gerente de mercadotecnia
● Gerente de publicidad y promoción
● Asesor en desarrollo de negocios
● Analista de mercado
● Gerente a nivel administrativo
● Coordinador de marca
● Desarrollo e innovación de nuevos productos
● Analista de precios
● Coordinador de finanzas comerciales
● Community manager
● Desarrollador de contenido
● Supervisor comercial
● Gerente de ventas
● Coordinador de servicio al cliente
● Director de su propia empresa
● Ejecutivo de ventas
● Coordinador de la fuerza de ventas
● Coordinador de investigación de mercados
● Supervisor del área de ventas
● Coordinador de mercadotecnia
● Ejecutivo de servicio a clientes
● Gestor de Networking 
● Emprendedor
  `,
    laborField: [
      "Instituciones públicas y privadas del sector industrial, comercial o de servicios.",
      "Agencias de mercadotecnia, investigación de mercados y de publicidad.",
      "Empresas encargadas de suministrar servicios especializados en mercadotecnia.",
      "Unidades Estrategias de Negocios.",
      "Cámaras u Organismos del área de comercio internacional.",
      "Micro, Pequeñas y Medianas Empresas.",
      "En el área comercial de instituciones bancarias, financieras y de seguros.",
      "Ventas independientes.",
      "Ventas al mayoreo y menudeo.",
      "Distribuidoras comerciales.",
      "Organizaciones No Gubernamentales.",
      "Instituciones y organismos públicos relacionados con la comunicación.",
      "Su propia empresa.",
      "Asesor independiente."
    ],
    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo humano y valores",
          "Mercadotecnia",
          "Matemáticas",
          "Informática",
          "Fundamentos de administración y entorno empresarial",
          "Comunicación y habilidades digitales"
        ]
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades socioemocionales y manejo de conflictos",
          "Estadística I",
          "Planeación Estratégica",
          "Contabilidad para negocios",
          "Comportamiento del consumidor",
          "Economía"
        ]
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del pensamiento y toma de decisiones",
          "Legislación comercial",
          "Estadística II",
          "Sistema de investigación de mercados I",
          "Estrategias de producto y precio",
          "Proyecto integrador I"
        ]
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética profesional",
          "Mezcla promocional",
          "Diseño digital y multimedia",
          "Sistema de investigación de mercados II",
          "Gestión de ventas",
          "Administración del tiempo"
        ]
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de equipos de alto desempeño",
          "Logística y distribución",
          "Mercadotecnia de servicios",
          "Mercadotecnia digital I",
          "Mercadotecnia Estratégica",
          "Proyecto integrador II"
        ]
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades gerenciales",
          "Estadística aplicada a los negocios",
          "Mercadotecnia internacional",
          "Desarrollo de nuevos productos",
          "Tendencias de mercado y consumidor global",
          "Planeación y organización del trabajo"
        ]
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Mercadotecnia digital II",
          "Inteligencia de mercados",
          "Gestión de la calidad",
          "Inteligencia financiera",
          "Administración de la producción",
          "Gestión del talento humano"
        ]
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Cultura emprendedora",
          "Cadena de suministro",
          "Plan de negocios",
          "Comunicación integral de mercadotecnia",
          "Derecho corporativo",
          "Proyecto integrador III"
        ]
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  }
  ,
  //FINANZAS
  {
    programId: 12,
    profileImage: "/PORTADASPE/ASESORFINANCIERO.jpg",
    admissionProfile: `
• Habilidades de pensamiento crítico: argumentar, analizar, evaluar y resolver problemas. 
• Comunicación a un nivel básico de inglés. 
• Habilidades numéricas: operaciones aritméticas, determinación de porcentajes, promedios. 
• Habilidades sociales para la atención y seguimiento al cliente/socio. 
• Habilidades de venta y negociación para concretar la colocación de productos y servicios financieros. 
• Habilidad analítica y cuantitativa para la toma de decisiones financieras.
  `,
    graduateProfile: `
Se distingue por poseer las competencias profesionales esenciales que respaldan su desempeño con éxito en el dinámico entorno laboral, abarcando tanto el ámbito local como el regional y nacional. Este perfil integral no sólo se ajusta a las demandas actuales del sector, sino que también anticipa y se adapta a las transformaciones y desafíos emergentes de la Licenciatura en Asesor Financiero. Su capacidad para integrar conocimientos técnicos especializados, habilidades analíticas y una visión innovadora, lo posiciona como un profesional altamente cualificado y preparado para contribuir significativamente al avance de la disciplina y a la resolución eficiente de problemáticas complejas en distintos contextos.
  `,
    laborField: [
      "Gerente de sucursal de una SOCAP",
      "Ejecutivo Asesor de Crédito, Ahorro e Inversión",
      "Capacitador en Educación Financiera",
      "Gerente de cobranza",
      "Ejecutivo de ventas y promoción",
      "Ejecutivo de finanzas",
      "Ejecutivo de emprendimiento social",
      "Asesor financiero independiente",
      "Gerente, Subgerente, Analista o Auxiliar de Finanzas",
      "Gerente, Subgerente, Analista o Auxiliar de Gestión de Riesgos",
      "Gerente, Subgerente, Analista o Auxiliar de Administración",
      "Operativos en el área de Actuaría",
      "Auditor Financiero",
      "Docentes e investigadores en el área administrativa",
      "Delegado, Director, Subdirector o Jefe de Áreas de Finanzas Públicas",
      "Coordinadores de Planeación y Programación de Presupuesto en Instituciones Privadas y Públicas"
    ],
    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Contabilidad Básica",
          "Microeconomía",
          "Informática",
          "Comunicación y Atención al Socio",
          "Comunicación y Habilidades Digitales"
        ]
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Calidad",
          "Macroeconomía",
          "Introducción al Sistema Financiero",
          "Estadística Administrativa",
          "Marco Jurídico y Legal"
        ]
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Educación Financiera",
          "Crédito, Financiamiento y Servicios Financieros Complementarios",
          "Matemáticas Financieras",
          "Ahorro e Inversión",
          "Proyecto Integrador I"
        ]
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Mercadotecnia",
          "Administración Estratégica",
          "Cobranza",
          "Análisis e Interpretación de Estados Financieros",
          "Asesoría Financiera Integral"
        ]
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Estudio de Mercado",
          "Metodología de la Investigación",
          "Proyecto de Emprendimiento Social",
          "Evaluación Financiera",
          "Proyecto Integrador II"
        ]
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Contabilidad Intermedia",
          "Estadística Inferencial",
          "Formulación y Planeación de Proyectos Financieros",
          "Mercado de Valores",
          "Planeación Estratégica Corporativa"
        ]
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Economía de la Empresa",
          "Contabilidad de Costos",
          "Econometría",
          "Evaluación de Proyectos Financieros",
          "Finanzas Públicas",
          "Derecho Corporativo"
        ]
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Economía Política",
          "Auditoría Financiera",
          "Modelos de Programación Financiera",
          "Análisis de Riesgos Financieros",
          "Finanzas Internacionales",
          "Proyecto Integrador III"
        ]
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  }
  ,
]
