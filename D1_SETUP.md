# Настройка Cloudflare D1 Database

## Информация о базе данных

- **Database Name**: planer-db
- **Database ID**: 8e3768b0-6db2-40ed-ad39-8f6639991149
- **Binding**: DB (доступен в worker через `env.DB`)

## Структура базы данных

### Таблица: app_version

Хранит информацию о версиях приложения.

**Поля:**
- `id` - Уникальный идентификатор (автоинкремент)
- `version` - Версия приложения (например, "0.0.1")
- `platform` - Платформа ('web', 'android', 'ios')
- `build_number` - Номер сборки
- `release_date` - Дата релиза
- `is_current` - Флаг текущей версии (0 или 1)
- `description` - Описание версии
- `created_at` - Дата создания записи
- `updated_at` - Дата обновления записи

## Доступные команды

### Применить миграции

```bash
# Применить к удаленной базе данных
npm run db:migrate

# Применить к локальной базе данных
npm run db:migrate:local
```

### Работа с консолью D1

```bash
# Удаленная база данных
npm run db:console

# Локальная база данных
npm run db:console:local
```

### Прямые команды wrangler

```bash
# Создать новую миграцию
npx wrangler d1 migrations create planer-db <migration-name>

# Список всех миграций
npx wrangler d1 migrations list planer-db

# Выполнить SQL запрос (удаленно)
npx wrangler d1 execute planer-db --remote --command="SELECT * FROM app_version"

# Выполнить SQL запрос (локально)
npx wrangler d1 execute planer-db --local --command="SELECT * FROM app_version"
```

## API Endpoints

### GET /api/version

Получить информацию о текущей версии приложения.

**Пример ответа:**
```json
{
  "success": true,
  "data": {
    "version": "0.0.1",
    "platform": "web",
    "build_number": 1,
    "release_date": "2025-12-04 08:00:00",
    "description": "Начальная версия приложения с D1"
  }
}
```

### GET /api/versions

Получить список всех версий приложения.

**Пример ответа:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "version": "0.0.1",
      "platform": "web",
      "build_number": 1,
      "release_date": "2025-12-04 08:00:00",
      "is_current": 1,
      "description": "Начальная версия приложения с D1",
      "created_at": "2025-12-04 08:00:00",
      "updated_at": "2025-12-04 08:00:00"
    }
  ],
  "count": 1
}
```

## Примеры использования в коде

### Простой SELECT запрос

```typescript
const result = await env.DB.prepare(
  "SELECT * FROM app_version WHERE is_current = 1"
).first();
```

### SELECT с параметрами

```typescript
const result = await env.DB.prepare(
  "SELECT * FROM app_version WHERE platform = ?"
).bind("web").first();
```

### INSERT запрос

```typescript
await env.DB.prepare(
  "INSERT INTO app_version (version, platform, build_number, release_date, description) VALUES (?, ?, ?, ?, ?)"
).bind("0.0.2", "web", 2, "2025-12-04", "Обновление версии").run();
```

### UPDATE запрос

```typescript
await env.DB.prepare(
  "UPDATE app_version SET is_current = 0 WHERE is_current = 1"
).run();
```

### Получение всех записей

```typescript
const { results } = await env.DB.prepare(
  "SELECT * FROM app_version ORDER BY created_at DESC"
).all();
```

### Batch запросы

```typescript
const results = await env.DB.batch([
  env.DB.prepare("UPDATE app_version SET is_current = 0"),
  env.DB.prepare("INSERT INTO app_version (version, platform, build_number, release_date, is_current) VALUES (?, ?, ?, ?, ?)").bind("0.0.3", "web", 3, "2025-12-04", 1)
]);
```

## Тестирование

Для тестирования API локально:

1. Запустите dev сервер: `npm run dev`
2. Откройте браузер и перейдите по адресу:
   - http://localhost:5173/api/version
   - http://localhost:5173/api/versions

## Полезные ссылки

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [D1 Client API](https://developers.cloudflare.com/d1/platform/client-api/)
- [Wrangler D1 Commands](https://developers.cloudflare.com/workers/wrangler/commands/#d1)

