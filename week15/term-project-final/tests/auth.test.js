/*
Name: Kendall Beam
Assignment: Term Project 3
Description: test acceptance file
Filename: auth test.js (npm run test:acceptance)
Date: May 2 2026

** wipes mongo memory server after each test

'AC-3 Local sign-up: POST /register creates user and redirects'
  -- hits /admin/register route
  -- pass_1 => expects 302 redirect
  -- pass_2 => checks User is stored in MongoDB

'AC-4 Local sign-in: POST /login sets session cookie and redirects'
  -- creates a user, sends login form to /admin/login
  -- pass_1 -> expects 302 redirect
  -- pass_2 -> expects cookies in response

'AC-6 Protected route guard: unauthenticated GET /admin/dashboard redirects to /admin/login'
  -- sends unauthenticated request to /admin/dashboard
  -- pass_1 => expects 302 redirect
  -- pass_2 => redirect location is /login

'AC-5 Google OAuth sign-in: simulated callback creates google user and redirects'
  -- Mocks google OAuth response (see routes/auth.js => creates a User by google signin)
  -- pass_1 => expects 302 redirect
  -- pass_2 => expects User w/ google specific information is stored

'AC-7 Logout: POST /logout clears session'
  -- creates a user, sends a login request, then sends a logout request

  -- pass_1 => login redirects to 302
  -- pass_2 => logout redirects to 302
  -- pass_3 => logout sends correct cookie
  -- pass_4 => after logout request to /admin/logout redirects to login
  -- pass_5 => after logout /admin/status returns null

Notes:
  -- Uses MongoMemoryServer to test MongoDB functions, not wiring
  -- The AC-5 test only checks redirecting and document creation, is a cop out otherwise
  -- AC-7 logout will fail if AC-4 or AC-6 fail

AI Use:
  These tests are generated.
  They are apt for testing specific things, but are not holistic.
  Should be taken with a grain of salt what they actually prove.
*/

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

/**
 * **Generated Code**
 * Tweaked by me
 */
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
