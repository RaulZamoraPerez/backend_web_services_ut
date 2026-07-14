#!/usr/bin/env ts-node
/**
 * Script básico para poblar la base de datos con:
 * - Usuario admin
 * - 11 carreras (7 ingenierías + 4 licenciaturas)
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import sequelize from '../src/config/database';
import User from '../src/models/User';
import Carrera from '../src/models/Carrera';
import ExtensionSection from '../src/models/ExtensionSection';
import ExtensionItem from '../src/models/ExtensionItem';
import ExtensionDocument from '../src/models/ExtensionDocument';
import NosotrosContent from '../src/models/Nosotros';
import HeroSlide from '../src/models/HeroSlide';
import ModeloEducativo from '../src/models/ModeloEducativo';
import PortalEstudiantes from '../src/models/PortalEstudiantes';
import { programs } from './data/data/programs';
import { programDetails } from './data/data/programDetails';

// ============================================================================
// FUNCIONES DE SEED
// ============================================================================

const cleanTitle = (title: string) => title.replace(/_2025/g, '').replace(/_/g, ' ').trim();
const generateSiglas = (title: string) => {
  const words = title.split(' ');
  if (words.length === 1) return words[0].substring(0, 4).toUpperCase();
  return words.map(w => w[0]).join('').toUpperCase().substring(0, 10);
};

const mapNivel = (category: string): 'TSU' | 'Ingenieria' | 'Licenciatura' => {
  if (category.includes('Ingenier')) return 'Ingenieria' as const;
  if (category.includes('Licenciatura')) return 'Licenciatura' as const;
  return 'TSU' as const;
};

/**
 * 1. Crear usuario administrador
 */
async function seedAdmin() {
  console.log('\n🔐 1. Creando usuario Admin...');
  try {
    await User.destroy({ where: {} });
    
    const adminData = {
      username: 'admin',
      email: 'admin@uttecam.edu.mx',
      password: 'Admin123!@#',
      role: 'admin' as const,
      isActive: true
    };

    const hashed = await bcrypt.hash(adminData.password, 12);
    await User.create({ 
      username: adminData.username, 
      email: adminData.email, 
      password: hashed, 
      role: adminData.role, 
      isActive: adminData.isActive 
    });
    
    console.log('   ✅ Admin creado: admin@uttecam.edu.mx / Admin123!@#');
  } catch (err) {
    console.error('   ❌ Error creando admin:', err);
    throw err;
  }
}

/**
 * 2. Poblar 11 Carreras (7 Ingenierías + 4 Licenciaturas)
 */
