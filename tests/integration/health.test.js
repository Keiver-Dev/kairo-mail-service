import request from 'supertest';
import app from '../../src/app.js';
import pool from '../../src/config/database.js';

describe('GET /health', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should return 200 or 503 and health status', async () => {
    const response = await request(app).get('/health');
    
    // Status can be 200 (ok) or 503 (degraded) depending on environment
    expect([200, 503]).toContain(response.status);
    expect(['ok', 'degraded']).toContain(response.body.status);
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('checks');
    expect(response.body.checks).toHaveProperty('database');
    expect(response.body.checks).toHaveProperty('smtp');
  });
});
