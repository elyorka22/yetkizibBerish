# Руководство по развертыванию

## Firebase Setup

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Включите следующие сервисы:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

3. Получите конфигурационные данные:
   - Перейдите в Project Settings > General
   - Скопируйте конфигурацию для веб-приложения

## Frontend (Vercel)

1. Установите зависимости:
```bash
cd frontend
npm install
```

2. Создайте файл `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

3. Разверните на Vercel:
   - Подключите репозиторий к Vercel
   - Укажите директорию `frontend`
   - Добавьте переменные окружения
   - Деплой автоматически запустится

## Backend (Railway)

1. Установите зависимости:
```bash
cd backend
npm install
```

2. Создайте Service Account в Firebase:
   - Перейдите в Project Settings > Service Accounts
   - Нажмите "Generate new private key"
   - Сохраните JSON файл

3. Создайте файл `.env` в Railway:
```
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
NODE_ENV=production
```

4. Разверните на Railway:
   - Создайте новый проект
   - Подключите репозиторий
   - Укажите директорию `backend`
   - Добавьте переменные окружения
   - Railway автоматически определит Node.js и запустит сборку

## Firestore Security Rules

Добавьте следующие правила безопасности в Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
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
      allow write: if request.auth != null;
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Создание первого пользователя

1. Используйте Firebase Console > Authentication для создания первого пользователя
2. Затем создайте запись в Firestore `users/{userId}`:
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

## Проверка работы

1. Откройте frontend URL
2. Войдите с созданным пользователем
3. Проверьте, что dashboard загружается
4. Проверьте, что backend API отвечает на `/health`

