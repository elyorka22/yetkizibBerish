# 🔑 Как получить FIREBASE_PRIVATE_KEY

## 📋 Пошаговая инструкция

### Шаг 1: Откройте Firebase Console

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект: **yetkazibberish-c5af5**

### Шаг 2: Перейдите в Service Accounts

1. Нажмите на **шестеренку** (⚙️) в левом верхнем углу
2. Выберите **Project Settings** (Настройки проекта)
3. Перейдите на вкладку **Service Accounts** (Учетные записи служб)

### Шаг 3: Создайте Service Account (если еще не создан)

1. Если Service Account уже есть - переходите к шагу 4
2. Если нет - нажмите **"Generate new private key"** (Создать новый закрытый ключ)
3. Появится предупреждение - нажмите **"Generate key"** (Создать ключ)

### Шаг 4: Скачайте JSON файл

1. После нажатия **"Generate new private key"** автоматически скачается JSON файл
2. Файл будет называться примерно так: `yetkazibberish-c5af5-firebase-adminsdk-xxxxx-xxxxx.json`
3. **Сохраните этот файл в безопасном месте!** Он содержит секретные ключи.

### Шаг 5: Откройте JSON файл

Откройте скачанный JSON файл в текстовом редакторе. Он будет выглядеть примерно так:

```json
{
  "type": "service_account",
  "project_id": "yetkazibberish-c5af5",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@yetkazibberish-c5af5.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### Шаг 6: Извлеките значения для Railway

Из JSON файла вам нужны **3 значения**:

#### 1. FIREBASE_PROJECT_ID
```json
"project_id": "yetkazibberish-c5af5"
```
→ Используйте: `yetkazibberish-c5af5`

#### 2. FIREBASE_CLIENT_EMAIL
```json
"client_email": "firebase-adminsdk-xxxxx@yetkazibberish-c5af5.iam.gserviceaccount.com"
```
→ Используйте: `firebase-adminsdk-xxxxx@yetkazibberish-c5af5.iam.gserviceaccount.com`

#### 3. FIREBASE_PRIVATE_KEY
```json
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**ВАЖНО:** 
- Скопируйте **ВСЮ** строку `private_key`, включая `-----BEGIN PRIVATE KEY-----` и `-----END PRIVATE KEY-----`
- В JSON файле ключ уже содержит `\n` (символы новой строки)
- При копировании в Railway эти `\n` должны остаться

### Шаг 7: Добавьте в Railway

1. Откройте [Railway Dashboard](https://railway.app/dashboard)
2. Выберите ваш проект
3. Перейдите в **Variables** (Переменные)
4. Добавьте переменные:

| Имя переменной | Значение |
|----------------|----------|
| `FIREBASE_PROJECT_ID` | `yetkazibberish-c5af5` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-xxxxx@yetkazibberish-c5af5.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n` |

**⚠️ ВАЖНО для FIREBASE_PRIVATE_KEY:**

1. Скопируйте значение `private_key` из JSON файла
2. **УДАЛИТЕ** внешние кавычки `"` (Railway добавит свои)
3. **ОСТАВЬТЕ** `\n` как есть (не заменяйте на реальные переносы строк)
4. Вставьте в Railway в **одну строку**

**Пример правильного формата:**
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```

**НЕ добавляйте кавычки в Railway!** Railway сам обработает строку.

📖 **Подробная инструкция по исправлению ошибок:** См. [RAILWAY_PRIVATE_KEY_FIX.md](./RAILWAY_PRIVATE_KEY_FIX.md)

### Пример правильного формата FIREBASE_PRIVATE_KEY:

```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```

## 🔍 Проверка

После добавления переменных в Railway:
1. Перезапустите деплой
2. Проверьте логи - должно быть: `Firebase Admin initialized successfully`
3. Проверьте health endpoint: `https://your-api.railway.app/health`

## 🛡️ Безопасность

- **НЕ** коммитьте JSON файл в Git
- **НЕ** публикуйте `private_key` в открытых местах
- Храните JSON файл в безопасном месте
- Если ключ скомпрометирован - создайте новый в Firebase Console

## 📝 Быстрая ссылка

**Прямая ссылка на Service Accounts вашего проекта:**
https://console.firebase.google.com/project/yetkazibberish-c5af5/settings/serviceaccounts/adminsdk

