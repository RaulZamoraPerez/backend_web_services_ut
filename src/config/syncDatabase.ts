import sequelize, { connectDatabase } from './database';
import Texto from '../models/Texto';
import Area from '../models/Area';
import SolicitudesConstanciasKardex from '../models/Solicitud_Constancia';
import NosotrosContent from '../models/Nosotros';
import Calendario from '../models/Calendario';
import HeroSlide from '../models/HeroSlide';
import Evento from '../models/Evento';
import Noticia from '../models/Noticia';
import Anuncio from '../models/Anuncio';
import Carrera from '../models/Carrera';
import VideoInstitucional from '../models/VideoInstitucional';
import ModeloEducativo from '../models/ModeloEducativo';
import { ProcesoAdmision } from '../models/ProcesoAdmision';
import { PasoAdmision } from '../models/PasoAdmision';
import { AdmisionBanner } from '../models/AdmisionBanner';
import { TramitesVista } from '../models/TramitesVista';
import { FormularioConfig } from '../models/FormularioConfig';
import { ConvocatoriaTitulo } from '../models/ConvocatoriaTitulo';
import ConvocatoriaTituloBanner from '../models/ConvocatoriaTituloBanner';
import { ConvocatoriaDocumento } from '../models/ConvocatoriaDocumento';
import { PersonalCarrera } from '../models/PersonalCarrera';
import { CarreraSimple } from '../models/CarreraSimple';
import { OpcionReinscripcion } from '../models/OpcionReinscripcion';
import { SeccionReinscripcion } from '../models/SeccionReinscripcion';
import BecaSection from '../models/BecaSection';
import BecaCategory from '../models/BecaCategory';
import RelojDigital from '../models/RelojDigital';
import EstadiaDocumento from '../models/EstadiaDocumento';
import TipoEstadia from '../models/TipoEstadia';
import ServicioTecnologico from '../models/ServicioTecnologico';
import VinculacionBannerDocumento from '../models/VinculacionBannerDocumento';
import PracticasEstadiasBanner from '../models/PracticasEstadiasBanner';
import EducacionContinuaCurso from '../models/EducacionContinuaCurso';
import EducacionContinuaInfo from '../models/EducacionContinuaInfo';
import EducacionContinuaVideo from '../models/EducacionContinuaVideo';
import EducacionContinuaBanner from '../models/EducacionContinuaBanner';
import EducacionContinuaCategoria from '../models/EducacionContinuaCategoria';
import EducacionContinuaDocumento from '../models/EducacionContinuaDocumento';

// Nuevas tablas
import FeriasProfesiograficasInfo from '../models/FeriasProfesiograficasInfo';
import FeriasProfesiograficasBanner from '../models/FeriasProfesiograficasBanner';
import FeriasProfesiograficasCategoria from '../models/FeriasProfesiograficasCategoria';
import FeriasProfesiograficasDocumento from '../models/FeriasProfesiograficasDocumento';
import FeriasProfesiograficasCurso from '../models/FeriasProfesiograficasCurso';
import FeriasProfesiograficasVideo from '../models/FeriasProfesiograficasVideo';
import PromocionInstitucionalInfo from '../models/PromocionInstitucionalInfo';
import PromocionInstitucionalBanner from '../models/PromocionInstitucionalBanner';
import PromocionInstitucionalCategoria from '../models/PromocionInstitucionalCategoria';
import PromocionInstitucionalDocumento from '../models/PromocionInstitucionalDocumento';
import PromocionInstitucionalCurso from '../models/PromocionInstitucionalCurso';
import PromocionInstitucionalVideo from '../models/PromocionInstitucionalVideo';
import VisitasGuiadasInfo from '../models/VisitasGuiadasInfo';
import VisitasGuiadasBanner from '../models/VisitasGuiadasBanner';
import VisitasGuiadasCategoria from '../models/VisitasGuiadasCategoria';
import VisitasGuiadasDocumento from '../models/VisitasGuiadasDocumento';
import VisitasGuiadasCurso from '../models/VisitasGuiadasCurso';
import VisitasGuiadasVideo from '../models/VisitasGuiadasVideo';
import MoodleConfig from '../models/MoodleConfig';
import Countdown from '../models/Countdown';
import { ContactConfig } from '../models/ContactConfig';
import { CarreraConfig } from '../models/CarreraConfig';
import { NoticiaConfig } from '../models/NoticiaConfig';
import ModalidadDualConfig from '../models/ModalidadDualConfig';
import FooterConfig from '../models/FooterConfig';
import Patrocinador from '../models/Patrocinador';
import SitemapCategory from '../models/SitemapCategory';

