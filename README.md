# RoomMate Match

RoomMate Match — бекенд у форматі **monorepo** з двох сервісів для керування профілями людей та обробки match-запитів між ними.

## Ідея

Користувач створює профіль із базовими параметрами (місто, бюджет, стиль життя). Інший користувач може надіслати запит на match, який власник другого профілю може прийняти або відхилити.

## Сервіси

- **Profiles Service** — створення та перегляд профілів.
- **Matches Service** — створення та обробка match-запитів між профілями.
- **packages/shared** — спільний Prisma-клієнт + чисті доменні правила (unit-тести).

## Мінімальний API

### Profiles Service

- `GET /health` — health-check
- `POST /profiles` — створити профіль
- `GET /profiles` — список профілів
- `GET /profiles/:id` — профіль за id

### Matches Service

- `GET /health` — health-check
- `POST /matches/request` — створити match-запит
- `GET /matches` — список match-запитів (опційно `?profileId=...`)
- `PATCH /matches/:id/status` — змінити статус (`PENDING | ACCEPTED | REJECTED`)

Детальні приклади: `docs/scenarios.md`.

## Діаграми (Mermaid)

Mermaid рендериться автоматично в GitHub Markdown (у веб-інтерфейсі репозиторію).

- `docs/architecture.md`
- `docs/data-model.md`

## Структура репозиторію

```
apps/
  profiles-service/
  matches-service/
packages/
  shared/
docs/
  architecture.md
  data-model.md
  scenarios.md
  testing-report.md
prisma/
```

## Локальний запуск

1. Встановити залежності:

```bash
pnpm install
```

2. Підняти PostgreSQL (Docker):

```bash
pnpm db:up
```

3. Міграції та Prisma Client:

```bash
pnpm prisma:migrate --name init
pnpm prisma:generate
```

4. Запустити сервіси (у різних терміналах):

```bash
pnpm dev:profiles
pnpm dev:matches
```

## Скрипти якості (Lab 1)

- `pnpm format` — перевірка форматування
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript

## Тестування (Lab 5)

- Підготовка тестової БД + міграції:

```bash
pnpm test:setup
```

- Unit + integration (Vitest):

```bash
pnpm test
```

- E2E (піднімає обидва сервіси як процеси):

```bash
pnpm test:e2e
```

- Мутаційне тестування (Stryker):

```bash
pnpm test:mutation
```

Звіт: `docs/testing-report.md`.

## CI/CD (Lab 6)

У репозиторії є GitHub Actions воркфлоу для CI (`.github/workflows/ci.yml`) та CD (`.github/workflows/cd.yml`).
