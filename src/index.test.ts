import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './index';

describe('Main Route Tests', () => {
  it('should return 200 for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should handle invalid routes with 404', async () => {
    const response = await request(app).get('/nonexistent-route');
    expect(response.status).toBe(404);
  });
});
