import { Router } from 'express';
import { createRestaurant, getRestaurantById } from '../controllers/restaurantController';
import { getAllRestaurants } from '../controllers/restaurantController';
import { authenticateToken } from '../middleware/auth';
const restaurantRouter = Router();

restaurantRouter.post('/', authenticateToken, createRestaurant);
restaurantRouter.get('/', authenticateToken, getAllRestaurants);
restaurantRouter.get('/:id', authenticateToken, getRestaurantById);

export default restaurantRouter;
