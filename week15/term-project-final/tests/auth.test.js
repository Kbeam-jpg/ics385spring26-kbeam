import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';

// Import app after env test flag is set
import app from '../server.js';
import User from '../models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth acceptance tests (AC-3..AC-7)', () => {
  test('AC-3 Local sign-up: POST /register creates user and redirects', async () => {
    const res = await request(app)
      .post('/admin/register')
      .type('form')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/admin/dashboard');

    const user = await User.findOne({ email: 'test@example.com' }).lean();
    expect(user).toBeTruthy();
    expect(user.password).toBeDefined();
    expect(user.password).not.toBe('password123');
    const match = await bcrypt.compare('password123', user.password);
    expect(match).toBe(true);
  });

  test('AC-4 Local sign-in: POST /login sets session cookie and redirects', async () => {
    await User.create({ email: 'localuser@example.com', password: 'mypassword123' });

    const res = await request(app)
      .post('/admin/login')
      .type('form')
      .send({ email: 'localuser@example.com', password: 'mypassword123' });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/admin/dashboard');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('AC-6 Protected route guard: unauthenticated GET /admin/dashboard redirects to /admin/login', async () => {
    const res = await request(app)
      .get('/admin/dashboard')
      .set('Accept', 'text/html');
    expect(res.status).toBe(302);
    expect(res.headers.location).toMatch(/login/);
  });

  test('AC-5 Google OAuth sign-in: simulated callback creates google user and redirects', async () => {
    const res = await request(app)
      .post('/admin/google/test-callback')
      .send({ googleId: 'google-12345', email: 'guser@example.com', displayName: 'G User' });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/admin/dashboard');

    const user = await User.findOne({ googleId: 'google-12345' }).lean();
    expect(user).toBeTruthy();
    expect(user.provider).toBe('google');
    expect(user.googleId).toBe('google-12345');
  });

  test('AC-7 Logout: POST /logout clears session', async () => {
    await User.create({ email: 'logout@example.com', password: 'logoutpass123' });

    const agent = request.agent(app);
    // login first
    const loginRes = await agent
      .post('/admin/login')
      .type('form')
      .send({ email: 'logout@example.com', password: 'logoutpass123' });
    expect(loginRes.status).toBe(302);

    // logout
    const logoutRes = await agent.post('/admin/logout');
    expect(logoutRes.status).toBe(302);
    const clearedCookie = logoutRes.headers['set-cookie']?.find((cookie) => cookie.includes('connect.sid='));
    expect(clearedCookie).toBeDefined();

    // subsequent protected request should redirect to login
    const protectedRes = await agent
      .get('/admin/dashboard')
      .set('Accept', 'text/html');
    expect(protectedRes.status).toBe(302);
    expect(protectedRes.headers.location).toMatch(/login/);

    const statusRes = await agent.get('/admin/status');
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.isAuthenticated).toBe(false);
    expect(statusRes.body.user).toBeNull();
  });
});
