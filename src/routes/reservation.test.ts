import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import bcrypt from 'bcryptjs';
import { prisma } from '../test/setup';

describe('Reservation Routes', () => {
  let testUser: any;
  let testRestaurant: any;
  let testTable: any;

  beforeAll(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        name: 'Test User Reservation',
        email: 'testReservation@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    });

    // Create test restaurant
    testRestaurant = await prisma.restaurant.create({
      data: {
        name: 'Test Restaurant Reservation',
        location: 'Test Location Reservation',
        cuisine: ['Italian', 'Mexican', 'Chinese'],
        totalSeats: 10,
        seatsAvailable: 10,
      },
    });

    beforeEach(async () => {
      await prisma.booking.deleteMany();
    });

    describe('POST /api/v1/reservation', () => {
      it('should create a new reservation', async () => {
        const reservationData = {
          restaurantId: testRestaurant.id,
          tableId: testTable.id,
          userId: testUser.id,
          numberOfGuests: 2,
        };

        const response = await request(app)
          .post('/api/v1/reservation')
          .send(reservationData)
          .set('Authorization', `Bearer ${testUser.token}`);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Table reserved successfully');
        expect(response.body.data).toHaveProperty('id');
      });

      it('should return error if required fields are missing', async () => {
        const response = await request(app)
          .post('/api/v1/reservation')
          .send({
            restaurantId: testRestaurant.id,
          })
          .set('Authorization', `Bearer ${testUser.token}`);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Please provide all required booking details');
      });
    });

    describe('GET /api/reservations', () => {
      it('should return user reservations', async () => {
        // Create a test booking
        const booking = await prisma.booking.create({
          data: {
            numberOfGuests: 2,
            restaurantId: testRestaurant.id,
            userId: testUser.id,
            bookingStatus: true,
            restaurant: {
              connect: { id: testRestaurant.id },
            },
            user: {
              connect: { id: testUser.id },
            },
          },
        });

        const response = await request(app)
          .get('/api/v1/reservation')
          .send({ userId: testUser.id })
          .set('Authorization', `Bearer ${testUser.token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].id).toBe(booking.id);
      });
    });

    describe('DELETE /api/v1/reservation', () => {
      it('should cancel a reservation', async () => {
        const booking = await prisma.booking.create({
          data: {
            numberOfGuests: 2,
            restaurantId: testRestaurant.id,
            userId: testUser.id,
            bookingStatus: true,
            restaurant: {
              connect: { id: testRestaurant.id },
            },
            user: {
              connect: { id: testUser.id },
            },
          },
        });

        const response = await request(app)
          .delete('/api/v1/reservation')
          .send({ bookingId: booking.id })
          .set('Authorization', `Bearer ${testUser.token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Reservation cancelled successfully');
      });

      it('should return error for non-existent booking', async () => {
        const response = await request(app)
          .delete('/api/v1/reservation')
          .send({ bookingId: '999' })
          .set('Authorization', `Bearer ${testUser.token}`);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
      });
    });

    afterAll(async () => {
      // Clean up all test data
      await prisma.booking.deleteMany();
      await prisma.restaurant.deleteMany();
      await prisma.user.deleteMany();
      await prisma.$disconnect();
    });
  });
});
