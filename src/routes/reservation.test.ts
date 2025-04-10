import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../testSetup/setup';
import { TestUser, TestRestaurant, TestUserId } from '../types/testTypes';

describe('Reservation Routes', () => {
  let testUser: TestUser;
  let testRestaurant: TestRestaurant;
  let testUserId: TestUserId;

  beforeAll(async () => {
    // Create test user
    const userData = {
      name: 'Test User Reservation',
      email: 'testReservation@example.com',
      password: 'password123',
    };
    testUser = await request(app).post('/api/v1/user/signup').send(userData);
    const foundUser = await prisma.user.findUnique({
      where: {
        email: 'testReservation@example.com',
      },
    });

    if (!foundUser) {
      throw new Error('Test user not found');
    }

    testUserId = foundUser;
    testRestaurant = await prisma.restaurant.create({
      data: {
        name: 'Test Restaurant Reservation',
        location: 'Test Location Reservation',
        cuisine: ['Italian', 'Mexican', 'Chinese'],
        totalSeats: 10,
        seatsAvailable: 10,
      },
    });
  });

  beforeEach(async () => {
    await prisma.booking.deleteMany({
      where: {
        restaurantId: {
          in: [testRestaurant.id],
        },
      },
    });
  });

  describe('POST /api/v1/reservation', () => {
    it('should create a new reservation', async () => {
      const reservationData = {
        restaurantId: testRestaurant.id,
        userId: testUserId.id,
        numberOfGuests: 2,
      };

      const response = await request(app)
        .post('/api/v1/reservation')
        .send(reservationData)
        .set('Authorization', `Bearer ${testUser.body.token}`);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Booking created successfully');
      expect(response.body.data).toHaveProperty('id');
    });

    it('should return error if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/reservation')
        .send({
          restaurantId: testRestaurant.id,
        })
        .set('Authorization', `Bearer ${testUser.body.token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Please provide all required booking details');
    });
  });

  describe('GET /api/v1/reservation', () => {
    it('should return user reservations', async () => {
      // Create a test booking
      const reservationData = {
        restaurantId: testRestaurant.id,
        userId: testUserId.id,
        numberOfGuests: 4,
      };

      const testReservation = await request(app)
        .post('/api/v1/reservation')
        .send(reservationData)
        .set('Authorization', `Bearer ${testUser.body.token}`);

      const response = await request(app)
        .get(`/api/v1/reservation/${testUserId.id}`)
        .set('Authorization', `Bearer ${testUser.body.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.all)).toBe(true);
      expect(response.body.data.all.length).toBe(1);
      expect(response.body.data.all[0].id).toBe(testReservation.body.data.id);
    });
  });

  describe('DELETE /api/v1/reservation', () => {
    it('should cancel a reservation', async () => {
      // Create a test booking first
      const reservationData = {
        restaurantId: testRestaurant.id,
        userId: testUserId.id,
        numberOfGuests: 2,
      };

      const testReservation = await request(app)
        .post('/api/v1/reservation')
        .send(reservationData)
        .set('Authorization', `Bearer ${testUser.body.token}`);

      const response = await request(app)
        .delete('/api/v1/reservation')
        .send({ bookingId: testReservation.body.data.id })
        .set('Authorization', `Bearer ${testUser.body.token}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Reservation cancelled successfully');
    });

    it('should return error for non-existent booking', async () => {
      const response = await request(app)
        .delete('/api/v1/reservation')
        .send({ bookingId: 9999 })
        .set('Authorization', `Bearer ${testUser.body.token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Booking not found');
    });
  });

  afterAll(async () => {
    // Clean up all test data
    await prisma.booking.deleteMany({
      where: {
        restaurantId: {
          in: [testRestaurant.id],
        },
      },
    });
    await prisma.restaurant.deleteMany({
      where: {
        name: {
          in: ['Test Restaurant Reservation'],
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['testReservation@example.com'],
        },
      },
    });
  });
});
