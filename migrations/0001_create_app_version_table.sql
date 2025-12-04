-- Миграция: создание таблицы версий приложения
-- Создано: 2025-12-04

DROP TABLE IF EXISTS app_version;

CREATE TABLE app_version (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'web', 'android', 'ios'
    build_number INTEGER NOT NULL,
    release_date TEXT NOT NULL,
    is_current INTEGER DEFAULT 0, -- 0 = false, 1 = true
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем тестовую запись с текущей версией
INSERT INTO app_version (version, platform, build_number, release_date, is_current, description) 
VALUES ('0.0.1', 'web', 1, datetime('now'), 1, 'Начальная версия приложения с D1');

-- Создаем индекс для быстрого поиска текущей версии
CREATE INDEX idx_app_version_current ON app_version(is_current);
CREATE INDEX idx_app_version_platform ON app_version(platform);

