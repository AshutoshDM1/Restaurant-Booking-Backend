import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import main from './routes/main';

dotenv.config();

export const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use('/', main);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
