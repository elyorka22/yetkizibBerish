import * as admin from 'firebase-admin';

let initialized = false;
let dbInstance: admin.firestore.Firestore | null = null;
let authInstance: admin.auth.Auth | null = null;

export function initializeFirebaseAdmin() {
  if (initialized) {
    return;
  }

  if (!admin.apps.length) {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
      console.error('Firebase Admin credentials are missing. Please check environment variables.');
      console.error('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'SET' : 'MISSING');
      console.error('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'MISSING');
      console.error('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'SET' : 'MISSING');
      throw new Error('Firebase Admin credentials are missing. Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    }

    // Логируем первые и последние символы для отладки (без полного ключа)
    console.log('FIREBASE_PRIVATE_KEY length:', privateKey.length);
    console.log('FIREBASE_PRIVATE_KEY starts with:', privateKey.substring(0, 50));
    console.log('FIREBASE_PRIVATE_KEY ends with:', privateKey.substring(Math.max(0, privateKey.length - 50)));
    
    // Проверяем длину ключа - должен быть около 1600-1700 символов
    if (privateKey.length < 500) {
      console.error('⚠️ FIREBASE_PRIVATE_KEY is too short!');
      console.error('Expected length: ~1600-1700 characters');
      console.error('Actual length:', privateKey.length);
      console.error('The key appears to be truncated or copied incorrectly.');
      console.error('Please copy the ENTIRE private_key value from the JSON file.');
      throw new Error(`FIREBASE_PRIVATE_KEY is too short (${privateKey.length} chars, expected ~1600-1700). The key appears to be truncated. Please copy the ENTIRE private_key value from the JSON file.`);
    }

    // Обработка private key: пробуем разные варианты
    // Вариант 1: Если ключ уже содержит реальные переносы строк
    if (privateKey.includes('\n') && !privateKey.includes('\\n')) {
      // Уже правильный формат
      console.log('Using private key with real newlines');
    } else {
      // Вариант 2: Заменяем \\n на реальные переносы строк
      privateKey = privateKey.replace(/\\n/g, '\n');
      console.log('Replaced \\n with real newlines');
    }

    // Убираем лишние пробелы в начале и конце
    privateKey = privateKey.trim();

    // Убираем возможные кавычки в начале и конце
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || 
        (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
      console.log('Removed surrounding quotes');
    }

    // Проверяем, что ключ начинается правильно
    if (!privateKey.includes('BEGIN PRIVATE KEY') || !privateKey.includes('END PRIVATE KEY')) {
      console.error('FIREBASE_PRIVATE_KEY format is invalid.');
      console.error('Key should start with: -----BEGIN PRIVATE KEY-----');
      console.error('Key should end with: -----END PRIVATE KEY-----');
      console.error('Actual start:', privateKey.substring(0, 50));
      console.error('Actual end:', privateKey.substring(Math.max(0, privateKey.length - 50)));
      throw new Error('Invalid FIREBASE_PRIVATE_KEY format. Make sure it includes -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----');
    }

    // Проверяем, что ключ содержит правильные маркеры
    if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
      console.error('FIREBASE_PRIVATE_KEY does not start with -----BEGIN PRIVATE KEY-----');
      console.error('Actual start:', privateKey.substring(0, 50));
    }
    if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
      console.error('FIREBASE_PRIVATE_KEY does not end with -----END PRIVATE KEY-----');
      console.error('Actual end:', privateKey.substring(Math.max(0, privateKey.length - 50)));
    }

    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('Firebase Admin initialized successfully');
      
      // Инициализируем экземпляры после успешной инициализации
      dbInstance = admin.firestore();
      authInstance = admin.auth();
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  } else {
    // Если приложение уже инициализировано, получаем экземпляры
    dbInstance = admin.firestore();
    authInstance = admin.auth();
  }

  initialized = true;
}

// Экспортируем функции-геттеры вместо прямых экземпляров
export function getDb(): admin.firestore.Firestore {
  if (!dbInstance) {
    throw new Error('Firebase Admin not initialized. Call initializeFirebaseAdmin() first.');
  }
  return dbInstance;
}

export function getAuth(): admin.auth.Auth {
  if (!authInstance) {
    throw new Error('Firebase Admin not initialized. Call initializeFirebaseAdmin() first.');
  }
  return authInstance;
}

// Для обратной совместимости экспортируем как свойства (lazy getters)
export const db = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop) {
    return getDb()[prop as keyof admin.firestore.Firestore];
  }
}) as admin.firestore.Firestore;

export const auth = new Proxy({} as admin.auth.Auth, {
  get(target, prop) {
    return getAuth()[prop as keyof admin.auth.Auth];
  }
}) as admin.auth.Auth;

