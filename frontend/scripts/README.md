# Скрипты для демо-данных

## Создание демо-пользователей

### Вариант 1: Через Firebase Console (Рекомендуется)

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект
3. Перейдите в **Authentication > Users**
4. Нажмите **Add user** и создайте следующих пользователей:

#### Демо-пользователи:

1. **Супер Администратор**
   - Email: `admin@demo.com`
   - Password: `admin123`

2. **Менеджер**
   - Email: `manager@demo.com`
   - Password: `manager123`

3. **Сборщик**
   - Email: `picker@demo.com`
   - Password: `picker123`

4. **Курьер**
   - Email: `courier@demo.com`
   - Password: `courier123`

### Вариант 2: Через Firestore Console

После создания пользователей в Authentication, создайте записи в Firestore:

1. Перейдите в **Firestore Database**
2. Создайте коллекцию `users`
3. Для каждого пользователя создайте документ с ID = UID из Authentication

#### Структура документа:

```json
{
  "email": "admin@demo.com",
  "name": "Супер Администратор",
  "phone": "+998901234567",
  "role": "super_admin",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Создание демо-заказов

1. Перейдите в **Firestore Database**
2. Создайте коллекцию `orders`
3. Добавьте несколько заказов с разными статусами

**Важно:** В заказах замените `picker_user_id` и `courier_user_id` на реальные UID пользователей из Authentication.

## Быстрый вход

После создания пользователей, вы можете использовать страницу `/demo` для быстрого входа с любой ролью.

