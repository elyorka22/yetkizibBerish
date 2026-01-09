'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SetupFirebasePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="max-w-2xl w-full">
        <Card className="mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Настройка Firebase</h1>
            <p className="text-gray-600">Следуйте инструкциям для подключения Firebase</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Быстрая инструкция:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Создайте проект в <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Firebase Console</a></li>
                <li>Включите Authentication (Email/Password)</li>
                <li>Создайте Firestore Database</li>
                <li>Скопируйте конфигурацию из Project Settings</li>
                <li>Вставьте в файл <code className="bg-white px-2 py-1 rounded">frontend/.env.local</code></li>
                <li>Перезапустите сервер разработки</li>
              </ol>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Важно:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                <li>Все переменные должны начинаться с <code className="bg-white px-1 py-0.5 rounded">NEXT_PUBLIC_</code></li>
                <li>После изменения .env.local нужно перезапустить сервер</li>
                <li>Создайте первого пользователя в Firebase Console</li>
                <li>Создайте запись в Firestore коллекции <code className="bg-white px-1 py-0.5 rounded">users</code></li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <h3 className="font-semibold text-green-900 mb-2">✅ Пример .env.local:</h3>
              <pre className="bg-white p-3 rounded-lg text-xs overflow-x-auto">
{`NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_API_URL=http://localhost:3001`}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="gradient" className="w-full">
                  Открыть Firebase Console
                </Button>
              </a>
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Вернуться к входу
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Подробная инструкция в файле <code className="bg-gray-100 px-2 py-1 rounded">FIREBASE_SETUP.md</code></p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

