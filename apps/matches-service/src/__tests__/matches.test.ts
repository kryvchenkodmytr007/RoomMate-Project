import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { prisma } from '@packages/shared';
import { app } from '../app.js';

describe('matches-service', () => {
  let fromId = '';
  let toId = '';

  beforeAll(async () => {
    await prisma.matchRequest.deleteMany();
    await prisma.profile.deleteMany();

    const p1 = await prisma.profile.create({
      data: { name: 'A', city: 'Kyiv', budgetMin: 300, budgetMax: 600, lifestyle: 'quiet' },
    });
    const p2 = await prisma.profile.create({
      data: { name: 'B', city: 'Kyiv', budgetMin: 350, budgetMax: 700, lifestyle: 'active' },
    });

    fromId = p1.id;
    toId = p2.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /matches/request creates match request', async () => {
    const res = await request(app).post('/matches/request').send({
      fromProfileId: fromId,
      toProfileId: toId,
      message: 'Hi',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('PENDING');
  });

  it('PATCH /matches/:id/status updates status', async () => {
    const created = await prisma.matchRequest.create({
      data: { fromProfileId: fromId, toProfileId: toId, message: 'Yo' },
    });

    const res = await request(app)
      .patch(`/matches/${created.id}/status`)
      .send({ status: 'ACCEPTED' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ACCEPTED');
  });
});