async function seedCarreras() {
  console.log('\n🎓 2. Creando 11 Carreras...');
  try {
    await Carrera.destroy({ where: {} });

    // Mapeo de carreras a archivos de medios (los nombres coinciden con archivos reales en uploads)
    const imageMap: Record<number, {portada: string, video: string}> = {
      1: { portada: 'TICS REDES DIGITALES_2025.jpg', video: 'TICS.mp4' },  // TICs Software (usar misma portada)
      2: { portada: 'TICS REDES DIGITALES_2025.jpg', video: 'TICS.mp4' },  // TICs Redes
      3: { portada: 'AGRICULTURA_2025.jpg', video: 'AGRICULTURA.mp4' },
      4: { portada: 'MECATRÓNICA_2025.jpg', video: 'MECATRONICA.mp4' },
      5: { portada: 'MANTENIMIENTO INDUSTRIAL_2025.jpg', video: 'MANTENIMIENTO.mp4' },
      6: { portada: 'ALIMENTOS_2025_2025.jpg', video: 'ALIMENTOS.mp4' },
      7: { portada: 'INGENIERIA INDUSTRIAL.jpg', video: 'INDUSTRIAL.mp4' },
      8: { portada: 'CONTADURÍA_2025.jpg', video: 'CONTADURIA.mp4' },
      9: { portada: 'ADMINISTRACIÓN_CAPITAL HUMANO.jpg', video: 'ADMINISTRACION.mp4' },
      10: { portada: 'ADMINISTRACIÓN_FORMULACIÓN DE PROYECTOS.jpg', video: 'ADMINISTRACION.mp4' },
      11: { portada: 'NEGOCIOS Y MERCADOTECNIA.jpg', video: 'MERCADOTECNIA.mp4' }
    };

    const carrerasData: any[] = [];
    
    for (const detail of programDetails) {
      const programInfo = programs.find((p: any) => p.id === detail.programId);
      if (!programInfo) continue;
      
      const nombre = cleanTitle(programInfo.title);
      const siglas = generateSiglas(nombre);
      const nivel = mapNivel(programInfo.category);
      const duracion = programInfo.duration || '';
      
      const files = imageMap[detail.programId] || { portada: '', caratula: '', video: '' };
      
      const perfil_ingreso = detail.admissionProfile?.trim() || '';
      const perfil_egreso = detail.graduateProfile?.trim() || '';
      const campo_laboral = detail.laborField?.join('\n') || '';
      const mapa_curricular = detail.studyPlan || null;
      
      carrerasData.push({
        nombre,
        siglas,
        nivel,
        duracion,
        objetivo: 'Formar profesionistas competitivos, con capacidad para analizar, diseñar, desarrollar e implementar soluciones tecnológicas e innovadoras.',
        perfil_ingreso,
        perfil_egreso,
        campo_laboral,
        imagen: files.portada ? `/uploads/carreras/portadas/${files.portada}` : '',
        video_url: files.video ? `/uploads/carreras/videos/${files.video}` : '',
        mapa_curricular,
        orden: detail.programId,
        activo: true
      });
    }

    for (const c of carrerasData) {
      await Carrera.create(c);
    }
    
    const ingenierias = carrerasData.filter(c => c.nivel === 'Ingenieria').length;
    const licenciaturas = carrerasData.filter(c => c.nivel === 'Licenciatura').length;
    
    console.log(`   ✅ ${carrerasData.length} Carreras creadas:`);
    console.log(`      - ${ingenierias} Ingenierías`);
    console.log(`      - ${licenciaturas} Licenciaturas`);
  } catch (err) {
    console.error('   ❌ Error creando carreras:', err);
    throw err;
  }
}

/**
 * 3. Poblar contenido de Nosotros
 */
async function seedNosotros() {
  console.log('\n📄 3. Creando contenido Nosotros...');
  try {
    await NosotrosContent.destroy({ where: {} });

    const nosotrosData = {
      politicaIntegral: {
        title: 'Política Integral',
        content: 'En la Universidad Tecnológica de Tecamachalco, estamos comprometidos con la excelencia académica, la formación integral de nuestros estudiantes y el desarrollo sustentable de nuestra comunidad.',
        imageSrc: '/uploads/nosotros/politica-integral.jpg'
      },
      mision: {
        title: 'Misión',
        content: 'Formar profesionistas competentes, creativos, críticos y comprometidos con el desarrollo sustentable de su entorno, mediante programas educativos pertinentes y de calidad.',
        imageSrc: '/uploads/nosotros/mision.jpg'
      },
      vision: {
        title: 'Visión',
        content: 'Ser una universidad tecnológica reconocida por su calidad educativa, vinculación efectiva con el sector productivo y contribución al desarrollo regional.',
        imageSrc: '/uploads/nosotros/vision.jpg'
      },
      valores: {
        title: 'Valores',
        content: 'Honestidad, Responsabilidad, Respeto, Compromiso, Solidaridad, Calidad, Innovación.',
        imageSrc: '/uploads/nosotros/valores.jpg'
      },
      modeloEducativo: {
        title: 'Modelo Educativo',
        content: 'Nuestro modelo educativo se basa en competencias profesionales, con enfoque práctico y vinculación permanente con el sector productivo.',
        imageSrc: '/uploads/nosotros/modelo-educativo.jpg'
      },
      historia: {
        title: 'Historia',
        content: 'La Universidad Tecnológica de Tecamachalco fue creada para contribuir al desarrollo de la región mediante la formación de profesionistas altamente capacitados.',
        imageSrc: '/uploads/nosotros/historia.jpg'
      }
    };

    await NosotrosContent.create(nosotrosData as any);
    console.log('   ✅ Contenido Nosotros creado');
  } catch (err) {
    console.error('   ❌ Error creando nosotros:', err);
    throw err;
  }
}

/**
 * 4. Poblar Hero Slides (Carrusel principal)
 */
