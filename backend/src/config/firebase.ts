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
      throw new Error('Firebase Admin credentials are missing. Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    }

    // Обработка private key: заменяем \n на реальные переносы строк
    // Поддерживаем разные форматы: с \\n, с \n, или уже с переносами
    privateKey = privateKey
      .replace(/\\n/g, '\n')  // Заменяем \\n на \n
      .replace(/\\\\n/g, '\n') // Заменяем \\\\n на \n (если двойной экранирование)
      .trim(); // Убираем лишние пробелы

    // Проверяем, что ключ начинается правильно
    if (!privateKey.includes('BEGIN PRIVATE KEY') || !privateKey.includes('END PRIVATE KEY')) {
      console.error('FIREBASE_PRIVATE_KEY format is invalid. It should include BEGIN PRIVATE KEY and END PRIVATE KEY');
      throw new Error('Invalid FIREBASE_PRIVATE_KEY format. Make sure it includes -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----');
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

