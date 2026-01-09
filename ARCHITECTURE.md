# Архитектура проекта YetkazibBeish

## Обзор

Проект построен на трех основных компонентах:
- **Frontend**: Next.js приложение на Vercel
- **Backend**: Express API на Railway
- **Database**: Firebase (Firestore, Auth, Storage)

## Структура проекта

```
yetkazib-beish/
├── frontend/          # Next.js приложение
│   ├── src/
│   │   ├── app/       # Next.js App Router страницы
│   │   ├── components/ # React компоненты
│   │   ├── config/    # Конфигурация (Firebase)
│   │   ├── lib/       # Утилиты и библиотеки
│   │   ├── services/  # Сервисы для работы с Firestore
│   │   ├── store/     # Zustand store
│   │   └── types/     # TypeScript типы
│   └── package.json
├── backend/          # Express API
│   ├── src/
│   │   ├── config/    # Конфигурация (Firebase Admin)
│   │   ├── middleware/ # Express middleware
│   │   ├── routes/    # API routes
│   │   └── index.ts   # Точка входа
│   └── package.json
└── README.md
```

## Система ролей

### Роли пользователей

1. **Super Admin** (`super_admin`)
   - Полный доступ ко всем функциям
   - Управление пользователями
   - Управление товарами, категориями, баннерами
   - Просмотр статистики
   - Системные настройки

2. **Manager** (`manager`)
   - Просмотр всех заказов
   - Назначение заказов сборщикам и курьерам
   - Изменение статусов заказов
   - Просмотр статистики

3. **Picker** (`picker`)
   - Просмотр только назначенных заказов
   - Изменение статуса на "Собран"
   - Нет доступа к другим заказам

4. **Courier** (`courier`)
   - Просмотр только назначенных заказов
   - Изменение статуса на "В доставке" и "Доставлен"
   - Нет доступа к другим заказам

## Логика заказов

### Статусы заказов

1. `new` - Новый заказ
2. `assigned_to_picker` - Назначен сборщику
3. `picked` - Собран
4. `assigned_to_courier` - Назначен курьеру
5. `in_delivery` - В доставке
6. `delivered` - Доставлен (закрыт)

### Переходы статусов

```
new → assigned_to_picker → picked → assigned_to_courier → in_delivery → delivered
```

### Кто может изменять статусы

- **Manager/Super Admin**: Могут изменять любой статус
- **Picker**: Может изменить `assigned_to_picker` → `picked`
- **Courier**: Может изменить `assigned_to_courier` → `in_delivery` → `delivered`

## Real-time обновления

Используется Firestore `onSnapshot` для real-time обновлений:
- Заказы обновляются автоматически при изменении в Firestore
- Не требуется перезагрузка страницы
- Работает для всех ролей

## Безопасность

### Frontend
- Проверка ролей через RBAC утилиты
- Защита маршрутов на основе ролей
- Автоматический редирект при отсутствии прав

### Backend
- JWT токены Firebase для аутентификации
- Middleware для проверки токенов
- Валидация ролей на сервере
- Проверка прав доступа для каждого действия

### Firestore Security Rules
- Ограничение доступа на уровне базы данных
- Правила основаны на ролях пользователей
- Защита от несанкционированного доступа

## API Endpoints

### Auth
- `POST /auth/verify` - Проверка токена

### Orders
- `POST /orders/:orderId/assign-picker` - Назначить заказ сборщику (Manager/Super Admin)
- `POST /orders/:orderId/assign-courier` - Назначить заказ курьеру (Manager/Super Admin)
- `PATCH /orders/:orderId/status` - Изменить статус заказа

## Масштабируемость

### Frontend
- Модульная архитектура компонентов
- Разделение по ролям
- Легко добавлять новые страницы и функции
- Оптимизация через Next.js

### Backend
- RESTful API
- Middleware для переиспользования логики
- Валидация через Zod
- Легко добавлять новые endpoints

### Database
- Firestore для горизонтального масштабирования
- Индексы для оптимизации запросов
- Real-time синхронизация

## Расширение функционала

### Добавление новой роли
1. Добавить роль в `types/index.ts`
2. Добавить права в `lib/rbac.ts`
3. Создать страницу для роли
4. Обновить backend middleware

### Добавление нового статуса заказа
1. Добавить статус в `types/index.ts`
2. Обновить логику переходов в `lib/rbac.ts`
3. Обновить валидацию в backend
4. Обновить UI компоненты

### Добавление новых сущностей
1. Создать тип в `types/index.ts`
2. Создать сервис в `services/firestore.ts`
3. Создать компоненты для работы с сущностью
4. Добавить API endpoints в backend

