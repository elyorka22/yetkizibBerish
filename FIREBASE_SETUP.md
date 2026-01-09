# 🔥 Настройка Firebase

## Шаг 1: Создание проекта Firebase

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Нажмите **"Add project"** или **"Создать проект"**
3. Введите название проекта (например: `yetkazib-beish`)
4. Следуйте инструкциям мастера создания проекта
5. Дождитесь создания проекта

## Шаг 2: Настройка Authentication

1. В Firebase Console выберите ваш проект
2. Перейдите в **Authentication** (в левом меню)
3. Нажмите **"Get started"** или **"Начать"**
4. Выберите вкладку **"Sign-in method"**
5. Включите **Email/Password**:
   - Нажмите на "Email/Password"
   - Включите переключатель
   - Нажмите **"Save"**

## Шаг 3: Настройка Firestore

1. Перейдите в **Firestore Database** (в левом меню)
2. Нажмите **"Create database"** или **"Создать базу данных"**
3. Выберите режим:
   - **Production mode** (для продакшена)
   - **Test mode** (для разработки - разрешает все запросы на 30 дней)
4. Выберите регион (например: `us-central` или ближайший к вам)
5. Нажмите **"Enable"**

## Шаг 4: Настройка Storage (опционально)

1. Перейдите в **Storage** (в левом меню)
2. Нажмите **"Get started"**
3. Примите правила безопасности
4. Выберите регион
5. Нажмите **"Done"**

## Шаг 5: Получение конфигурации

1. В Firebase Console перейдите в **Project Settings** (⚙️ в левом верхнем углу)
2. Прокрутите вниз до раздела **"Your apps"**
3. Нажмите на иконку **Web** (`</>`)
4. Введите название приложения (например: `YetkazibBeish Web`)
5. Нажмите **"Register app"**
6. Скопируйте конфигурацию Firebase

Вы увидите что-то вроде:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Шаг 6: Настройка .env.local

1. Откройте файл `frontend/.env.local`
2. Замените значения на реальные из Firebase Console:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Сохраните файл

## Шаг 7: Перезапуск сервера

После изменения `.env.local` нужно перезапустить dev-сервер:

```bash
# Остановите текущий сервер (Ctrl+C)
# Затем запустите снова:
cd frontend
npm run dev
```

## Шаг 8: Создание первого пользователя

### Вариант 1: Через Firebase Console

1. Перейдите в **Authentication > Users**
2. Нажмите **"Add user"**
3. Введите email и пароль
4. Нажмите **"Add user"**
5. Скопируйте **UID** пользователя

### Вариант 2: Через код (после настройки)

После настройки Firebase вы сможете регистрироваться через интерфейс.

## Шаг 9: Создание записи пользователя в Firestore

1. Перейдите в **Firestore Database**
2. Создайте коллекцию `users` (если её нет)
3. Создайте документ с **ID = UID пользователя** из Authentication
4. Добавьте поля:

```json
{
  "email": "admin@example.com",
  "name": "Admin User",
  "phone": "+998901234567",
  "role": "super_admin",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Важно:** Используйте правильный формат даты или выберите тип `timestamp` в Firestore.

## Шаг 10: Настройка Security Rules

### Firestore Rules

Перейдите в **Firestore Database > Rules** и добавьте:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        (request.auth.uid == userId || getUserRole() == 'super_admin');
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create: if true; // Позволяем создавать заказы без авторизации
      allow update: if isAuthenticated();
      allow delete: if false;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Публичный доступ для чтения
      allow write: if isAuthenticated() && 
        (getUserRole() == 'super_admin' || getUserRole() == 'manager');
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if true; // Публичный доступ для чтения
      allow write: if isAuthenticated() && 
        (getUserRole() == 'super_admin' || getUserRole() == 'manager');
    }
  }
}
```

### Storage Rules (если используете)

Перейдите в **Storage > Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## ✅ Проверка настройки

После настройки:

1. Откройте http://localhost:3000/login
2. Попробуйте войти с созданным пользователем
3. Проверьте консоль браузера (F12) на наличие ошибок

## 🐛 Решение проблем

### Ошибка "api-key-not-valid"
- Проверьте, что все переменные в `.env.local` правильные
- Убедитесь, что перезапустили сервер после изменения `.env.local`
- Проверьте, что переменные начинаются с `NEXT_PUBLIC_`

### Ошибка "auth/operation-not-allowed"
- Проверьте, что Email/Password включен в Authentication
- Перейдите в Authentication > Sign-in method и включите Email/Password

### Ошибка "permission-denied"
- Проверьте Security Rules в Firestore
- Убедитесь, что правила позволяют нужные операции

### Не видно данных в Firestore
- Проверьте, что данные созданы в правильной коллекции
- Убедитесь, что Security Rules позволяют чтение

## 📞 Дополнительная помощь

Если проблемы остаются:
1. Проверьте консоль браузера (F12) для детальных ошибок
2. Проверьте логи Firebase в консоли
3. Убедитесь, что все сервисы Firebase включены

