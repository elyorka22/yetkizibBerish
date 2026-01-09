import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Поддержка как отдельных переменных, так и одного JSON объекта
let firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
  // Если задана одна переменная с JSON конфигурацией
  try {
    firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
  } catch (error) {
    console.error('Ошибка парсинга NEXT_PUBLIC_FIREBASE_CONFIG:', error);
    firebaseConfig = {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    };
  }
} else {
  // Используем отдельные переменные (обратная совместимость)
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };
}

// Проверка конфигурации
const isConfigValid = () => {
  return !!(
    firebaseConfig &&
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId &&
    firebaseConfig.apiKey !== 'demo' &&
    firebaseConfig.projectId !== 'demo'
  );
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== 'undefined') {
  if (isConfigValid()) {
    try {
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }
      
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  } else {
    console.warn('Firebase не настроен. Пожалуйста, настройте переменные окружения в .env.local');
    console.warn('См. инструкцию: /setup-firebase или FIREBASE_SETUP.md');
  }
}

export { app, auth, db, storage, isConfigValid };