import ServicioSocialDocumento from '../models/ServicioSocialDocumento';
// import ServicioSocialTipo from '../models/ServicioSocialTipo';
import ServicioTecnologicoRealizado from '../models/ServicioTecnologicoRealizado';
import MovilidadInternacional from '../models/MovilidadInternacional';
import BolsaTrabajoHeader from '../models/BolsaTrabajoHeader';
import BolsaTrabajoItem from '../models/BolsaTrabajoItem';
import BolsaTrabajoTitulo from '../models/BolsaTrabajoTitulo';
import EncuentroEgresados from '../models/EncuentroEgresados';
import EntidadCertificacionEvaluacion from '../models/EntidadCertificacionEvaluacion';
import MiembroSniiTipo from '../models/MiembroSniiTipo';
import MiembroSNII from '../models/MiembroSNII';
import Comite from '../models/Comite';
import ComiteCategory from '../models/ComiteCategory';
import DocumentoComite from '../models/DocumentoComite';
import ProgramaDesarrollo from '../models/ProgramaDesarrollo';
import ProgramaDesarrolloCategory from '../models/ProgramaDesarrolloCategory';
import NormatividadCategory from '../models/NormatividadCategory';
import NormatividadDocument from '../models/NormatividadDocument';
import SeminarioCafeRecurso from '../models/SeminarioCafeRecurso';
import Formulario from '../models/Formulario';
import Directorios from '../models/Directorios';
import Archivos from '../models/Archivos';
import Categorias from '../models/Categorias';
import Organigrama from '../models/Organigrama';
import PortalEstudiantes from '../models/PortalEstudiantes';
import ProductoInvestigacion from '../models/ProductoInvestigacion';
import ExtensionSection from '../models/ExtensionSection';
import ExtensionItem from '../models/ExtensionItem';
import ExtensionDocument from '../models/ExtensionDocument';
import ModalInicialConfig from '../models/ModalInicialConfig';
import PortalDocente from '../models/PortalDocente';
import PortalDocenteCategoria from '../models/PortalDocenteCategoria';
import PortalDocenteDocumento from '../models/PortalDocenteDocumento';
import User from '../models/User';
import SolicitudesCertificado from '../models/SolicitudesCertificado';
import SolicitudesTitulo from '../models/Solicitudes_titulo';
import SolicitudesImss from '../models/solicitudes_imss';
import ServicioSocialTipo from '../models/ServicioSocialTipo';
import VinculacionBannerTitulo from '../models/VinculacionBannerTitulo';

// Importar asociaciones para que se registren correctamente
import '../models/associations';

import BibliotecaLink from '../models/BibliotecaLink';
import BibliotecaConfig from '../models/BibliotecaConfig';

import CepimInfo from '../models/CepimInfo';
import CepimCard from '../models/CepimCard';
import CepimInfografia from '../models/CepimInfografia';

import ServicioSocialBanner from '../models/ServicioSocialBanner';
import ServicioTecnologicoBanner from '../models/ServicioTecnologicoBanner';
import MiembroSniiBanner from '../models/MiembroSniiBanner';
import RepositorioDigitalBanner from '../models/RepositorioDigitalBanner';
import SeminarioCafeBanner from '../models/SeminarioCafeBanner';
import EgresadosBanner from '../models/EgresadosBanner';
import EgresadosInfo from '../models/EgresadosInfo';
import EntidadCertificacionInfo from '../models/EntidadCertificacionInfo';
import SiteConfig from '../models/SiteConfig';

