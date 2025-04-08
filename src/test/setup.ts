import dotenv from 'dotenv';
import { beforeAll } from 'vitest';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// Global setup that runs before all tests
beforeAll(() => {
  // Add any global setup here
  // For example, setting up test database connections
});
