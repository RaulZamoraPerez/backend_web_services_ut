import request from 'supertest';
import app from '../src/app';
import ExtensionSection from '../src/models/ExtensionSection';
import fs from 'fs';
import path from 'path';
import { generateToken } from '../src/middleware/auth';

const API_PREFIX = '/api';

jest.setTimeout(30000);

describe('Extension API - banner uploads', () => {
  beforeAll(async () => {
    try {
      await ExtensionSection.sequelize?.authenticate();
    } catch (e) {
      // ignore
    }

    const fixturesDir = path.join(__dirname, 'fixtures');
    if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });
    const jpgPath = path.join(fixturesDir, 'test.jpg');
    if (!fs.existsSync(jpgPath)) {
      const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      fs.writeFileSync(jpgPath, buf);
    }
  });

  afterEach(async () => {
    try { await ExtensionSection.destroy({ where: {} }); } catch (e) { /* ignore */ }
  });

  test('upload banner for section and update banner_url', async () => {
    // Create section
    await ExtensionSection.create({ slug: 'talleres-culturales', title: 'Talleres Culturales', description: 'test', banner_url: undefined });

    const fixturesPath = path.join(__dirname, 'fixtures', 'test.jpg');
    const token = generateToken({ id: 1, username: 'test-admin', role: 'admin' });

    const response = await request(app)
      .post(`${API_PREFIX}/extension/sections/talleres-culturales/upload-image`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', fixturesPath)
      .expect(200);

    expect(response.body).toHaveProperty('banner_url');
    expect(response.body.banner_url).toMatch(/\/uploads\//);
    // Verify file exists on disk
    const uploadsDir = path.resolve(__dirname, '../uploads');
    const filePath = path.join(uploadsDir, response.body.banner_url.replace('/uploads/', ''));
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
