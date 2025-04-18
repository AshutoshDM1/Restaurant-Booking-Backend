import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../testSetup/setup';
import { TestUser } from '../types/testTypes';

describe('Restaurant Routes', () => {
  let testUser: TestUser;
  beforeAll(async () => {
    const userData = {
      name: 'Test User Restaurant',
      email: 'testuserrestaurant1@example.com',
      password: 'password123',
    };
    testUser = await request(app).post('/api/v1/user/signup').send(userData);
  });
  beforeEach(async () => {
    // Clean up restaurants before each test
    await prisma.restaurant.deleteMany({
      where: {
        name: {
          in: ['Test Restaurant', 'Test Restaurant 2', 'Test Restaurant 3'],
        },
      },
    });
  });
  const restaurantData = {
    name: 'Test Restaurant',
    location: 'Test Delhi',
    cuisine: ['Italian', 'Mexican', 'Chinese'],
    totalSeats: 10,
    seatsAvailable: 10,
  };
  describe('POST /api/v1/restaurants', () => {
    it('should create a new restaurant', async () => {
      const response = await request(app)
        .post('/api/v1/restaurant')
        .send(restaurantData)
        .set('Authorization', `Bearer ${testUser.body.token}`);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Restaurant created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(restaurantData.name);
    });

    it('should return error if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/restaurant')
        .send({
          name: 'Test Restaurant',
        })
        .set('Authorization', `Bearer ${testUser.body.token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Please provide name, location, cuisine, totalSeats, and seatsAvailable',
      );
    });
  });

  describe('GET /api/v1/restaurant', () => {
    it('should return all restaurants', async () => {
      await prisma.restaurant.createMany({
        data: [
          {
            name: 'Test Restaurant',
            location: 'Test Delhi',
            cuisine: ['Italian', 'Mexican', 'Chinese'],
            totalSeats: 10,
            seatsAvailable: 10,
          },
          {
            name: 'Test Restaurant 2',
            location: 'Test Delhi',
            cuisine: ['Italian', 'Mexican', 'Chinese'],
            totalSeats: 10,
            seatsAvailable: 10,
          },
          {
            name: 'Test Restaurant 3',
            location: 'Test Delhi',
            cuisine: ['Italian', 'Mexican', 'Chinese'],
            totalSeats: 10,
            seatsAvailable: 10,
          },
        ],
      });

      const response = await request(app)
        .get('/api/v1/restaurant')
        .set('Authorization', `Bearer ${testUser.body.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/restaurants/:id', () => {
    it('should return a specific restaurant', async () => {
      const restaurant = await prisma.restaurant.create({
        data: {
          ...restaurantData,
          totalSeats: 10,
          seatsAvailable: 10,
        },
      });

      const response = await request(app)
        .get(`/api/v1/restaurant/${restaurant.id}`)
        .set('Authorization', `Bearer ${testUser.body.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(restaurant.id);
      expect(response.body.data.name).toBe(restaurantData.name);
    });

    it('should return 404 for non-existent restaurant', async () => {
      const response = await request(app)
        .get('/api/v1/restaurant/999')
        .set('Authorization', `Bearer ${testUser.body.token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Restaurant not found');
    });
  });

  afterAll(async () => {
    await prisma.restaurant.deleteMany({
      where: {
        name: {
          in: ['Test Restaurant', 'Test Restaurant 2', 'Test Restaurant 3'],
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['testuserrestaurant1@example.com'],
        },
      },
    });
  });
});
