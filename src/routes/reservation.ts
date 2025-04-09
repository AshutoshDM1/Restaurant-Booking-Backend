import { Router } from 'express';
import {
  cancelReservation,
  getAllReservations,
  reserveTable,
} from '../controllers/reservationController';
import { authenticateToken } from '../middleware/auth';

const reservationRouter = Router();

reservationRouter.post('/', authenticateToken, reserveTable);
reservationRouter.delete('/', authenticateToken, cancelReservation);
reservationRouter.get('/:userId', authenticateToken, getAllReservations);

export default reservationRouter;
