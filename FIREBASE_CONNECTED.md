# ✅ Firebase подключен!

## 📋 Конфигурация обновлена

Ваша конфигурация Firebase успешно добавлена в `.env.local`:

- ✅ API Key: настроен
- ✅ Auth Domain: yetkazibberish-c5af5.firebaseapp.com
- ✅ Project ID: yetkazibberish-c5af5
- ✅ Storage Bucket: настроен
- ✅ Messaging Sender ID: настроен
- ✅ App ID: настроен

## 🔄 Следующие шаги

### 1. Перезапустите сервер (если еще не сделали)

```bash
# Остановите текущий сервер (Ctrl+C)
cd frontend
npm run dev
```

### 2. Включите сервисы Firebase

#### Authentication (Email/Password)
1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите проект `yetkazibberish-c5af5`
3. Перейдите в **Authentication** → **Sign-in method**
4. Включите **Email/Password**
5. Нажмите **Save**

#### Firestore Database
1. Перейдите в **Firestore Database**
2. Если база не создана, нажмите **Create database**
3. Выберите режим (Test mode для разработки)
4. Выберите регион
5. Нажмите **Enable**

### 3. Создайте первого пользователя

#### В Authentication:
1. Перейдите в **Authentication** → **Users**
2. Нажмите **Add user**
3. Email: `admin@demo.com`
4. Пароль: `admin123`
5. Нажмите **Add user**
6. **Скопируйте UID** (длинная строка)

#### В Firestore:
1. Перейдите в **Firestore Database**
2. Нажмите **Start collection**
3. Collection ID: `users`
4. Document ID: вставьте **UID** из Authentication
5. Добавьте поля:

| Field | Type | Value |
|-------|------|-------|
| email | string | admin@demo.com |
| name | string | Admin User |
| phone | string | +998901234567 |
| role | string | super_admin |
| createdAt | timestamp | (нажмите сейчас) |
| updatedAt | timestamp | (нажмите сейчас) |

6. Нажмите **Save**

### 4. Настройте Security Rules

#### Firestore Rules:
Перейдите в **Firestore Database** → **Rules** и вставьте:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        (request.auth.uid == userId || getUserRole() == 'super_admin');
    }
    
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create: if true;
      allow update: if isAuthenticated();
      allow delete: if false;
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if isAuthenticated() && 
        (getUserRole() == 'super_admin' || getUserRole() == 'manager');
    }
    
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAuthenticated() && 
        (getUserRole() == 'super_admin' || getUserRole() == 'manager');
    }
  }
}
```

Нажмите **Publish**.

## ✅ Проверка

После выполнения всех шагов:

1. Откройте http://localhost:3000/login
2. Войдите с `admin@demo.com` / `admin123`
3. Должен произойти редирект на `/dashboard`

## 🎉 Готово!

Теперь Firebase полностью подключен и готов к работе!

