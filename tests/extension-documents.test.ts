import request from 'supertest';
import app from '../src/app';
import ExtensionDocument from '../src/models/ExtensionDocument';
import fs from 'fs';
import path from 'path';
import { generateToken } from '../src/middleware/auth';
import sequelize from '../src/config/database';

const API_PREFIX = '/api';

jest.setTimeout(30000);

describe('Extension documents uploads (promocion/gaceta)', () => {
  beforeAll(async () => {
    // Ensure the DB has the new mime_type/media_type columns; create if missing
    try {
      await sequelize.query("ALTER TABLE extension_documents ADD COLUMN mime_type VARCHAR(255) NULL;");
    } catch (e) {
      // Ignore duplicate column error
    }
    try {
      await sequelize.query("ALTER TABLE extension_documents ADD COLUMN media_type VARCHAR(32) NULL;");
    } catch (e) {
      // Ignore duplicate column error
    }
    const fixturesDir = path.join(__dirname, 'fixtures');
    if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });

    const jpgPath = path.join(fixturesDir, 'test.jpg');
    if (!fs.existsSync(jpgPath)) {
      const buf = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00]);
      fs.writeFileSync(jpgPath, buf);
    }

    const pngPath = path.join(fixturesDir, 'test.png');
    if (!fs.existsSync(pngPath)) {
      const buf = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      fs.writeFileSync(pngPath, buf);
    }

    const pdfPath = path.join(fixturesDir, 'test.pdf');
    if (!fs.existsSync(pdfPath)) {
      const buf = Buffer.from([0x25, 0x50, 0x44, 0x46]);
      fs.writeFileSync(pdfPath, buf);
    }
  });

  afterEach(async () => {
    try {
      await ExtensionDocument.destroy({ where: {} });
    } catch (e) { /* ignore */ }
  });

  test('Promocion: accept JPG upload as primary file', async () => {
    const fixturesPath = path.join(__dirname, 'fixtures', 'test.jpg');
    const token = generateToken({ id: 1, username: 'test-admin', role: 'admin' });

    const response = await request(app)
      .post(`${API_PREFIX}/extension/universitaria/documents`)
      .set('Authorization', `Bearer ${token}`)
      .field('category', 'promocion')
      .field('title', 'Imagen promocional JPG')
      .attach('file', fixturesPath)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('file_url');
    expect(response.body.mime_type).toBe('image/jpeg');
    expect(response.body.media_type).toBe('image');
    // verify file exists
    const checkPaths = [
      path.join(process.cwd(), 'uploads', response.body.file_url.replace('/uploads/', '')),
      path.join(process.cwd(), 'src', 'uploads', response.body.file_url.replace('/uploads/', '')),
      path.join(process.cwd(), 'dist', 'uploads', response.body.file_url.replace('/uploads/', '')),
      path.join(__dirname, '..', 'uploads', response.body.file_url.replace('/uploads/', ''))
    ];
    const exists = checkPaths.some(p => fs.existsSync(p));
    if (!exists) console.error('Checked paths:', checkPaths);
    expect(exists).toBe(true);
  });

  test('Promocion: accept PNG upload as primary file', async () => {
    const fixturesPath = path.join(__dirname, 'fixtures', 'test.png');
    const token = generateToken({ id: 1, username: 'test-admin', role: 'admin' });

    const response = await request(app)
      .post(`${API_PREFIX}/extension/universitaria/documents`)
      .set('Authorization', `Bearer ${token}`)
      .field('category', 'promocion')
      .field('title', 'Imagen promocional PNG')
      .attach('file', fixturesPath)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('file_url');
    expect(response.body.mime_type).toBe('image/png');
    expect(response.body.media_type).toBe('image');
    const checkPaths = [
      path.join(process.cwd(), 'uploads', response.body.file_url.replace('/uploads/', '')),
      path.join(process.cwd(), 'src', 'uploads', response.body.file_url.replace('/uploads/', '')),
      path.join(process.cwd(), 'dist', 'uploads', response.body.file_url.replace('/uploads/', '')),
      path.join(__dirname, '..', 'uploads', response.body.file_url.replace('/uploads/', ''))
    ];
    const exists = checkPaths.some(p => fs.existsSync(p));
    if (!exists) console.error('Checked paths:', checkPaths);
    expect(exists).toBe(true);
  });

  test('Gaceta: accept PDF upload only', async () => {
    const fixturesPath = path.join(__dirname, 'fixtures', 'test.pdf');
    const token = generateToken({ id: 1, username: 'test-admin', role: 'admin' });

    const response = await request(app)
      .post(`${API_PREFIX}/extension/universitaria/documents`)
      .set('Authorization', `Bearer ${token}`)
      .field('category', 'gaceta')
      .field('title', 'Gaceta PDF')
      .attach('file', fixturesPath)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('file_url');
    expect(response.body.mime_type).toBe('application/pdf');
    expect(response.body.media_type).toBe('document');
    const checkPaths = [
      path.join(process.cwd(), 'uploads', response.body.file_url.replace('/uploads/', '')),
      path.join(process.cwd(), 'src', 'uploads', response.body.file_url.replace('/uploads/', '')),
      path.join(process.cwd(), 'dist', 'uploads', response.body.file_url.replace('/uploads/', '')),
      path.join(__dirname, '..', 'uploads', response.body.file_url.replace('/uploads/', ''))
    ];
    const exists = checkPaths.some(p => fs.existsSync(p));
    if (!exists) console.error('Checked paths:', checkPaths);
    expect(exists).toBe(true);
  });
});
