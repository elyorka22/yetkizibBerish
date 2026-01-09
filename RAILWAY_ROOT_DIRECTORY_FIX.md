# 🔧 Исправление: Railway Root Directory

## ❌ Проблема

Railway генерирует Dockerfile из nixpacks с ошибками:
- `UndefinedVar: Usage of undefined variable '$NIXPACKS_PATH'`
- `failed to calculate checksum`

## ✅ Решение: Установить Root Directory

### Вариант 1: Root Directory = `backend` (рекомендуется)

1. Откройте Railway Dashboard → Ваш проект → Settings
2. Найдите раздел **"Root Directory"**
3. Установите значение: `backend`
4. Сохраните изменения
5. Railway автоматически перезапустит деплой

**После этого:**
- Railway будет работать из директории `backend`
- `nixpacks.toml` должен быть в корне (Railway все равно будет его использовать)
- Команды в `nixpacks.toml` не нужны `cd backend`, так как мы уже в `backend`

### Вариант 2: Обновить nixpacks.toml для работы из корня

Если Root Directory пустой, обновите `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["cd backend && npm ci"]

[phases.build]
cmds = ["cd backend && npm run build"]

[start]
cmd = "cd backend && npm start"
```

## 🎯 Рекомендуемая настройка

**В Railway Dashboard:**

1. **Root Directory**: `backend`
2. **Builder**: `Nixpacks` (автоматически)
3. **Build Command**: (пусто - используется из nixpacks.toml)
4. **Start Command**: (пусто - используется из railway.json или nixpacks.toml)

**Структура файлов:**
```
yetkizibBerish/
├── railway.json      ← В корне
├── nixpacks.toml     ← В корне
└── backend/          ← Root Directory указывает сюда
    ├── package.json
    ├── src/
    └── ...
```

## 📝 После установки Root Directory

Если Root Directory = `backend`, то:

1. Railway будет работать из `backend/`
2. Команды `npm install`, `npm run build`, `npm start` будут выполняться в `backend/`
3. `nixpacks.toml` в корне все равно будет использоваться
4. Но команды в нем должны учитывать, что рабочая директория - это `backend/`

## 🔄 Альтернатива: Упростить nixpacks.toml

Если Root Directory = `backend`, можно упростить `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

Но это потребует изменения структуры - нужно будет переместить `nixpacks.toml` в `backend/` или оставить в корне с командами `cd backend`.

## ✅ Проверка

После установки Root Directory = `backend`:

1. Railway перезапустит деплой
2. В логах должно быть:
   ```
   using build driver nixpacks-v1.41.0
   ╔═══════════════════════ Nixpacks v1.41.0 ══════════════════════╗
   ║ setup      │ nodejs-18_x                                      ║
   ║ install    │ npm ci                                           ║
   ║ build      │ npm run build                                     ║
   ║ start      │ npm start                                         ║
   ```
3. Не должно быть ошибок с Dockerfile

