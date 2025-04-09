import { beforeAll, afterAll } from 'vitest';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

// Global setup that runs before all tests
beforeAll(async () => {
  await prisma.$connect();
});

// Global cleanup that runs after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
