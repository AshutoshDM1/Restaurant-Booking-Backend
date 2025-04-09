import { RequestHandler } from 'express';
import prisma from '../db/db';

const createRestaurant: RequestHandler<
  {},
  {},
  { name: string; location: string; cuisine: string[]; totalSeats: number; seatsAvailable: number },
  {}
> = async (req, res) => {
  const { name, location, cuisine, totalSeats, seatsAvailable } = req.body;

  try {
    if (!name || !location || !cuisine || !totalSeats || !seatsAvailable) {
      res.status(400).json({
        success: false,
        message: 'Please provide name, location, cuisine, totalSeats, and seatsAvailable',
      });
      return;
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        location,
        cuisine,
        totalSeats,
        seatsAvailable,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating restaurant',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return;
  }
};

const getAllRestaurants: RequestHandler<{}, {}, {}, {}> = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({});

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurants',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return;
  }
};

const getRestaurantById: RequestHandler<{ id: string }, {}, {}, {}> = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Please provide restaurant ID',
      });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return;
  }
};

export { createRestaurant, getAllRestaurants, getRestaurantById };
