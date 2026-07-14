
export interface CustomOrgNode {
  key?: string;
  expanded?: boolean;
  type?: string;
  data: {
    image: string;
    name: string;
    title: string;
    text?: string;
  };
  children?: CustomOrgNode[];
}



const dataOrganigrama: CustomOrgNode[] = [
  {
    expanded: true,
    type: "person",
    data: {
      image: "Organigrama/Rector.png",
      name: "Ing. Enrique Salvador Fernández Lozada ",
      title: "Rector",
    },
    children: [
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/AbogadoGeneral.png",
          name: "Mtro. Eleazar Carrillo Camacho ",
          title: "ENCARGADO DEL ÁREA DE ABOGADO GENERAL",
          text: "El Mtro. Eleazar Carrillo Camacho es Encargado del Área de Abogado General en la Universidad Tecnológica de Tecamachalco, donde coordina y supervisa los asuntos jurídicos institucionales con una perspectiva enfocada en el derecho educativo y la legalidad universitaria. Es Maestro en Derecho por la Universidad Nacional Autónoma de México (UNAM), institución donde también obtuvo el título de Licenciado en Derecho, consolidando así una sólida formación jurídica orientada al servicio público y la educación superior. Cuenta con experiencia en el ámbito gubernamental, habiéndose desempeñado como Regidor de Gobernación y Justicia en el H. Ayuntamiento de Cuautlancingo, así como Abogado General en la Universidad Tecnológica de Puebla, lo que refuerza su capacidad para alinear el marco normativo con las necesidades institucionales. Su trayectoria destaca por el compromiso con la legalidad, la ética profesional y la promoción de un entorno académico justo y transparente."
        },
        
       
      },
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/enc_extend_universitaria.png",
          name: "Mtra. Verónica Elizabeth Centeno Fórtiz  ",
          title:"Encargada de la Dirección de Extensión Universitaria ",
          text: "La Mtra. Verónica Elizabeth Centeno Fortiz es Encargada de la Dirección de Extensión Universitaria en la Universidad Tecnológica de Tecamachalco, donde promueve actividades de proyección institucional, vinculación social, cultura y desarrollo estudiantil con un enfoque inclusivo y participativo. Es Maestra en Ciencias de la Educación por el Instituto de Estudios Universitarios A.C. y Licenciada en Ciencias de la Comunicación por la Universidad Realística de México, formación que le ha permitido desempeñarse en áreas clave de comunicación institucional, gestión educativa y desarrollo comunitario. Ha sido Directora de Extensión Universitaria y Titular del Área de Educación en el H. Ayuntamiento de Tepeaca, donde lideró iniciativas de impacto social y programas educativos orientados a fortalecer el vínculo entre gobierno y ciudadanía.Su perfil combina experiencia en educación, comunicación estratégica y participación ciudadana, lo que le permite contribuir de manera significativa al fortalecimiento del sentido de comunidad y responsabilidad social dentro del entorno universitario."
        },

       
      },
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/ContraloriaInterna.png",
          name: "Abg. Alain Eloy Alvarez Sánchez ",
          title: "ENCARGADO DEL ÁREA DE  CONTRALORÍA INTERNA",
          text:"El Abg. Alain Eloy Álvarez Sánchez funge como Encargado del Área de Contraloría Interna en la Universidad Tecnológica de Tecamachalco, desde donde supervisa el cumplimiento normativo y promueve la transparencia en los procesos institucionales. Es Maestro en Imagen Pública por la Universidad de Oriente y Licenciado en Derecho por la Benemérita Universidad Autónoma de Puebla (BUAP), lo que le otorga una visión integral de la ética, la legalidad y la percepción institucional. Cuenta con experiencia como Abogado General en el Centro de Especialización de Recursos Humanos de Alto Nivel y como Abogado en la Universidad Tecnológica de Puebla, fortaleciendo así su perfil en el ámbito jurídico y administrativo dentro del sector educativo.Su labor se distingue por el compromiso con la legalidad, el control interno y la mejora continua en la gestión universitaria."
        },


      },
       {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/secretariaAcademica.png",
          name: " Mtro. Carlos Islas Contreras ",
          title: "ENCARGADO DE LA SECRETARIA ACADÉMICA ",
          text:"El Mtro. Carlos Islas Contreras es actualmente Encargado de la Secretaría Académica en la Universidad Tecnológica de Tecamachalco, donde lidera la planeación, evaluación y mejora de los programas educativos, fortaleciendo la calidad académica institucional. Posee una Maestría en Gobernanza y Globalización por la Universidad de las Américas Puebla, así como una Licenciatura en Derecho por la Escuela Libre de Derecho, lo que le ha permitido integrar una visión estratégica e innovadora en la gestión académica. Ha ocupado responsabilidades clave en instituciones de educación superior, como Jefe de la Oficina de la Rectoría en la Universidad Tecnológica de Puebla, destacando por su capacidad para alinear los objetivos académicos con políticas públicas de desarrollo educativo.Su experiencia combina la formación académica de alto nivel con una trayectoria enfocada en el fortalecimiento institucional, la planeación académica y la mejora continua."
        },
        children: [

          {
            type: "person",
            data: {
              image: "Organigrama/directores/Agricultura.png",
              name: " lng. Laura Rodríguez Peláez ",
              title: " DIRECCIÓN  DEL P.E.  AGRICULTURA SUSTENTBLE Y  PROTEGIDA ",
              text:"La Ing. Laura Rodríguez Peláez es Directora del Programa Educativo de Agricultura Sustentable y Protegida en la Universidad Tecnológica de Tecamachalco, institución en la que ha desempeñado funciones desde 1999. Su labor se centra en la formación de profesionistas comprometidos con el desarrollo agrícola sostenible y el uso responsable de los recursos naturales. Cuenta con estudios de Maestría en Gestión Educativa por el Centro de Posgrado del Benemérito Instituto Normal del Estado, lo que le ha permitido integrar su experiencia técnica con una sólida perspectiva académica y administrativa. Ha sido también Subdirectora de Planeación y Evaluación y Directora del Programa Educativo de Administración, participando activamente en la consolidación de procesos institucionales enfocados en la calidad educativa y la mejora continua.Su trayectoria refleja un firme compromiso con la educación superior tecnológica y con la promoción de prácticas agrícolas innovadoras que respondan a los retos del desarrollo rural y ambiental de la región."
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/conta.png",
              name: "Mtro. Luis Enrique Manzano Martínez ",
              title: "ENC. DE LA  DIRECCIÓN  DEL P.E. CONTADURÍA  ",
              text:"El Mtro. Luis Enrique Manzano Martínez es Encargado del Despacho de la Dirección del Programa Educativo de Contaduría en la Universidad Tecnológica de Tecamachalco, donde promueve la formación integral de profesionistas en contabilidad, finanzas y administración, con enfoque ético y visión estratégica.Es Ingeniero Industrial en Eléctrica por el Instituto Tecnológico de Puebla y cuenta con una Maestría en Ingeniería Administrativa por el Instituto de Estudios Universitarios A.C.. Su sólida formación técnica y directiva le ha permitido desenvolverse con éxito en diversos ámbitos del sector educativo y público. Ha ocupado cargos de alto nivel, entre ellos: Director de Vinculación del ICATEP, así como Director General del Instituto Tecnológico Superior de Tepeaca y del Instituto Tecnológico Superior de Acatlán de Osorio, instituciones donde consolidó estrategias de crecimiento, vinculación y fortalecimiento académico.También se ha desempeñado como Encargado de la Dirección de Universidades e Instituciones Tecnológicas en la Subsecretaría de Educación Superior, y como consultor e instructor en la empresa M&T, lo que amplía su perspectiva en planeación estratégica, liderazgo académico y desarrollo institucional."
            },
          },

          {
            type: "person",
            data: {
              image: "Organigrama/directores/admin.png",
              name: "Mtra. Miriam Garcilazo Alcántara  ",
              title: "DIRECTORA  DEL P.E. ADMINISTRACIÓN",
              text:"La Mtra. Miriam Garcilazo Alcantará es Directora del Programa Educativo de Administración en la Universidad Tecnológica de Tecamachalco, donde ha contribuido desde 2004 al fortalecimiento de los procesos académicos y administrativos, promoviendo una formación integral en el área económico-administrativa. Es Maestra en Administración por la Universidad Popular Autónoma del Estado de Puebla (UPAEP) y Licenciada en Economía por la Benemérita Universidad Autónoma de Puebla (BUAP). Su formación le ha permitido desarrollar una visión crítica y estratégica en torno a los procesos de gestión organizacional y desarrollo institucional. Ha desempeñado diversos cargos dentro de la universidad, entre ellos Subdirectora de Servicios Escolares y Jefa del Departamento de Prensa y Difusión, además de contar con una sólida trayectoria como profesora de tiempo completo, destacando por su compromiso académico y su cercanía con la comunidad estudiantil."
            },
          },

          {
            type: "person",
            data: {
              image: "Organigrama/directores/mercado.png",
              name: "Mtro. Jesús Guadalupe Jiménez de Rosas   ",
              title: "DIRECCIÓN DEL P.E. INNOVACIÓN DE NEGOCIOS Y MERCADOTECNIA ",
              text:"El Mtro. Jesús Guadalupe Jímenez de Rosas es Director del Programa Educativo de Negocios y Mercadotecnia en la Universidad Tecnológica de Tecamachalco, donde desde 2005 impulsa estrategias formativas orientadas al desarrollo empresarial, la creatividad comercial y el posicionamiento de marca en entornos competitivos.Es Maestro en Mercadotecnia y Medios Digitales por la Universidad Interamericana para el Desarrollo y Licenciado en Diseño Gráfico por la Benemérita Universidad Autónoma de Puebla (BUAP), lo que le permite integrar una perspectiva visual y estratégica en la enseñanza de mercadotecnia y negocios.Cuenta con experiencia como profesor de asignatura en la misma universidad, donde ha destacado por su capacidad didáctica y su compromiso con la formación de profesionales innovadores, enfocados en el análisis del mercado y la implementación de estrategias digitales. Su perfil académico y creativo lo posiciona como un líder educativo en el desarrollo de competencias clave para el emprendimiento, la comunicación comercial y la gestión de marcas con valor social."
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/industrial.png",
              name: "Ing. Job Armando Henández Cortés",
              title: " DIRECCIÓN  DEL P.E. INGENIERÍA INDUSTRIAL ",
              text:"El Mtro. Job Armando Hernández Cortés es Director del Programa Educativo de Ingeniería Industrial en la Universidad Tecnológica de Tecamachalco, desde donde lidera procesos de enseñanza-aprendizaje enfocados en la optimización de sistemas productivos y el desarrollo de soluciones industriales sostenibles. Es Ingeniero Industrial por el Instituto Tecnológico Superior de Tepeaca y cuenta con una Maestría en la Enseñanza de las Ciencias Exactas por el Instituto Nacional de Óptica y Electrónica, formación que le permite integrar el conocimiento técnico con estrategias didácticas efectivas para la formación de ingenieros altamente capacitados.Antes de incorporarse a la universidad, se desempeñó como Launch Engineer en la empresa Minghua de México S.A. de C.V., donde adquirió experiencia práctica en procesos de manufactura y gestión de proyectos industriales, fortaleciendo su perfil profesional con visión aplicada al sector productivo."
            },


          },
          {

            type: "person",
            data: {
              image: "Organigrama/directores/mant_indus.png",
              name: "Ing. José Mario Cepeda Sorcia",
              title: "DIRECCIÓN  DEL P.E. MANTENIMIENTO  INDUSTRIA ",
              text:"El Ing. José Mario Cepeda Sorcia es Director del Programa Educativo de Mantenimiento Industrial en la Universidad Tecnológica de Tecamachalco, desde donde impulsa la formación de profesionistas con competencias técnicas para la operación, supervisión y mejora de procesos industriales. Es Ingeniero en Mantenimiento Industrial por la Universidad Tecnológica de Puebla y cuenta con estudios en Ingeniería Industrial por el Instituto Tecnológico Superior de Tepeaca, lo que le brinda una sólida preparación en áreas clave como la eficiencia operativa, seguridad industrial y mantenimiento preventivo y correctivo.Antes de su labor en el ámbito académico, se desempeñó como Auditor de Calidad en Samvardhana Motherson Innovative Autosystems de México S.A. de C.V., adquiriendo experiencia directa en el sector automotriz, bajo estándares de calidad y mejora continua.Su enfoque combina el conocimiento práctico con la docencia aplicada, contribuyendo a la profesionalización del talento técnico en un entorno de constante evolución tecnológica e industrial."
            },

          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/meca.png",
              name: "Ing. Sullivan Reyes Negrete",
              title: "ENCARGADO DE LA DIRECCIÓN DEL P.E. MECATRÓNICA ",
               text:"El Ing. Sullivan Reyes Negrete es Encargado del Despacho de la Dirección del Programa Educativo de Mecatrónica Industrial en la Universidad Tecnológica de Tecamachalco, donde promueve una formación integral enfocada en la automatización, el control de procesos y la industria 4.0. Es Ingeniero Industrial por la Benemérita Universidad Autónoma de Puebla (BUAP) y cuenta con certificaciones en Gestión Integral de Riesgos y Green Belt en Lean Manufacturing, lo que refuerza su capacidad para implementar metodologías de mejora continua, eficiencia operativa y reducción de desperdicios en entornos industriales complejos. Ha sido Jefe del Departamento de Evaluación en el H. Ayuntamiento de Cuautlancingo, donde aplicó herramientas de análisis institucional y planeación estratégica con base en indicadores de desempeño.Su perfil técnico, complementado por su experiencia en gestión pública y sus certificaciones especializadas, lo consolidan como un formador de talento competitivo para el sector manufacturero, con visión innovadora y orientación a resultados."
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/alimentos.png",
              name: "Mtro Carlos Roberto Camarillo  Rojas ",
              title: "Enc. de la   DIRECCIÓN DEL P.E. PROCESOS BIOALIMENTARIOS ",
              text:"El Mtro. Carlos Roberto Camarillo Rojas es Encargado del Despacho de la Dirección del Programa Educativo de Procesos Alimentarios en la Universidad Tecnológica de Tecamachalco, donde ha forjado una destacada trayectoria desde 2003, impulsando la formación de profesionistas altamente capacitados en el ámbito agroindustrial.Es Ingeniero Bioquímico por el Instituto Tecnológico de Tehuacán y Maestro en Tecnología en Agroindustrias por el Colegio de Posgraduados, Campus Córdoba, lo que respalda su enfoque integral en la transformación y control de calidad de alimentos, así como en el desarrollo de procesos sustentables. Además de su labor directiva, ha sido docente del Programa Educativo de Procesos Alimentarios, transmitiendo su experiencia y conocimientos técnicos a nuevas generaciones de profesionales del sector. Su perfil combina experiencia académica, liderazgo institucional y conocimiento especializado en procesos agroindustriales, con un firme compromiso hacia la calidad educativa y el desarrollo regional sostenible."
            },
          },
          {
            type: "person",
            data: {
              image: "Organigrama/directores/ti.png",
              name: "Mtra.  Mónica Meneses Gasca  ",
              title: "DIRECCIÓN DEL P.E. TECNOLOGÍAS DE LA INFORMACIÓN",
              text: "La Mtra. Mónica Meneses Gasca es Directora del Programa Educativo de Tecnologías de la Información e Innovación Tecnológica en la Universidad Tecnológica de Tecamachalco, donde impulsa la formación de profesionistas orientados al desarrollo digital, la innovación y la transformación tecnológica.Es Maestra en Administración de Empresas por el Instituto de Estudios Superiores del Estado y Ingeniera en Sistemas Computacionales por el Instituto Tecnológico Superior de Tepeaca, lo que le permite combinar competencias técnicas con una visión de gestión y liderazgo empresarial.Además, se ha desempeñado como profesora de asignatura en la misma universidad, destacando por su compromiso con la formación académica, el impulso al emprendimiento tecnológico y la atención a los retos de la economía digital.Su perfil combina experiencia en innovación, docencia y administración, alineado con las exigencias del entorno tecnológico actual."
                  },
          },

        ],

      },
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/secretarioVinculacion.png",
          name: "  Lic. Daniel Huerta Conde ",
          title: "SECRETARIO  DE VINCULACIÓN ",
          text: "El Mtro. Daniel Huerta Conde es actualmente Secretario de Vinculación en la Universidad Tecnológica de Tecamachalco, donde impulsa estrategias de colaboración entre la academia, el sector productivo y el gobierno.Es Maestro en Administración de Empresas por la UDLAP y Licenciado en Derecho por el Centro Universitario Hispano de Texmelucan. Su formación se complementa con estudios en arquitectura y especialidades en valuación de inmuebles, negocios y bienes agropecuarios. Su perfil multidisciplinario y experiencia en gestión institucional lo posicionan como un líder comprometido con el desarrollo regional y la vinculación estratégica."
        },
      },
      {
        expanded: true,
        type: "person",
        data: {
          image: "Organigrama/admin_finanzas.png",
          name: " Lic. Rodrigo Hernández Aguilar ",
          title:"Dirección de Administración y Finanzas ",
          text: "El Lic. Rodrigo Hernández Aguilar es un profesional con sólida trayectoria en el ámbito de la administración pública, la gestión de calidad y el desarrollo institucional. Actualmente se desempeña como Encargado de la Dirección de Administración y Finanzas de la Universidad Tecnológica de Tecamachalco, donde lidera procesos estratégicos orientados a la eficiencia financiera, la gestión del capital humano y la innovación organizacional.Es Licenciado en Administración por la Benemérita Universidad Autónoma de Puebla (BUAP) y cuenta con una sólida formación complementaria en planeación estratégica, gestión financiera, desarrollo gerencial y derechos humanos, respaldada por instituciones como el Tecnológico de Monterrey, la Universidad Iberoamericana, Universidad Panamericana y el Insituto Tecnológico Autónomo de México. Está certificado como Auditor Líder en la Norma ISO 9001:2015, así como en igualdad laboral y no discriminación (NMX-R-025-SCFI-2015) y factores de riesgo psicosocial (NOM-035-STPS-2018), con experiencia en procesos de auditoría y certificación a nivel estatal y federal.Su liderazgo en áreas clave como recursos humanos, planeación presupuestaria y análisis de riesgos financieros le ha permitido impulsar iniciativas de transformación institucional, generación de ahorro y mejora continua, consolidándolo como un referente en administración pública eficiente y orientada a resultados."
        },
      },
    ],
  },
];


export {
  dataOrganigrama
}