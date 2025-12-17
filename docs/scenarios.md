# API сценарії

Нижче наведено приклади запитів/відповідей для мінімального API (6 маршрутів).

## Profiles Service

### Створити профіль

**POST** `/profiles`

Request body:

```json
{
  "name": "Alex",
  "city": "Kyiv",
  "budgetMin": 400,
  "budgetMax": 650,
  "lifestyle": "quiet"
}
```

Response 201:

```json
{
  "id": "a0f3b7a2-5c2e-4f8d-8b65-9c9f1f9f5a01",
  "name": "Alex",
  "city": "Kyiv",
  "budgetMin": 400,
  "budgetMax": 650,
  "lifestyle": "quiet",
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

### Список профілів

**GET** `/profiles`

Response 200:

```json
[
  {
    "id": "a0f3b7a2-5c2e-4f8d-8b65-9c9f1f9f5a01",
    "name": "Alex",
    "city": "Kyiv",
    "budgetMin": 400,
    "budgetMax": 650,
    "lifestyle": "quiet",
    "createdAt": "2025-12-22T00:00:00.000Z"
  }
]
```

### Отримати профіль за id

**GET** `/profiles/:id`

Response 200:

```json
{
  "id": "a0f3b7a2-5c2e-4f8d-8b65-9c9f1f9f5a01",
  "name": "Alex",
  "city": "Kyiv",
  "budgetMin": 400,
  "budgetMax": 650,
  "lifestyle": "quiet",
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

Response 404:

```json
{ "message": "Profile not found" }
```

---

## Matches Service

### Створити матч-запит

**POST** `/matches/request`

Request body:

```json
{
  "fromProfileId": "11111111-1111-1111-1111-111111111111",
  "toProfileId": "22222222-2222-2222-2222-222222222222",
  "message": "Hi! Let's rent together"
}
```

Response 201:

```json
{
  "id": "b2b2b2b2-2222-4444-8888-aaaaaaaaaaaa",
  "fromProfileId": "11111111-1111-1111-1111-111111111111",
  "toProfileId": "22222222-2222-2222-2222-222222222222",
  "message": "Hi! Let's rent together",
  "status": "PENDING",
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

### Список матч-запитів

**GET** `/matches`

Опційно:

- `GET /matches?profileId=<uuid>` — показати матчі, де профіль є ініціатором або отримувачем

Response 200:

```json
[
  {
    "id": "b2b2b2b2-2222-4444-8888-aaaaaaaaaaaa",
    "fromProfileId": "11111111-1111-1111-1111-111111111111",
    "toProfileId": "22222222-2222-2222-2222-222222222222",
    "message": "Hi! Let's rent together",
    "status": "PENDING",
    "createdAt": "2025-12-22T00:00:00.000Z"
  }
]
```

### Змінити статус матч-запиту

**PATCH** `/matches/:id/status`

Request body:

```json
{ "status": "ACCEPTED" }
```

Response 200:

```json
{
  "id": "b2b2b2b2-2222-4444-8888-aaaaaaaaaaaa",
  "status": "ACCEPTED"
}
```

Response 400:

```json
{ "message": "Invalid status" }
```

Response 404:

```json
{ "message": "Match request not found" }
```

## Рекомендовані коди помилок

- 400 — помилка валідації (Zod)
- 404 — не знайдено
- 409 — конфлікт/некоректна дія (наприклад, `fromProfileId == toProfileId`)
