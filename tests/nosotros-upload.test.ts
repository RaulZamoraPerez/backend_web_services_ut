import request from 'supertest';
import app from '../src/app';
import { generateToken } from '../src/middleware/auth';
import NosotrosContent from '../src/models/Nosotros';
import fs from 'fs';
import path from 'path';

const API_PREFIX = '/api';

jest.setTimeout(30000);

describe('Nosotros upload tests (focused)', () => {
  beforeAll(async () => {
    // Ensure DB connection available
    try {
      await NosotrosContent.sequelize?.authenticate();
    } catch (e) {
      // ignore
    }
    // Ensure fixture exists
    const fixturesDir = path.join(__dirname, 'fixtures');
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
    const jpgPath = path.join(fixturesDir, 'test.jpg');
    if (!fs.existsSync(jpgPath)) {
      // Write a minimal JPEG header
      const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      fs.writeFileSync(jpgPath, buf);
    }
  });

  afterEach(async () => {
    try {
      await NosotrosContent.destroy({ where: {} });
    } catch (e) {
      // ignore
    }
  });

  test('uploadNosotros middleware allows large JSON field (up to 1MB field)', async () => {
    // create content base
    const testContent = {
      vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
      mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
      valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
      politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
      objetivoIntegral: 'Test objetivo',
      noDiscriminacion: [['Test1'], ['Test2']]
    };
    await NosotrosContent.create(testContent);

    const longDescription = 'x'.repeat(150 * 1024); // 150KB
    const payload = { title: 'Large test', description: longDescription };

    const fixturesPath = path.join(__dirname, 'fixtures', 'test.jpg');

    // generate a token with admin role
    const token = generateToken({ id: 1, username: 'test-admin', role: 'admin' });

    // First, verify dev upload endpoint accepts files and large field with uploadNosotros middleware
    const devResp = await request(app)
      .post('/api/_dev/tests/upload/nosotros')
      .attach('image', fixturesPath)
      .field('section', 'vision')
      .field('data', JSON.stringify(payload))
      .expect(200);

    // dev route returns fields and files count and body, validate we can see the large 'data'
    expect(devResp.body).toHaveProperty('files');
    expect(devResp.body.files).toBe(1);
    expect(devResp.body.body).toHaveProperty('data');
    expect(devResp.body.body.data.length).toBeGreaterThan(150 * 1024 - 10);
  });

  test('rejects large field on carreras dev upload (default 100KB fieldSize)', async () => {
    const veryLong = 'y'.repeat(150 * 1024);
    const fixturesPath = path.join(__dirname, 'fixtures', 'test.jpg');

    const response = await request(app)
      .post('/api/_dev/tests/upload/carreras')
      .attach('imagen', fixturesPath)
      .field('title', veryLong)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Field value too long');
  });
});

