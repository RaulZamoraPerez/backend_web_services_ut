import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/config/database';
import User from '../src/models/User';

describe('Auth API', () => {
  const testUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'Test1234!'
  };

  beforeAll(async () => {
    await sequelize.authenticate();
    // Ensure clean state for the test user
    await User.destroy({ where: { username: testUser.username } });
    await User.create({ username: testUser.username, email: testUser.email, password: testUser.password, role: 'viewer', isActive: true });
  });

  afterAll(async () => {
    await User.destroy({ where: { username: testUser.username } });
    await sequelize.close();
  });

  test('POST /api/auth/login with correct username should return token and user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.username, password: testUser.password })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', testUser.username);
  });

  test('POST /api/auth/login with email should also work', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.email, password: testUser.password })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  test('POST /api/auth/login with incorrect password should return 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.username, password: 'wrong-password' })
      .expect(401);

    expect(res.body).toHaveProperty('error');
  });
});
