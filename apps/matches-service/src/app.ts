import express from 'express';
import { z } from 'zod';
import { prisma, differentIdsHttpError } from '@packages/shared';
import { MatchStatus } from '@prisma/client';

export const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'matches-service' }));

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

  const idsErr = differentIdsHttpError(parsed.data.fromProfileId, parsed.data.toProfileId);
  if (idsErr) return res.status(idsErr.status).json(idsErr.body);

  const { fromProfileId, toProfileId } = parsed.data;

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
