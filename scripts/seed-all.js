#!/usr/bin/env node
/**
 * Script Maestro para poblar toda la base de datos
 * Versión de producción en JavaScript
 * Ejecuta todos los seeds en el orden correcto
 */

require('dotenv/config');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
let CONTENIDO_INICIAL, programDetails, programs;
try {
  // Try to load compiled dist versions first (production build)
  ({ CONTENIDO_INICIAL } = require('../dist/scripts/seeds/data/nosotrosData'));
  ({ programDetails } = require('../dist/scripts/data/programDetailsData'));
  ({ programs } = require('../dist/scripts/data/programsData'));
} catch (e) {
  // Fallback to source TS files for development
  ({ CONTENIDO_INICIAL } = require('./seeds/data/nosotrosData'));
  ({ programDetails } = require('./data/programDetailsData'));
  ({ programs } = require('./data/programsData'));
}
// Prefer compiled dist models in production, fallback to src during development
let ExtensionSection, ExtensionItem, ExtensionDocument, User, Carrera, NosotrosContent;
try {
  ExtensionSection = require('../dist/src/models/ExtensionSection').default;
  ExtensionItem = require('../dist/src/models/ExtensionItem').default;
  ExtensionDocument = require('../dist/src/models/ExtensionDocument').default;
  User = require('../dist/src/models/User').default;
  Carrera = require('../dist/src/models/Carrera').default;
  NosotrosContent = require('../dist/src/models/Nosotros').default;
} catch (e) {
  ExtensionSection = require('../src/models/ExtensionSection').default;
  ExtensionItem = require('../src/models/ExtensionItem').default;
  ExtensionDocument = require('../src/models/ExtensionDocument').default;
  User = require('../src/models/User').default;
  Carrera = require('../src/models/Carrera').default;
  NosotrosContent = require('../src/models/Nosotros').default;
}
const sequelize = require('../src/config/database').default;

// Configuración
const isProduction = process.env.NODE_ENV === 'production';
const devMode = process.argv.includes('--dev') || !isProduction;
const DEFAULT_IMAGE = 'https://via.placeholder.com/600x400?text=UTTECAM';

const normalizeImageForProd = (imagePath) => {
  if (!imagePath) return DEFAULT_IMAGE;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  return devMode ? imagePath : DEFAULT_IMAGE;
};

// ============================================================================
// MODELOS
// ============================================================================

// Usar los modelos ya definidos en src/models para respetar timestamps y convenciones

// ============================================================================
// FUNCIONES DE SEED
// ============================================================================

async function seedAdmin() {
  console.log('\n🔐 1. Seeding Admin User...');
  try {
    await User.sync();
    
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (existingAdmin) {
      console.log('   ⚠️  Admin already exists, skipping.');
      return;
    }

    const adminData = {
      username: 'admin',
      email: 'admin@uttecam.edu.mx',
      password: 'Admin123!@#',
      role: 'admin',
      isActive: true
    };
    
    const hashed = await bcrypt.hash(adminData.password, 12);
    await User.create({ username: adminData.username, email: adminData.email, password: hashed, role: adminData.role, isActive: adminData.isActive });
    console.log('   ✅ Admin user created successfully');
  } catch (err) {
    console.error('   ❌ Error seeding admin:', err);
    throw err;
  }
}

async function seedNosotros() {
  console.log('\n📄 2. Seeding Nosotros Content...');
  try {
    await NosotrosContent.sync();
    await NosotrosContent.destroy({ where: {} });

    const content = JSON.parse(JSON.stringify(CONTENIDO_INICIAL));
    
    if (!devMode) {
      content.politicaIntegral.imageSrc = normalizeImageForProd(content.politicaIntegral.imageSrc);
      content.vision.imageSrc = normalizeImageForProd(content.vision.imageSrc);
      content.mision.imageSrc = normalizeImageForProd(content.mision.imageSrc);
      content.valores.imageSrc = normalizeImageForProd(content.valores.imageSrc);
    }

    await NosotrosContent.create(content);
    console.log('   ✅ Nosotros content seeded successfully');
  } catch (err) {
    console.error('   ❌ Error seeding nosotros:', err);
    throw err;
  }
}

const cleanTitle = (title) => title.replace(/_2025/g, '').replace(/_/g, ' ').trim();
const generateSiglas = (title) => {
  const words = title.split(' ');
  if (words.length === 1) return words[0].substring(0, 4).toUpperCase();
  return words.map(w => w[0]).join('').toUpperCase().substring(0, 10);
};

const mapNivel = (category) => {
  if (category.includes('Ingenier')) return 'Ingenieria';
  if (category.includes('Licenciatura')) return 'Licenciatura';
  return 'TSU';
};

