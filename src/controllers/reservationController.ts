import { RequestHandler } from 'express';
import prisma from '../db/db';
import { BookingStatus } from '@prisma/client';

const reserveTable: RequestHandler<
  {},
  {},
  { restaurantId: number; userId: number; numberOfGuests: number },
  {}
> = async (req, res) => {
  const { restaurantId, userId, numberOfGuests } = req.body;

  try {
    if (!restaurantId || !userId || !numberOfGuests) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required booking details',
      });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
      return;
    }

    if (restaurant.seatsAvailable < numberOfGuests) {
      res.status(400).json({
        success: false,
        message: 'Not enough seats available at this restaurant',
      });
      return;
    }

    // Use a transaction to ensure both operations succeed or fail together I have learned this in my previous primeWallet project
    const booking = await prisma.$transaction(async (tx) => {
      // Create the booking
      const newBooking = await tx.booking.create({
        data: {
          numberOfGuests,
          restaurantId: restaurantId,
          userId: userId,
          status: BookingStatus.ACTIVE,
        },
        include: {
          restaurant: true,
          user: true,
        },
      });

      // Update restaurant available seats
      await tx.restaurant.update({
        where: { id: restaurantId },
        data: { seatsAvailable: { decrement: numberOfGuests } },
      });

      return newBooking;
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reserving table',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return;
  }
};

const cancelReservation: RequestHandler<{}, {}, { bookingId: number }, {}> = async (req, res) => {
  const { bookingId } = req.body;

  try {
    if (!bookingId) {
      res.status(400).json({
        success: false,
        message: 'Please provide booking ID',
      });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        restaurant: true,
      },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    // Check if booking is already cancelled or completed
    if (booking.status === BookingStatus.CANCELLED) {
      res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
      return;
    }

    if (booking.status === BookingStatus.COMPLETED) {
      res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking',
      });
      return;
    }

    // Using a transaction again

    await prisma.$transaction(async (tx) => {
      await tx.restaurant.update({
        where: { id: booking.restaurantId },
        data: {
          seatsAvailable: { increment: booking.numberOfGuests },
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledAt: new Date(),
        },
      });
    });

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling reservation',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return;
  }
};

const getAllReservations: RequestHandler<{ userId: string }, {}, {}, {}> = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'Please provide user ID',
      });
      return;
    }

    const reservations = await prisma.booking.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        restaurant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group reservations by status
    const activeReservations = reservations.filter((r) => r.status === BookingStatus.ACTIVE);
    const completedReservations = reservations.filter((r) => r.status === BookingStatus.COMPLETED);
    const cancelledReservations = reservations.filter((r) => r.status === BookingStatus.CANCELLED);

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: {
        all: reservations,
        active: activeReservations,
        completed: completedReservations,
        cancelled: cancelledReservations,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reservations',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return;
  }
};
export { reserveTable, cancelReservation, getAllReservations };
