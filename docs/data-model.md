# Модель даних

## Сутності

### Profile

- `id` (UUID) — PK
- `name` (string)
- `city` (string)
- `budgetMin` (int)
- `budgetMax` (int)
- `lifestyle` (string або enum)
- `createdAt` (datetime)

### MatchRequest

- `id` (UUID) — PK
- `fromProfileId` (UUID) — FK → Profile.id
- `toProfileId` (UUID) — FK → Profile.id
- `message` (string, optional)
- `status` (enum: `PENDING | ACCEPTED | REJECTED`)
- `createdAt` (datetime)

## Обмеження та правила

- `fromProfileId != toProfileId`
- `fromProfileId` та `toProfileId` повинні посилатися на існуючі профілі
- Зміна статусу можлива тільки на допустимі значення enum

## ER-діаграма (Mermaid)

```mermaid
erDiagram
  PROFILE {
    string id PK
    string name
    string city
    int budgetMin
    int budgetMax
    string lifestyle
    datetime createdAt
  }

  MATCH_REQUEST {
    string id PK
    string fromProfileId FK
    string toProfileId FK
    string message
    string status
    datetime createdAt
  }

  PROFILE ||--o{ MATCH_REQUEST : fromProfileId
  PROFILE ||--o{ MATCH_REQUEST : toProfileId
```

> Примітка: у Mermaid `erDiagram` enum можна позначати як `string status` + опис у тексті або винести окремою секцією документа.