async function seedCarreras() {
  console.log('\n🎓 3. Seeding Carreras...');
  try {
    await Carrera.sync();
    await Carrera.destroy({ where: {} });

    let data = [];
    
    for (const detail of programDetails) {
      const programInfo = programs.find(p => p.id === detail.programId);
      if (!programInfo) continue;
      
      const nombre = cleanTitle(programInfo.title);
      const siglas = generateSiglas(nombre);
      const nivel = mapNivel(programInfo.category);
      const duracion = programInfo.duration || '';
      const imagen = `portadas/${programInfo.image?.replace('PE2025/', '') || ''}`;
      const perfil_ingreso = detail.admissionProfile?.trim() || '';
      const perfil_egreso = detail.graduateProfile?.trim() || '';
      const campo_laboral = detail.laborField?.join('\n') || '';
      const imagen_local = `caratulas/${detail.profileImage}`;
      
      data.push({
        nombre,
        siglas,
        nivel,
        duracion,
        objetivo: 'Formar profesionistas competitivos, con capacidad para analizar, diseñar, desarrollar e implementar soluciones tecnológicas e innovadoras.',
        perfil_ingreso,
        perfil_egreso,
        campo_laboral,
        imagen: devMode ? imagen_local : normalizeImageForProd(imagen),
        video_url: detail.videoUrl || '',
        orden: detail.programId,
        activo: true
      });
    }

    for (const c of data) {
      await Carrera.create(c);
    }
    
    console.log(`   ✅ ${data.length} carreras seeded successfully`);
  } catch (err) {
    console.error('   ❌ Error seeding carreras:', err);
    throw err;
  }
}

async function seedExtensionUniversitaria() {
  console.log('\n🎨 4. Seeding Extension Universitaria...');
  try {
    await ExtensionSection.sync();
    await ExtensionItem.sync();
    await ExtensionDocument.sync();

    const sections = [
      {
        slug: 'talleres-culturales',
        title: 'Talleres Culturales',
        description: 'Desarrolla tu creatividad y talento artístico en nuestros talleres especializados',
        banner_url: '/uploads/Actividades Culturales y Deportivas/Culturales/BANNER DEPORTIVOS CULTURALES_UTTECAM.jpg'
      },
      {
        slug: 'talleres-deportivos',
        title: 'Talleres Deportivos',
        description: 'Fortalece tu cuerpo y mente a través del deporte y la actividad física',
        banner_url: '/uploads/Actividades Culturales y Deportivas/Deportivas/BANNER DEPORTIVOS_UTTECAM 1-01.jpg'
      },
      {
        slug: 'servicio-medico',
        title: 'Servicio Médico',
        description: 'Atención médica y primeros auxilios para la comunidad universitaria',
        banner_url: '/uploads/ExtensionUniversitaria/ServicioMedico/SERVICIO MÉDICO.jpg'
      },
      {
        slug: 'ferias-profesoigraficas',
        title: 'Ferias Profesoigráficas',
        description: 'Conoce las oportunidades de empleo y prácticas empresariales',
        banner_url: '/uploads/ExtensionUniversitaria/DifusionyDivulgacion/Ferias/BANNER_FERIAS.jpg'
      },
      {
        slug: 'visitas-guiadas',
        title: 'Visitas Guiadas',
        description: 'Visitas guiadas para conocer la infraestructura y proyectos de UTTECAM',
        banner_url: '/uploads/ExtensionUniversitaria/DifusionyDivulgacion/Visitas/BANNER_VISITAS.jpg'
      }
    ];

    for (const sectionData of sections) {
      const [section] = await ExtensionSection.findOrCreate({
        where: { slug: sectionData.slug },
        defaults: sectionData
      });
      
      await section.update(sectionData);

      if (section.slug === 'servicio-medico') {
        const services = [
          { title: 'Atención de primeros auxilios', icon: 'HeartPulse' },
          { title: 'Orientación médica básica', icon: 'HeartPulse' },
          { title: 'Control de signos vitales', icon: 'HeartPulse' },
          { title: 'Apoyo en situaciones de emergencia', icon: 'HeartPulse' },
          { title: 'Promoción de la salud y prevención', icon: 'HeartPulse' }
        ];

        await ExtensionItem.destroy({ where: { section_id: section.id } });

        for (const service of services) {
          await ExtensionItem.create({
            section_id: section.id,
            title: service.title,
            icon: service.icon
          });
        }
      }
    }

    const promocionDocs = [
      { title: "Ingreso UTTECAM 2025", file_url: "ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/INGRESO_UTTECAM_2025.jpg" },
      { title: "Oferta Educativa UTTECAM 2025", file_url: "ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/OFERTA_EDUCATIVA_UTTECAM_2025_DIGITAL.pdf" },
      { title: "QR WhatsApp UTTECAM", file_url: "ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/QR_WHATSAPP_UTTECAM.png" },
      { title: "Tabloide Becas", file_url: "ExtensionUniversitaria/DifusionyDivulgacion/PromocionInstitucional/TABLOIDE_BECAS.pdf" },
    ];

    await ExtensionDocument.destroy({ where: { category: 'promocion' } });

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

    console.log('   ✅ Extension Universitaria seeded successfully');
  } catch (err) {
    console.error('   ❌ Error seeding extension universitaria:', err);
    throw err;
  }
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

async function main() {
  console.log('🌱 ========================================');
  console.log('🌱 UTTECAM - Seed All Database');
  console.log('🌱 ========================================');
  console.log(`📍 Mode: ${devMode ? 'DEVELOPMENT' : 'PRODUCTION'}`);
  console.log(`📍 Database: ${process.env.DB_NAME || 'uttecam'}`);
  console.log(`📍 Host: ${process.env.DB_HOST || 'localhost'}`);
  
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    await seedAdmin();
    await seedNosotros();
    await seedCarreras();
    await seedExtensionUniversitaria();

    console.log('\n🎉 ========================================');
    console.log('🎉 All seeds completed successfully!');
    console.log('🎉 ========================================\n');
    
    process.exit(0);
  } catch (err) {
    console.error('\n💥 ========================================');
    console.error('💥 Error during seeding process:');
    console.error('💥 ========================================');
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { seedAdmin, seedNosotros, seedCarreras, seedExtensionUniversitaria };
