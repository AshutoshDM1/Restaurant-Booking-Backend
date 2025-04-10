import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import bcrypt from 'bcryptjs';
import { prisma } from '../testSetup/setup';

describe('User Routes', () => {
  const userData = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
  };

  // Cleanup before each test
  beforeEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [userData.email],
        },
      },
    });
  });

  // Test for user signup
  describe('POST /api/v1/user/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app).post('/api/v1/user/signup').send(userData);

      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User created successfully');
    });

    it('should return error if user already exists', async () => {
      // Create user first
      await prisma.user.create({
        data: {
          ...userData,
          password: await bcrypt.hash(userData.password, 10),
        },
      });

      // Try to create the same user again
      const response = await request(app).post('/api/v1/user/signup').send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists');
    });
  });

  // Test for user login
  describe('POST /api/v1/user/login', () => {
    beforeEach(async () => {
      // Create user for login test
      await prisma.user.create({
        data: {
          ...userData,
          password: await bcrypt.hash(userData.password, 10),
        },
      });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app).post('/api/v1/user/login').send({
        email: userData.email,
        password: userData.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.response).toBeDefined(); // token
      expect(response.body.message).toBe('Login successful');
    });

    it('should return error with invalid credentials (user not found)', async () => {
      const response = await request(app).post('/api/v1/user/login').send({
        email: 'fake@example.com',
        password: 'password',
      });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    it('should return error with invalid credentials (incorrect password)', async () => {
      const response = await request(app).post('/api/v1/user/login').send({
        email: userData.email,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password is incorrect');
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [userData.email],
        },
      },
    });
  });
});