export const syncDatabase = async (force: boolean = false): Promise<void> => {
  // Probar conexiÃƒÂ³n primero
  await connectDatabase();

  // Importar todos los modelos para que se registren en Sequelize
  const models = [
    EntidadCertificacionEvaluacion,
    EntidadCertificacionInfo,
    Texto,
    Area,
    SolicitudesConstanciasKardex,
    NosotrosContent,
    Calendario,
    HeroSlide,
    Evento,
    Noticia,
    Anuncio,
    Carrera,
    VideoInstitucional,
    RelojDigital,
    ModeloEducativo,
    ProcesoAdmision,
    PasoAdmision,
    TramitesVista,
    FormularioConfig,
    ConvocatoriaTitulo,
    ConvocatoriaTituloBanner,
    ConvocatoriaDocumento,
    PersonalCarrera,
    CarreraSimple,
    OpcionReinscripcion,
    SeccionReinscripcion,
    BecaSection,
    BecaCategory,
    CepimInfo,
    CepimCard,
    CepimInfografia,
    EstadiaDocumento,
    TipoEstadia,
    ServicioTecnologico,
    VinculacionBannerDocumento,
    PracticasEstadiasBanner,
    EducacionContinuaCurso,
    EducacionContinuaInfo,
    EducacionContinuaVideo,
    EducacionContinuaBanner,
    EducacionContinuaCategoria,
    EducacionContinuaDocumento,
    FeriasProfesiograficasInfo,
    FeriasProfesiograficasBanner,
    FeriasProfesiograficasCategoria,
    FeriasProfesiograficasDocumento,
    FeriasProfesiograficasCurso,
    FeriasProfesiograficasVideo,
    PromocionInstitucionalInfo,
    PromocionInstitucionalBanner,
    PromocionInstitucionalCategoria,
    PromocionInstitucionalDocumento,
    PromocionInstitucionalCurso,
    PromocionInstitucionalVideo,
    VisitasGuiadasInfo,
    VisitasGuiadasBanner,
    VisitasGuiadasCategoria,
    VisitasGuiadasDocumento,
    VisitasGuiadasCurso,
    VisitasGuiadasVideo,
    ServicioSocialDocumento,
    // ServicioSocialTipo,
    ServicioTecnologicoRealizado,
    MovilidadInternacional,
    BolsaTrabajoTitulo,
    BolsaTrabajoHeader,
    BolsaTrabajoItem,
    EncuentroEgresados,
    MiembroSniiTipo,
    MiembroSNII,
    Comite,
    ComiteCategory,
    DocumentoComite,
    ProgramaDesarrollo,
    ProgramaDesarrolloCategory,
    NormatividadCategory,
    NormatividadDocument,
    Organigrama,
    PortalEstudiantes,
    ProductoInvestigacion,
    SeminarioCafeRecurso,
    Formulario,
    Directorios,
    Archivos,
    Categorias,
    ExtensionSection,
    ExtensionItem,
    ExtensionDocument,
    ModalInicialConfig,
    MoodleConfig,
    PortalDocente,
    PortalDocenteCategoria,
    PortalDocenteDocumento,
    User,
    SolicitudesCertificado,
    SolicitudesTitulo,
    SolicitudesImss,
    ServicioSocialTipo,
    VinculacionBannerTitulo,
    AdmisionBanner,
    Countdown,
    ContactConfig,
    BibliotecaLink,
    BibliotecaConfig,
    ModalidadDualConfig,
    ServicioSocialBanner,
    ServicioTecnologicoBanner,
    MiembroSniiBanner,
    RepositorioDigitalBanner,
    SeminarioCafeBanner,
    EgresadosBanner,
    EgresadosInfo,
    FooterConfig,
    Patrocinador,
    CarreraConfig,
    NoticiaConfig,
    SitemapCategory,
    SiteConfig,
  ];

  // Sincronizar modelos con la base de datos
  // await sequelize.sync({ force, alter: true });
  
  for (const model of models) {
    try {
      await model.sync({ force, alter: true });
      console.log(`Ã¢Å“â€¦ Modelo ${model.name} sincronizado`);
    } catch (error: any) {
      // Ignorar error de "Too many keys" en Area (ÃƒÂ­ndices duplicados)
      if (model.name === 'Area' && error.original?.code === 'ER_TOO_MANY_KEYS') {
        console.warn(`Ã¢Å¡Â Ã¯Â¸Â Advertencia: Se omitiÃƒÂ³ la sincronizaciÃƒÂ³n de 'Area' debido a ÃƒÂ­ndices duplicados (ER_TOO_MANY_KEYS). La tabla ya existe.`);
      } else {
        console.error(`Ã¢ÂÅ’ Error al sincronizar modelo ${model.name}:`, error.message);
        // No lanzar error para permitir que otros modelos se sincronicen
        // throw error; 
      }
    }
  }

  if (force) {
    console.log('Ã°Å¸â€â€ž Base de datos reiniciada - Tablas creadas');
    console.log('Ã°Å¸â€œâ€¹ Modelos registrados: Texto, Area, SolicitudesConstanciasKardex, NosotrosContent, Calendario, HeroSlide, Evento, Noticia, Anuncio, Carrera');
  } else {
    console.log('Ã¢Å“â€¦ Modelos sincronizados con la base de datos');
    console.log('Ã°Å¸â€â€” Asociaciones registradas correctamente');
  }

  try {
    // Inicializar BecaCategory por defecto si no existe ninguno
    const becaCategoryCount = await BecaCategory.count();
    if (becaCategoryCount === 0) {
      await BecaCategory.bulkCreate([
        { name: 'Becas Institucionales', slug: 'uni', icon_url: '/vectores/uttecam%20becas.svg', color: '#189984', order: 1, active: true },
        { name: 'Becas Benito Juárez', slug: 'gob', icon_url: '/vectores/imagen-removebg-preview-3-vectorized.svg', color: '#e11d48', order: 2, active: true }
      ]);
      console.log('🌱 Categorías de becas iniciales creadas con éxito');
    }

    // Inicializar CarreraConfig por defecto si no existe ninguno
    const carreraConfigCount = await CarreraConfig.count();
    if (carreraConfigCount === 0) {
      await CarreraConfig.create({});
      console.log('🌱 Configuración de carreras inicial creada con éxito');
    }

    // Inicializar NoticiaConfig por defecto si no existe ninguno
    const noticiaConfigCount = await NoticiaConfig.count();
    if (noticiaConfigCount === 0) {
      await NoticiaConfig.create({});
      console.log('🌱 Configuración de noticias inicial creada con éxito');
    }

    // Inicializar FooterConfig por defecto si no existe ninguno
    const footerCount = await FooterConfig.count();
    if (footerCount === 0) {
      await FooterConfig.create({});
      console.log('Ã°Å¸Å’Â± ConfiguraciÃƒÂ³n de footer inicial creada con ÃƒÂ©xito');
    }

    // Inicializar Patrocinadores por defecto si la tabla estÃƒÂ¡ vacÃƒÂ­a
    const patrocinadorCount = await Patrocinador.count();
    if (patrocinadorCount === 0) {
      const defaultPatrocinadores = [
        { nombre: 'Puebla', logo: '/logos/logoPuebla.png', website: 'https://www.puebla.gob.mx/' },
        { nombre: 'Educacion', logo: '/logos/logoESE.png', website: 'https://sep.puebla.gob.mx/' },
        { nombre: 'EDUCACIÃƒâ€œN', logo: '/logos/EDUCACIOÃŒÂN.png', website: 'https://dgutyp.sep.gob.mx/' },
        { nombre: 'EDUCERT', logo: '/logos/EDUCERT.jpg', website: 'https://consultapublicamx.plataformadetransparencia.org.mx/vut-web/faces/view/consultaPublica.xhtml#inicio' },
        { nombre: 'EDUCERT2', logo: '/logos/EDUCERT2.jpg', website: 'https://digitalpro.com' },
        { nombre: 'ANUIES', logo: '/logos/ANUIES.png', website: 'https://smartsolutions.com' },
        { nombre: 'CACEI', logo: '/logos/CACEI.png', website: 'https://futuretech.com' },
        { nombre: 'PNT', logo: '/logos/PNT.png', website: 'https://nextgen.com' },
        { nombre: 'RC', logo: '/logos/RC.png', website: 'https://techflow.com' },
        { nombre: 'CIEES', logo: '/logos/CIEES.png', website: 'https://codelab.com' },
        { nombre: 'UTyP', logo: '/logos/UTyP.png', website: 'https://codelab.com' }
      ];
      await Patrocinador.bulkCreate(defaultPatrocinadores);
      console.log('🌱 Patrocinadores iniciales creados con éxito');
    }

    // Inicializar SitemapCategory por defecto si la tabla está vacía
    const sitemapCategoryCount = await SitemapCategory.count();
    if (sitemapCategoryCount === 0) {
      const defaultSitemap = [
        {
          title: "Inicio y General",
          icon: "Home",
          order: 1,
          active: true,
          items: [
            { label: "Página de Inicio", href: "/" },
            { label: "Quiénes Somos (General)", href: "/quienes-somos" }
          ]
        },
        {
          title: "Quiénes Somos",
          icon: "Users",
          order: 2,
          active: true,
          items: [
            { label: "Nosotros", href: "/nosotros" },
            { label: "Directorio Institucional", href: "/directorio" },
            { label: "Organigrama", href: "/organigrama" },
            { label: "Calendario Escolar", href: "/calendario" },
            { label: "Disposición Jurídica y Normatividad", href: "/normatividad" },
            { label: "Programas de Desarrollo", href: "/programas-desarrollo" },
            { label: "Comité Académico", href: "/comite-academico" },
            { label: "Comité de Vinculación", href: "/comite-vinculacion" },
            { label: "Comité de Calidad", href: "/comite-calidad" },
            { label: "Comité de Investigación", href: "/comite-investigacion" }
          ]
        },
        {
          title: "Servicios Escolares",
          icon: "GraduationCap",
          order: 3,
          active: true,
          items: [
            { label: "Proceso de Admisión", href: "/proceso-admision" },
            { label: "Proceso de Admisión a Maestría", href: "/proceso-admision-maestria" },
            { label: "Trámites Escolares", href: "/tramites-escolares" },
            { label: "Convocatoria a Trámite de Título", href: "/convocatoria-titulo" },
            { label: "Becas y Apoyos Académicos", href: "/becas-academicas" },
            { label: "Biblioteca Digital", href: "/biblioteca-digital" },
            { label: "Modalidad Dual", href: "/modalidad-dual" },
            { label: "Portal Docente", href: "/portal-docente" }
          ]
        },
        {
          title: "Academia",
          icon: "BookOpen",
          order: 4,
          active: true,
          items: [
            { label: "Carreras y Oferta Educativa", href: "/#carreras" }
          ]
        },
        {
          title: "Vinculación",
          icon: "Link",
          order: 5,
          active: true,
          items: [
            { label: "Vinculación", href: "/vinculacion-banner" },
            { label: "Prácticas y Estadías", href: "/estadias" },
            { label: "Servicio Social", href: "/servicio-social" },
            { label: "Catálogo de Servicios Tecnológicos", href: "/ServiciosTecnologicos" },
            { label: "Educación Continua (General)", href: "/educacion-continua" },
            { label: "Cursos y Talleres de Educación Continua", href: "/educacion-continua/cursos" },
            { label: "Bolsa de Trabajo", href: "/bolsaTrabajo" },
            { label: "Encuentro de Egresados", href: "/egresados" },
            { label: "Entidad de Certificación y Evaluación", href: "/entidad-certificacion-evaluacion" },
            { label: "Centro de Promoción de Invenciones (CEPIM)", href: "/cepim" },
            { label: "Docentes Miembros del SNII", href: "/MiembrosSnii" },
            { label: "Repositorio Digital de Investigación", href: "/repositorio-digital-investigacion" },
            { label: "Seminario Café Científico", href: "/seminario-cafe-cientifico" }
          ]
        },
        {
          title: "Extensión Universitaria",
          icon: "Activity",
          order: 6,
          active: true,
          items: [
            { label: "Talleres Culturales", href: "/talleres-culturales" },
            { label: "Talleres Deportivos", href: "/talleres-deportivos" },
            { label: "Ferias Profesiográficas", href: "/ferias-profesoigraficas" },
            { label: "Promoción Institucional", href: "/promocion-institucional" },
            { label: "Visitas Guiadas", href: "/visitas-guiadas" },
            { label: "Gacetas Universitarias", href: "/gacetas" },
            { label: "Servicio Médico", href: "/servicio-medico" }
          ]
        },
        {
          title: "Accesos",
          icon: "Key",
          order: 7,
          active: true,
          items: [
            { label: "Portal Estudiantes \"Mi Escuela\"", href: "/portal-estudiantes" },
            { label: "PIT - Portal Docentes", href: "/programa-institucional-tutorias" }
          ]
        },
        {
          title: "Transparencia",
          icon: "FileText",
          order: 8,
          active: true,
          items: [
            { label: "Obligaciones de Transparencia", href: "https://consultapublicamx.plataformadetransparencia.org.mx/vut-web/faces/view/consultaPublica.xhtml#inicio", isExternal: true }
          ]
        }
      ];
      await SitemapCategory.bulkCreate(defaultSitemap);
      console.log('🌱 Categorías iniciales del mapa de sitio creadas con éxito');
    }

    // Inicializar enlaces de biblioteca por defecto si está vacío
    const libraryCount = await BibliotecaLink.count();
    if (libraryCount === 0) {
      const defaultBooks = [
        {
          title: 'eLibro',
          subtitle: 'Biblioteca Digital',
          description: 'Plataforma de libros electrónicos académicos. Acceso a miles de títulos en español.',
          url: 'https://elibro.net/es/lc/uttecam/login_usuario/?next=/es/lc/uttecam/inicio/',
          icon: 'BookOpen',
          spineColor: '#0c4a6e',
          category: 'E-BOOKS',
          order: 1
        },
        {
          title: 'Biblioteca Colmex',
          subtitle: 'El Colegio de México',
          description: 'Recursos bibliográficos y acervos digitales de El Colegio de México.',
          url: 'https://biblioteca.colmex.mx/',
          icon: 'Library',
          spineColor: '#064e3b',
          category: 'BIBLIOTECA',
          order: 2
        },
        {
          title: 'Contaduría y Administración',
          subtitle: 'UNAM',
          description: 'Revista internacional de investigación financiera y administrativa.',
          url: 'http://www.cya.unam.mx/index.php/cya',
          icon: 'Newspaper',
          spineColor: '#7f1d1d',
          category: 'REVISTA',
          order: 3
        },
        {
          title: 'Biblioteca RAE',
          subtitle: 'Real Academia Española',
          description: 'Colección bibliográfica y recursos lingüísticos de la Real Academia Española.',
          url: 'https://www.rae.es/biblioteca',
          icon: 'Languages',
          spineColor: '#78350f',
          category: 'LINGÜÍSTICA',
          order: 4
        },
        {
          title: 'Cervantes Virtual',
          subtitle: 'Biblioteca Miguel de Cervantes',
          description: 'Fondo digital de obras clásicas en lenguas hispánicas.',
          url: 'https://www.cervantesvirtual.com/',
          icon: 'Book',
          spineColor: '#1e1b4b',
          category: 'CLÁSICOS',
          order: 5
        },
        {
          title: 'Redalyc',
          subtitle: 'Red Científica Latinoamericana',
          description: 'Red de Revistas Científicas de América Latina y el Caribe, España y Portugal.',
          url: 'https://www.redalyc.org/',
          icon: 'Globe',
          spineColor: '#14532d',
          category: 'CIENCIAS',
          order: 6
        },
        {
          title: 'SciELO México',
          subtitle: 'Biblioteca Científica en Línea',
          description: 'Biblioteca científica electrónica con acceso abierto a revistas de investigación.',
          url: 'https://scielo.org.mx/',
          icon: 'Search',
          spineColor: '#4a1772',
          category: 'INVESTIGACIÓN',
          order: 7
        },
        {
          title: 'Biblioteca UNAM',
          subtitle: 'Acceso abierto',
          description: 'Acceso libre a tesis, libros y revistas de la Universidad Nacional Autónoma de México.',
          url: 'https://bidi.unam.mx/acceso-libre',
          icon: 'GraduationCap',
          spineColor: '#134e4a',
          category: 'UNIVERSIDAD',
          order: 8
        },
        {
          title: 'Biblioteca SCJN',
          subtitle: 'Suprema Corte de Justicia',
          description: 'Acervo jurídico y documental de la Suprema Corte de Justicia de la Nación.',
          url: 'https://bibliotecadigital.scjn.gob.mx/',
          icon: 'Scale',
          spineColor: '#1e293b',
          category: 'JURÍDICO',
          order: 9
        },
        {
          title: 'ILCE',
          subtitle: 'Recursos Educativos',
          description: 'Recursos educativos del Instituto Latinoamericano de la Comunicación Educativa.',
          url: 'https://www.ilce.edu.mx/',
          icon: 'MonitorPlay',
          spineColor: '#7c2d12',
          category: 'EDUCACIÓN',
          order: 10
        },
        {
          title: 'Biblioteca Chapingo',
          subtitle: 'Universidad Autónoma Chapingo',
          description: 'Recursos especializados en agronomía y ciencias afines.',
          url: 'https://biblioteca.chapingo.mx/biblioteca-digital-3/',
          icon: 'Sprout',
          spineColor: '#365314',
          category: 'AGRONOMÍA',
          order: 11
        },
        {
          title: 'PruebaT',
          subtitle: 'Fundación Carlos Slim',
          description: 'Plataforma de aprendizaje y biblioteca digital gratuita de la Fundación Carlos Slim.',
          url: 'https://pruebat.org/biblioteca-digital',
          icon: 'Laptop',
          spineColor: '#1e3a5f',
          category: 'APRENDIZAJE',
          order: 12
        },
        {
          title: 'Ciencias Agrícolas',
          subtitle: 'INIFAP',
          description: 'Revista Mexicana de Ciencias Agrícolas del Instituto Nacional de Investigaciones.',
          url: 'https://cienciasagricolas.inifap.gob.mx/index.php/agricolas',
          icon: 'Wheat',
          spineColor: '#713f12',
          category: 'REVISTA',
          order: 13
        },
        {
          title: 'Recursos UANL',
          subtitle: 'Universidad Autónoma de Nuevo León',
          description: 'Bases de datos y colecciones de la Universidad Autónoma de Nuevo León.',
          url: 'https://recursos.db.uanl.mx/',
          icon: 'Database',
          spineColor: '#881337',
          category: 'BASES DE DATOS',
          order: 14
        }
      ];
      await BibliotecaLink.bulkCreate(defaultBooks);
      console.log('🌱 Enlaces de biblioteca iniciales creados con éxito');
    }
  } catch (seedError: any) {
    console.error('❌ Error al realizar el seed de la base de datos:', seedError.message);
  }
};

// FunciÃƒÂ³n para insertar datos iniciales (usar scripts separados)
export const seedDatabase = async (): Promise<void> => {
  console.log('Ã°Å¸â€™Â¡ Los datos iniciales se insertan con scripts separados:');
  console.log('   - npm run seed:areas');
  console.log('   - ts-node scripts/seed-nosotros.ts');
};