async function seedHeroSlides() {
  console.log('\n🎬 4. Creando Hero Slides...');
  try {
    await HeroSlide.destroy({ where: {} });

    const slides = [
      {
        titulo: 'Bienvenidos a UTTECAM',
        tipo: 'imagen' as const,
        archivo: '/uploads/hero/slide1.jpg',
        orden: 1,
        activo: true
      },
      {
        titulo: 'Oferta Educativa 2025',
        tipo: 'imagen' as const,
        archivo: '/uploads/hero/slide2.jpg',
        orden: 2,
        activo: true
      },
      {
        titulo: 'Inscripciones Abiertas',
        tipo: 'imagen' as const,
        archivo: '/uploads/hero/slide3.jpg',
        orden: 3,
        activo: true
      }
    ];

    for (const slide of slides) {
      await HeroSlide.create(slide);
    }

    console.log(`   ✅ ${slides.length} Hero Slides creados`);
  } catch (err) {
    console.error('   ❌ Error creando hero slides:', err);
    throw err;
  }
}

/**
 * 5. Poblar Modelo Educativo
 */
async function seedModeloEducativo() {
  console.log('\n📚 5. Creando Modelo Educativo...');
  try {
    await ModeloEducativo.destroy({ where: {} });

    const modeloData = {
      titulo_principal: 'Modelos Educativos',
      descripcion_principal: 'Conoce nuestro enfoque educativo diseñado para formar profesionistas competitivos.',
      titulo_seccion: 'Modelo Educativo UTTECAM',
      descripcion_seccion: 'El modelo educativo de la Universidad Tecnológica de Tecamachalco se fundamenta en el desarrollo de competencias profesionales, vinculación con el sector productivo y formación integral.',
      imagen_url: '/uploads/carreras/portadas/MODELO EDUCATIVO 2025.jpg',
      caracteristicas: [
        {
          number: 1,
          title: 'Educación basada en competencias',
          description: 'Formación práctica y teórica orientada al desarrollo de habilidades profesionales.'
        },
        {
          number: 2,
          title: 'Vinculación empresarial',
          description: 'Colaboración estrecha con el sector productivo para prácticas y estadías.'
        },
        {
          number: 3,
          title: 'Innovación educativa',
          description: 'Uso de tecnologías emergentes y metodologías activas de aprendizaje.'
        },
        {
          number: 4,
          title: 'Formación integral',
          description: 'Desarrollo de valores, responsabilidad social y sustentabilidad.'
        }
      ],
      activo: true
    };

    await ModeloEducativo.create(modeloData);
    console.log('   ✅ Modelo Educativo creado');
  } catch (err) {
    console.error('   ❌ Error creando modelo educativo:', err);
    throw err;
  }
}

/**
 * 6. Poblar Portal Estudiantes
 */
async function seedPortalEstudiantes() {
  console.log('\n🎓 6. Limpiando Portal Estudiantes...');
  try {
    await PortalEstudiantes.destroy({ where: {} });
    console.log('   ✅ Portal Estudiantes limpio');
  } catch (err) {
    console.error('   ❌ Error limpiando portal estudiantes:', err);
    throw err;
  }
}

/**
 * 7. Poblar Extensión Universitaria
 */
