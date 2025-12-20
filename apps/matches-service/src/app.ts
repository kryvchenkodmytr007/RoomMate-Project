import express from 'express';
import { z } from 'zod';
import { prisma } from '@packages/shared';
import { MatchStatus } from '@prisma/client';

export const app = express();
app.use(express.json());

const CreateMatchRequestSchema = z.object({
  fromProfileId: z.string().uuid(),
  toProfileId: z.string().uuid(),
  message: z.string().max(500).optional(),
});

const UpdateStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
});

app.post('/matches/request', async (req, res) => {
  const parsed = CreateMatchRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Validation error', issues: parsed.error.issues });
  }

  const { fromProfileId, toProfileId } = parsed.data;
  if (fromProfileId === toProfileId) {
    return res.status(409).json({ message: 'fromProfileId must differ from toProfileId' });
  }

  const [from, to] = await Promise.all([
    prisma.profile.findUnique({ where: { id: fromProfileId } }),
    prisma.profile.findUnique({ where: { id: toProfileId } }),
  ]);

  if (!from || !to) {
    return res.status(404).json({ message: 'Profile not found for fromProfileId/toProfileId' });
  }

  const created = await prisma.matchRequest.create({ data: parsed.data });
  return res.status(201).json(created);
});

app.get('/matches', async (req, res) => {
  const profileId = typeof req.query.profileId === 'string' ? req.query.profileId : undefined;

  const where = profileId ? { OR: [{ fromProfileId: profileId }, { toProfileId: profileId }] } : {};

  const matches = await prisma.matchRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return res.json(matches);
});

app.patch('/matches/:id/status', async (req, res) => {
  const parsed = UpdateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Validation error', issues: parsed.error.issues });
  }

  const id = req.params.id;

  const exists = await prisma.matchRequest.findUnique({ where: { id } });
  if (!exists) return res.status(404).json({ message: 'Match request not found' });

  const updated = await prisma.matchRequest.update({
    where: { id },
    data: { status: parsed.data.status as MatchStatus },
  });

  return res.json({ id: updated.id, status: updated.status });
});
