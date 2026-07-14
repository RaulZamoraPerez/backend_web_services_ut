#!/usr/bin/env ts-node
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import { CONTENIDO_INICIAL } from '../seeds/data/nosotrosData';
import { programDetails } from '../data/programDetailsData';
import { programs } from '../data/programsData';

const isProduction = process.env.NODE_ENV === 'production';

// DB config
const sequelize = new Sequelize({
  dialect: (process.env.DB_DIALECT as any) || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'uttecam',
  logging: false
});

// Helper to get default image URL for production
const DEFAULT_IMAGE = 'https://via.placeholder.com/600x400?text=UTTECAM';

const normalizeImageForProd = (imagePath?: string) => {
  if (!imagePath) return DEFAULT_IMAGE;
  // If it's an absolute http(s) url, leave it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  // Otherwise return default placeholder in prod
  return DEFAULT_IMAGE;
};

// Define User model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'editor', 'viewer'), allowNull: false, defaultValue: 'viewer' },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  tableName: 'users',
  underscored: true,
});

// We will define minimal Carrera and Nosotros models for dev seeding
const Carrera = sequelize.define('Carrera', {
  nombre: { type: DataTypes.STRING },
  siglas: { type: DataTypes.STRING },
  nivel: { type: DataTypes.STRING },
  modalidad: { type: DataTypes.STRING },
  duracion: { type: DataTypes.STRING },
  objetivo: { type: DataTypes.TEXT },
  perfil_ingreso: { type: DataTypes.TEXT },
  perfil_egreso: { type: DataTypes.TEXT },
  campo_laboral: { type: DataTypes.TEXT },
  imagen: { type: DataTypes.STRING },
  video_url: { type: DataTypes.STRING },
  orden: { type: DataTypes.INTEGER },
  activo: { type: DataTypes.BOOLEAN }
}, { tableName: 'carreras' });

const NosotrosContent = sequelize.define('NosotrosContent', {
  politicaIntegral: { type: DataTypes.JSON },
  objetivoIntegral: { type: DataTypes.TEXT },
  vision: { type: DataTypes.JSON },
  mision: { type: DataTypes.JSON },
  valores: { type: DataTypes.JSON },
  noDiscriminacion: { type: DataTypes.JSON }
}, { tableName: 'nosotros_content' });

async function createAdminUser(isForced = false) {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (existingAdmin) {
      if (!isForced) {
        console.log('Admin already exists, skipping creation.');
        return true;
      }
      await existingAdmin.destroy();
    }

    const adminData = { username: 'admin', email: 'admin@uttecam.edu.mx', password: 'Admin123!@#', role: 'admin', is_active: true };
    const hashed = await bcrypt.hash(adminData.password, 12);
    await User.create({ ...adminData, password: hashed });
    console.log('Admin created');
    return true;
  } catch (err) {
    console.error('Error creating admin:', err);
    return false;
  }
}

async function seedNosotros(devMode = true) {
  try {
    await NosotrosContent.sync();
    await NosotrosContent.destroy({ where: {} });

    // use devMode to determine image handling
    const content = JSON.parse(JSON.stringify(CONTENIDO_INICIAL));
    if (!devMode) {
      // replace images with default public url
      content.politicaIntegral.imageSrc = normalizeImageForProd(content.politicaIntegral.imageSrc);
      content.vision.imageSrc = normalizeImageForProd(content.vision.imageSrc);
      content.mision.imageSrc = normalizeImageForProd(content.mision.imageSrc);
      content.valores.imageSrc = normalizeImageForProd(content.valores.imageSrc);
    }

    await NosotrosContent.create(content);
    console.log('Nosotros seeded');
  } catch (err) {
    console.error('Error seeding nosotros:', err);
    throw err;
  }
}

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

async function seedCarreras(devMode = true) {
  try {
    await Carrera.sync();
    await Carrera.destroy({ where: {} });

    let data: any[] = [];
    // Generate carreras data from programDetails & programs arrays to match original logic
    for (const detail of programDetails) {
      const programInfo = programs.find(p => p.id === detail.programId);
      if (!programInfo) continue;
      const nombre = cleanTitle(programInfo.title);
      const siglas = generateSiglas(nombre);
      const nivel = mapNivel(programInfo.category);
      const duracion = (programInfo as any).duration || '';
      const imagen = `portadas/${programInfo.image?.replace('PE2025/', '') || ''}`;
      const perfil_ingreso = (detail as any).admissionProfile?.trim() || '';
      const perfil_egreso = (detail as any).graduateProfile?.trim() || '';
      const campo_laboral = (detail as any).laborField?.join('\n') || '';
      const imagen_local = `caratulas/${(detail as any).profileImage}`;
      data.push({
        nombre,
        siglas,
        nivel,
        duracion,
        objetivo: 'Formar profesionistas competitivos, con capacidad para analizar, diseñar, desarrollar e implementar soluciones tecnológicas e innovadoras.',
        perfil_ingreso,
        perfil_egreso,
        campo_laboral,
        imagen: devMode ? imagen_local : imagen,
        video_url: (detail as any).videoUrl || '',
        orden: (detail as any).programId,
        activo: true
      });
    }
    if (!devMode) {
      data = data.map((c: any) => ({ ...c, imagen: normalizeImageForProd(c.imagen) }));
    }

    for (const c of data) {
      await Carrera.create(c);
    }
    console.log('Carreras seeded');
  } catch (err) {
    console.error('Error seeding carreras:', err);
    throw err;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const isForced = args.includes('--force');
  const devSeed = args.includes('--dev');
  const withSeeds = args.includes('--seed-all') || args.includes('--with-seeds');

  const adminCreated = await createAdminUser(isForced);
  if (adminCreated && withSeeds) {
    await seedNosotros(devSeed);
    await seedCarreras(devSeed);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