async function seedExtensionUniversitaria() {
  console.log('\n🎨 7. Creando Extensión Universitaria...');
  try {
    await ExtensionSection.destroy({ where: {} });
    await ExtensionItem.destroy({ where: {} });
    await ExtensionDocument.destroy({ where: {} });

    // 3.1 Secciones
    const sections = [
      {
        slug: 'talleres-culturales',
        title: 'Talleres Culturales',
        description: 'Desarrolla tu creatividad y talento artístico en nuestros talleres especializados',
        banner_url: '/uploads/Actividades Culturales y Deportivas/Culturales/BANNER DEPORTIVOS CULTURALES_UTTECAM.jpg',
        is_enabled: true
      },
      {
        slug: 'talleres-deportivos',
        title: 'Talleres Deportivos',
        description: 'Fortalece tu cuerpo y mente a través del deporte y la actividad física',
        banner_url: '/uploads/Actividades Culturales y Deportivas/Deportivas/BANNER DEPORTIVOS_UTTECAM 1-01.jpg',
        is_enabled: true
      },
      {
        slug: 'servicio-medico',
        title: 'Servicio Médico',
        description: 'Atención médica y primeros auxilios para la comunidad universitaria',
        banner_url: '/uploads/ExtensionUniversitaria/ServicioMedico/SERVICIO MÉDICO.jpg',
        is_enabled: true
      },
      {
        slug: 'ferias-profesoigraficas',
        title: 'Ferias Profesoigráficas',
        description: 'Conoce las oportunidades de empleo y prácticas empresariales en nuestras ferias profesoigráficas.',
        banner_url: '/uploads/ExtensionUniversitaria/DifusionyDivulgacion/Ferias/BANNER_FERIAS.jpg',
        is_enabled: true
      },
      {
        slug: 'visitas-guiadas',
        title: 'Visitas Guiadas',
        description: 'Visitas guiadas para estudiantes y públicos interesados en conocer la infraestructura y proyectos de UTTECAM.',
        banner_url: '/uploads/ExtensionUniversitaria/DifusionyDivulgacion/Visitas/BANNER_VISITAS.jpg',
        is_enabled: true
      }
    ];

    for (const sectionData of sections) {
      const section = await ExtensionSection.create(sectionData);

      // Add items for Servicio Medico
      if (section.slug === 'servicio-medico') {
        const services = [
          { title: 'Atención de primeros auxilios', icon: 'HeartPulse' },
          { title: 'Orientación médica básica', icon: 'HeartPulse' },
          { title: 'Control de signos vitales', icon: 'HeartPulse' },
          { title: 'Apoyo en situaciones de emergencia', icon: 'HeartPulse' },
          { title: 'Promoción de la salud y prevención', icon: 'HeartPulse' }
        ];

        for (const service of services) {
          await ExtensionItem.create({
            section_id: section.id,
            title: service.title,
            icon: service.icon
          });
        }
      }
    }

    // 3.2 Documentos de Promoción
    const promocionDocs = [
      { title: "Ingreso UTTECAM 2025", file_url: "/uploads/ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/INGRESO_UTTECAM_2025.jpg" },
      { title: "Oferta Educativa UTTECAM 2025", file_url: "/uploads/ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/OFERTA_EDUCATIVA_UTTECAM_2025_DIGITAL.pdf" },
      { title: "QR WhatsApp UTTECAM", file_url: "/uploads/ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/QR_WHATSAPP_UTTECAM.png" },
      { title: "Tabloide Becas", file_url: "/uploads/ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/TABLOIDE_BECAS.pdf" },
    ];

    for (const doc of promocionDocs) {
      const ext = doc.file_url.split('.').pop()?.toLowerCase() || '';
      const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
      const mime = isImage ? `image/${ext === 'jpg' ? 'jpeg' : ext}` : (ext === 'pdf' ? 'application/pdf' : 'application/octet-stream');
      const media_type = isImage ? 'image' : 'document';
      
      await ExtensionDocument.create({
        category: 'promocion',
        title: doc.title,
        file_url: doc.file_url,
        mime_type: mime,
        media_type
      });
    }

    console.log('   ✅ 5 Secciones creadas');
    console.log('   ✅ 5 Servicios médicos agregados');
    console.log('   ✅ 4 Documentos de promoción agregados');
  } catch (err) {
    console.error('   ❌ Error creando extensión universitaria:', err);
    throw err;
  }
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

async function main() {
  console.log('🌱 ========================================');
  console.log('🌱 UTTECAM - Seed Completo del Sitio');
  console.log('🌱 ========================================');
  console.log(`📍 Database: ${process.env.DB_NAME || 'uttecam'}`);
  console.log(`📍 Host: ${process.env.DB_HOST || 'localhost'}`);
  
  try {
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a BD establecida\n');

    // Borrar y recrear tablas
    console.log('🗑️  Borrando y recreando tablas...');
    await sequelize.sync({ force: true });
    console.log('✅ Tablas recreadas\n');

    // Ejecutar seeds en orden
    await seedAdmin();
    await seedCarreras();
    await seedNosotros();
    await seedHeroSlides();
    await seedModeloEducativo();
    await seedPortalEstudiantes();
    await seedExtensionUniversitaria();

    console.log('\n🎉 ========================================');
    console.log('🎉 ¡Sitio completo poblado exitosamente!');
    console.log('🎉 ========================================\n');
    
    process.exit(0);
  } catch (err) {
    console.error('\n💥 ========================================');
    console.error('💥 Error durante el proceso de seed:');
    console.error('💥 ========================================');
    console.error(err);
    process.exit(1);
  }
}

// Ejecutar
if (require.main === module) {
  main();
}

export { seedAdmin, seedCarreras, seedNosotros, seedHeroSlides, seedModeloEducativo, seedPortalEstudiantes, seedExtensionUniversitaria };
