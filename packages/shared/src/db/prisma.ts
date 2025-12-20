import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = findRepoRoot(path.resolve(__dirname, '../../../..'));
dotenv.config({ path: path.join(repoRoot, '.env') });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    if (!process.env.DATABASE_URL) {
      throw new Error(`DATABASE_URL is not set. Expected .env at: ${path.join(repoRoot, '.env')}`);
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter, log: ['error', 'warn'] });
  })();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
