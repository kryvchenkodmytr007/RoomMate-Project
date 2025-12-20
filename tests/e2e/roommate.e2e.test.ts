import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';

type Profile = { id: string };
type Match = { id: string; status: 'PENDING' | 'ACCEPTED' | 'REJECTED' };

const ROOT = process.cwd();

function startService(
  name: string,
  cwd: string,
  env: Record<string, string>,
): ChildProcessWithoutNullStreams {
  const child = spawn('pnpm', ['start:test'], {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'pipe',
  });
  child.stdout.on('data', d => process.stdout.write(`[${name}] ${d}`));
  child.stderr.on('data', d => process.stderr.write(`[${name}] ${d}`));
  return child;
}

async function waitForHealth(url: string, timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch (e) {
      void e;
    }
    await new Promise(r => setTimeout(r, 300));
  }
  throw new Error(`Healthcheck timeout: ${url}`);
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  expect(res.ok).toBe(true);
  return (await res.json()) as T;
}

async function patchJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  expect(res.ok).toBe(true);
  return (await res.json()) as T;
}

describe('E2E', () => {
  let profiles: ChildProcessWithoutNullStreams;
  let matches: ChildProcessWithoutNullStreams;

  beforeAll(async () => {
    profiles = startService('profiles', `${ROOT}/apps/profiles-service`, {
      ENV_FILE: '.env.test',
      NODE_ENV: 'test',
      PROFILES_PORT: '3001',
    });

    matches = startService('matches', `${ROOT}/apps/matches-service`, {
      ENV_FILE: '.env.test',
      NODE_ENV: 'test',
      MATCHES_PORT: '3002',
    });

    await waitForHealth('http://localhost:3001/health');
    await waitForHealth('http://localhost:3002/health');
  }, 30000);

  afterAll(() => {
    profiles.kill('SIGTERM');
    matches.kill('SIGTERM');
  });

  it('full flow: create profiles -> create match -> accept', async () => {
    const p1 = await postJson<Profile>('http://localhost:3001/profiles', {
      name: 'Alex',
      city: 'Kyiv',
      budgetMin: 400,
      budgetMax: 650,
      lifestyle: 'quiet',
    });

    const p2 = await postJson<Profile>('http://localhost:3001/profiles', {
      name: 'Max',
      city: 'Kyiv',
      budgetMin: 350,
      budgetMax: 700,
      lifestyle: 'active',
    });

    expect(p1.id).toBeTruthy();
    expect(p2.id).toBeTruthy();

    const match = await postJson<Match>('http://localhost:3002/matches/request', {
      fromProfileId: p1.id,
      toProfileId: p2.id,
      message: 'Hi',
    });

    expect(match.id).toBeTruthy();
    expect(match.status).toBe('PENDING');

    const updated = await patchJson<Match>(`http://localhost:3002/matches/${match.id}/status`, {
      status: 'ACCEPTED',
    });

    expect(updated.status).toBe('ACCEPTED');
  });
});
