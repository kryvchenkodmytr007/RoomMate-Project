# RoomMate Match

RoomMate Match — бекенд у форматі monorepo з двох сервісів для керування профілями кандидатів на спільне проживання та обробки матч-запитів між ними.

## Ідея

Користувач створює профіль із базовими параметрами (місто, бюджет, стиль життя). Інший користувач може надіслати запит на матч, який власник другого профілю може прийняти або відхилити.

## Сервіси та відповідальність

- **Profiles Service** — створення та перегляд профілів.
- **Matches Service** — створення та обробка матч-запитів між профілями.
- **packages/shared** — спільні DTO та валідація (Zod).

## Мінімальний API (Lab 2)

### Profiles Service

- `POST /profiles` — створити профіль
- `GET /profiles` — список профілів
- `GET /profiles/:id` — профіль за id

### Matches Service

- `POST /matches/request` — створити матч-запит
- `GET /matches` — список матч-запитів (опційно `?profileId=...`)
- `PATCH /matches/:id/status` — змінити статус (`PENDING | ACCEPTED | REJECTED`)

Детальні приклади: `docs/scenarios.md`.

## Діаграми (Mermaid)

- Компонентна та ER-діаграма збережені як Mermaid-блоки у:
  - `docs/architecture.md`
  - `docs/data-model.md`

> Mermaid рендериться автоматично в GitHub Markdown (у веб-інтерфейсі репозиторію).

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
infra/
```

## Як запустити локально

> Для Lab 2 достатньо базової ініціалізації. База даних/Prisma підключається на наступних лабах.

Встановити залежності:

```bash
pnpm install
```

Запустити сервіси:

```bash
pnpm dev:profiles
pnpm dev:matches
```

## Скрипти якості (Lab 1)

- `pnpm format` — перевірка форматування
- `pnpm lint` — лінт
- `pnpm typecheck` — перевірка типів

## Документація

- `docs/architecture.md` — архітектура, компоненти, шари + компонентна діаграма
- `docs/data-model.md` — модель даних + ER-діаграма
- `docs/scenarios.md` — API сценарії (приклади запитів/відповідей)
