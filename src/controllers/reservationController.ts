import { RequestHandler } from 'express';
import prisma from '../db/db';
import { BookingStatus } from '@prisma/client';
import {
  ReserveTableParams,
  ReserveTableResponse,
  ReserveTableBody,
  ReserveTableQuery,
  CancelReservationParams,
  CancelReservationResponse,
  CancelReservationBody,
  CancelReservationQuery,
  GetAllReservationsParams,
  GetAllReservationsResponse,
  GetAllReservationsBody,
  GetAllReservationsQuery,
} from '../types/reservationTypes';
import { emailService } from '../emailServices/emailService';

const reserveTable: RequestHandler<
  ReserveTableParams,
  ReserveTableResponse,
  ReserveTableBody,
  ReserveTableQuery
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

    // Check if user already has an active booking at this restaurant
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: userId,
        restaurantId: restaurantId,
        status: BookingStatus.ACTIVE,
      },
    });

    if (existingBooking) {
      res.status(400).json({
        success: false,
        message:
          'You already have an active booking at this restaurant booking Id:' + existingBooking.id,
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

    // Use a transaction to ensure both operations succeed or fail together
    const booking = await prisma.$transaction(async (tx) => {
      // Double-check active bookings within transaction to prevent race conditions
      const activeBooking = await tx.booking.findFirst({
        where: {
          userId: userId,
          restaurantId: restaurantId,
          status: BookingStatus.ACTIVE,
        },
      });

      if (activeBooking) {
        throw new Error('Double booking detected');
      }

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

    // After successful booking creation, send confirmation email
    try {
      await emailService.sendBookingConfirmation(booking.user.email, {
        name: booking.user.name,
        restaurantName: booking.restaurant.name,
        numberOfGuests: booking.numberOfGuests,
        bookingId: booking.id,
        date: booking.createdAt,
        time: booking.createdAt.toLocaleTimeString(),
        restaurantLocation: booking.restaurant.location,
        managementLink: `https://restaurant-table-booking-frontend.vercel.app/reservations/${booking.id}`,
      });
      console.log('Booking confirmation email sent successfully to:', booking.user.email);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue with the response even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    // Handle specific error for double booking
    if (error instanceof Error && error.message === 'Double booking detected') {
      res.status(400).json({
        success: false,
        message: 'You already have an active booking at this restaurant',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error reserving table',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return;
  }
};

const cancelReservation: RequestHandler<
  CancelReservationParams,
  CancelReservationResponse,
  CancelReservationBody,
  CancelReservationQuery
> = async (req, res) => {
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
        user: true,
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

    // After successful cancellation, send cancellation email
    try {
      await emailService.sendBookingCancellation(booking.user.email, {
        name: booking.user.name,
        restaurantName: booking.restaurant.name,
        bookingId: booking.id,
        bookingDate: booking.createdAt,
        cancellationTime: new Date(),
        bookingLink: 'https://restaurant-table-booking-frontend.vercel.app/restaurants',
      });
      console.log('Booking cancellation email sent successfully to:', booking.user.email);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Continue with the response even if email fails
    }

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

const getAllReservations: RequestHandler<
  GetAllReservationsParams,
  GetAllReservationsResponse,
  GetAllReservationsBody,
  GetAllReservationsQuery
> = async (req, res) => {
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
