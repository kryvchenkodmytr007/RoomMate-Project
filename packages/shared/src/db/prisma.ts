import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

function findRepoRoot(startDir: string): string {
  let dir = startDir;
  while (true) {
    const pkgJson = path.join(dir, 'package.json');
    if (fs.existsSync(pkgJson)) return dir;

    const parent = path.dirname(dir);
    if (parent === dir) return startDir;
    dir = parent;
  }
}

function loadEnv() {
  // если env уже задан в окружении — не мешаем
  if (process.env.DATABASE_URL) return;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const repoRoot = findRepoRoot(path.resolve(__dirname, '../../../..'));
  const envFile = process.env.ENV_FILE ?? (process.env.NODE_ENV === 'test' ? '.env.test' : '.env');

  dotenv.config({ path: path.join(repoRoot, envFile) });
}

loadEnv();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set. Check .env / .env.test in repo root.');
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter, log: ['error', 'warn'] });
  })();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
