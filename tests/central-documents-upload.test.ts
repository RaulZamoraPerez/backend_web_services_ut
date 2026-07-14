import request from 'supertest';
import app from '../src/app';
import fs from 'fs';
import path from 'path';
import { generateToken } from '../src/middleware/auth';

const API_PREFIX = '/api';

describe('Central documentos uploads (promocion area)', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  beforeAll(async () => {
    if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });

    const jpgPath = path.join(fixturesDir, 'INGRESO_UTTECAM_2025.jpg');
    // Overwrite existing fixture to ensure consistent size
    if (fs.existsSync(jpgPath)) fs.unlinkSync(jpgPath);
    const header = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
    const body = Buffer.alloc(256 - header.length, 0x20); // pad with spaces to reach ~256 bytes
    fs.writeFileSync(jpgPath, Buffer.concat([header, body]));

    const pngPath = path.join(fixturesDir, 'QR_WHATSAPP_UTTECAM.png');
    // Overwrite existing fixture to ensure consistent size
    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
    const header2 = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const body2 = Buffer.alloc(256 - header2.length, 0x20);
    fs.writeFileSync(pngPath, Buffer.concat([header2, body2]));
  });

  test('Central: Promoción - upload JPG and verify', async () => {
    const token = generateToken({ id: 1, username: 'test-admin', role: 'admin' });

    // Get categories
    const categoriesResp = await request(app).get(`${API_PREFIX}/documentos/categorias`).set('Authorization', `Bearer ${token}`);
    expect(categoriesResp.status).toBe(200);
    const categories = categoriesResp.body || [];

    // Find category for area 10 (Promoción)
    const promoCategory = categories.find((c: any) => c.ID_Area === 10 || c.Nombre === 'Promoción Institucional' || String(c.Nombre).toLowerCase().includes('promocion'));
    console.log('Categories found:', categories.map((c:any) => ({ id: c.ID_Categorias || c.id || c.ID, name: c.Nombre, area: c.ID_Area })));
    expect(promoCategory).toBeDefined();
    const promoCategoryId = promoCategory.ID_Categorias || promoCategory.id || promoCategory.ID || promoCategory.ID_Categoria;
    console.log('Using promoCategoryId:', promoCategoryId);
    expect(promoCategoryId).toBeDefined();

    const fixturesPath = path.join(fixturesDir, 'INGRESO_UTTECAM_2025.jpg');

    const response = await request(app)
      .post(`${API_PREFIX}/documentos/archivos/upload`)
      .set('Authorization', `Bearer ${token}`)
      .attach('archivo', fixturesPath)
      .field('ID_Categorias', String(promoCategoryId))
      .field('Nombre', 'Ingreso UTTECAM 2025')
      .field('Descripcion', 'Prueba de subida - JPG');
    if (response.status !== 201) console.log('Response body:', response.body);
    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty('archivo');
    if (response.body.file) {
      expect(response.body.file.mimetype).toBe('image/jpeg');
    }
  });

  test('Central: Promoción - upload PNG and verify', async () => {
    const token = generateToken({ id: 1, username: 'test-admin', role: 'admin' });

    const categoriesResp = await request(app).get(`${API_PREFIX}/documentos/categorias`).set('Authorization', `Bearer ${token}`);
    expect(categoriesResp.status).toBe(200);
    const categories = categoriesResp.body || [];

    const promoCategory = categories.find((c: any) => c.ID_Area === 10 || c.Nombre === 'Promoción Institucional' || String(c.Nombre).toLowerCase().includes('promocion'));
    expect(promoCategory).toBeDefined();
    const promoCategoryId = promoCategory.ID_Categorias || promoCategory.id || promoCategory.ID || promoCategory.ID_Categoria;
    expect(promoCategoryId).toBeDefined();

    const fixturesPath = path.join(fixturesDir, 'QR_WHATSAPP_UTTECAM.png');

    const response = await request(app)
      .post(`${API_PREFIX}/documentos/archivos/upload`)
      .set('Authorization', `Bearer ${token}`)
      .attach('archivo', fixturesPath)
      .field('ID_Categorias', String(promoCategoryId))
      .field('Nombre', 'QR WhatsApp UTTECAM')
      .field('Descripcion', 'Prueba de subida - PNG');
    if (response.status !== 201) console.log('Response body:', response.body);
    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty('archivo');
    if (response.body.file) {
      expect(response.body.file.mimetype).toBe('image/png');
    }
  });
});
