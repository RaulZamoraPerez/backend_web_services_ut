#!/usr/bin/env ts-node
import 'dotenv/config';
import { connectDatabase } from '../src/config/database';
import NosotrosContent from '../src/models/Nosotros';
import { CONTENIDO_INICIAL } from './seeds/data/nosotrosData';

async function seedNosotros() {
  try {
    await connectDatabase();
    await NosotrosContent.sync();
    // Remove any existing
    await NosotrosContent.destroy({ where: {} });
    // Create the initial content
    await NosotrosContent.create(CONTENIDO_INICIAL as any);
    console.log('✅ Nosotros content seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding Nosotros content:', err);
    process.exit(1);
  }
}

seedNosotros();
