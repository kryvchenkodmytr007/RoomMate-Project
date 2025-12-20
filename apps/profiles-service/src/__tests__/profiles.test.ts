import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { prisma } from '@packages/shared';
import { app } from '../app.js';

describe('profiles-service', () => {
  beforeAll(async () => {
    // чистим тестовую БД
    await prisma.matchRequest.deleteMany();
    await prisma.profile.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /profiles creates profile', async () => {
    const res = await request(app).post('/profiles').send({
      name: 'Alex',
      city: 'Kyiv',
      budgetMin: 400,
      budgetMax: 650,
      lifestyle: 'quiet',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Alex');
  });

  it('GET /profiles returns list', async () => {
    const res = await request(app).get('/profiles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
