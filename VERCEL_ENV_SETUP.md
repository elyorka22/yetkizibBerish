# 🔧 Настройка переменных окружения в Vercel

## 🎯 Рекомендуемый способ: Одна JSON переменная

### Шаг 1: Подготовка JSON конфигурации

Создайте JSON объект с конфигурацией Firebase (в одну строку, без переносов):

```json
{"apiKey":"AIzaSyBdc-5mE9b1zy-pjSKfMCEnmyrWlfNOEtg","authDomain":"yetkazibberish-c5af5.firebaseapp.com","projectId":"yetkazibberish-c5af5","storageBucket":"yetkazibberish-c5af5.firebasestorage.app","messagingSenderId":"258709998480","appId":"1:258709998480:web:293cd08d2905ab90414115"}
```

### Шаг 2: Добавление в Vercel

1. Откройте ваш проект в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте переменные:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_FIREBASE_CONFIG` | `{"apiKey":"AIzaSyBdc-5mE9b1zy-pjSKfMCEnmyrWlfNOEtg","authDomain":"yetkazibberish-c5af5.firebaseapp.com","projectId":"yetkazibberish-c5af5","storageBucket":"yetkazibberish-c5af5.firebasestorage.app","messagingSenderId":"258709998480","appId":"1:258709998480:web:293cd08d2905ab90414115"}` |
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.railway.app` |

4. Выберите **Environment**: `Production`, `Preview`, `Development` (или все)
5. Нажмите **Save**

### Шаг 3: Перезапуск деплоя

После добавления переменных:
1. Перейдите в **Deployments**
2. Нажмите на последний деплой
3. Нажмите **Redeploy** (или просто запушьте новый коммит)

## 📋 Полный список переменных

### Обязательные:
- `NEXT_PUBLIC_FIREBASE_CONFIG` - JSON конфигурация Firebase (в одну строку)
- `NEXT_PUBLIC_API_URL` - URL вашего backend API (Railway)

### Пример полной конфигурации:

```
NEXT_PUBLIC_FIREBASE_CONFIG={"apiKey":"AIzaSyBdc-5mE9b1zy-pjSKfMCEnmyrWlfNOEtg","authDomain":"yetkazibberish-c5af5.firebaseapp.com","projectId":"yetkazibberish-c5af5","storageBucket":"yetkazibberish-c5af5.firebasestorage.app","messagingSenderId":"258709998480","appId":"1:258709998480:web:293cd08d2905ab90414115"}
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## 🔄 Альтернативный способ: Отдельные переменные

Если вы предпочитаете использовать отдельные переменные (для обратной совместимости):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBdc-5mE9b1zy-pjSKfMCEnmyrWlfNOEtg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yetkazibberish-c5af5.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yetkazibberish-c5af5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yetkazibberish-c5af5.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=258709998480
NEXT_PUBLIC_FIREBASE_APP_ID=1:258709998480:web:293cd08d2905ab90414115
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

**Примечание:** Код автоматически поддерживает оба варианта. Если задана `NEXT_PUBLIC_FIREBASE_CONFIG`, она будет использована. Иначе используются отдельные переменные.

## ✅ Проверка

После деплоя проверьте:
1. Откройте сайт
2. Откройте консоль браузера (F12)
3. Убедитесь, что нет ошибок Firebase
4. Попробуйте войти в систему

## 🐛 Решение проблем

### Ошибка: "Firebase не настроен"
- Проверьте, что переменная `NEXT_PUBLIC_FIREBASE_CONFIG` задана
- Убедитесь, что JSON валидный (можно проверить на jsonlint.com)
- Убедитесь, что JSON в одну строку без переносов

### Ошибка: "Invalid API key"
- Проверьте, что все значения в JSON правильные
- Убедитесь, что нет лишних пробелов или кавычек

### Переменные не применяются
- Перезапустите деплой в Vercel
- Убедитесь, что переменные заданы для правильного окружения (Production/Preview/Development)

