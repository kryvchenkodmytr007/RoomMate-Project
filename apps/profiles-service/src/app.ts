import express from 'express';
import { z } from 'zod';
import { prisma, budgetRangeHttpError } from '@packages/shared';

export const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'profiles-service' }));

const CreateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  budgetMin: z.number().int().min(0),
  budgetMax: z.number().int().min(0),
  lifestyle: z.string().min(1).max(50),
});

app.post('/profiles', async (req, res) => {
  const parsed = CreateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Validation error', issues: parsed.error.issues });
  }

  const rangeErr = budgetRangeHttpError(parsed.data.budgetMin, parsed.data.budgetMax);
  if (rangeErr) return res.status(rangeErr.status).json(rangeErr.body);

  const profile = await prisma.profile.create({ data: parsed.data });
  return res.status(201).json(profile);
});

app.get('/profiles', async (_req, res) => {
  const profiles = await prisma.profile.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json(profiles);
});

app.get('/profiles/:id', async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { id: req.params.id } });
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  return res.json(profile);
});
