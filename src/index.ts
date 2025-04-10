import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import restaurantRouter from './routes/restaurant';
import userRouter from './routes/user';
import reservationRouter from './routes/reservation';

// Load environment variables
dotenv.config({ path: '.env' });

export const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/v1/restaurant', restaurantRouter);
app.use('/api/v1/reservation', reservationRouter);
app.use('/api/v1/user', userRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message,
  });
  next();
});

app.get('/', async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hello World',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
