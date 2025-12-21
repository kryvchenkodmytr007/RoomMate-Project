# Лабораторна робота №6 — Розгортання (CI/CD)

## CI (GitHub Actions)

Воркфлоу: `.github/workflows/ci.yml`

Перевіряє:

- форматування (`pnpm format`)
- ESLint (`pnpm lint`)
- TypeScript (`pnpm typecheck`)
- unit/integration тести (`pnpm test` з підготовкою тестової БД)
- E2E (`pnpm test:e2e`)
- conventional commits для PR (`pnpm commitlint ...`)

## CD (Render deploy hooks)

Воркфлоу: `.github/workflows/cd.yml`

Підхід максимально простий: на кожен push в `main` воркфлоу викликає **Render Deploy Hook** для кожного сервісу.

### Як налаштувати Render

1. У Render створіть 2 Web Service:

- `profiles-service`
- `matches-service`

2. Для кожного сервісу вкажіть:

- Runtime: Node
- Build command (приклад):
  - `pnpm install && pnpm build`
- Start command:
  - profiles: `node apps/profiles-service/dist/index.js`
  - matches: `node apps/matches-service/dist/index.js`

3. Додайте змінні середовища (Environment) для підключення до PostgreSQL:

- `DATABASE_URL` — рядок підключення до продової БД

> У Prisma 7 URL для міграцій читається з `prisma.config.ts`, а PrismaClient бере URL із `process.env.DATABASE_URL` (див. `packages/shared/src/db/prisma.ts`).

4. У Render для кожного сервісу знайдіть **Deploy Hook** і скопіюйте URL.

### Як налаштувати GitHub Secrets

У репозиторії (Settings → Secrets and variables → Actions) додайте:

- `RENDER_DEPLOY_HOOK_PROFILES`
- `RENDER_DEPLOY_HOOK_MATCHES`

Після цього кожен push в `main` буде тригерити деплой.

### Примітка

Якщо ви не використовуєте Render — CD воркфлоу легко адаптується під Railway/Fly.io/інший хостинг: достатньо замінити кроки з `curl` на ваші команди деплою.
