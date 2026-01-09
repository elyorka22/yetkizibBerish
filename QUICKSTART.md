# Быстрый старт

## Предварительные требования

- Node.js 18+ 
- npm или yarn
- Аккаунт Firebase
- Аккаунт Railway (для backend)
- Аккаунт Vercel (для frontend)

## Локальная разработка

### 1. Клонирование и установка

```bash
# Установка зависимостей для всего проекта
npm install

# Или отдельно для каждой части
cd frontend && npm install
cd ../backend && npm install
```

### 2. Настройка Firebase

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Включите Authentication (Email/Password)
3. Создайте Firestore Database
4. Включите Storage
5. Создайте Service Account (Project Settings > Service Accounts)

### 3. Настройка Frontend

Создайте `frontend/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Настройка Backend

Создайте `backend/.env`:

```env
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
NODE_ENV=development
```

**Важно**: При копировании приватного ключа из JSON файла, сохраните все символы `\n` как есть.

### 5. Запуск

```bash
# Терминал 1 - Backend
cd backend
npm run dev

# Терминал 2 - Frontend
cd frontend
npm run dev
```

Frontend будет доступен на http://localhost:3000
Backend будет доступен на http://localhost:3001

## Создание первого пользователя

### Вариант 1: Через Firebase Console

1. Перейдите в Firebase Console > Authentication
2. Добавьте пользователя вручную
3. Создайте запись в Firestore `users/{userId}`:

```json
{
  "email": "admin@example.com",
  "name": "Admin User",
  "phone": "+1234567890",
  "role": "super_admin",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Вариант 2: Через код (для разработки)

Можно создать скрипт для инициализации первого пользователя.

## Firestore Security Rules

Добавьте в Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || getUserRole() == 'super_admin');
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if false;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (getUserRole() == 'super_admin' || getUserRole() == 'manager');
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (getUserRole() == 'super_admin' || getUserRole() == 'manager');
    }
  }
}
```

## Тестирование

1. Откройте http://localhost:3000
2. Войдите с созданным пользователем
3. Проверьте, что dashboard загружается
4. Создайте тестовый заказ в Firestore для проверки

## Следующие шаги

- Настройте деплой на Vercel и Railway (см. DEPLOYMENT.md)
- Добавьте больше функций согласно ARCHITECTURE.md
- Настройте CI/CD для автоматического деплоя

