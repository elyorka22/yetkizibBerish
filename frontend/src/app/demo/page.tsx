'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const demoUsers = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    name: 'Супер Администратор',
    role: 'super_admin',
    color: 'bg-gradient-primary',
  },
  {
    email: 'manager@demo.com',
    password: 'manager123',
    name: 'Менеджер',
    role: 'manager',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  },
  {
    email: 'picker@demo.com',
    password: 'picker123',
    name: 'Сборщик',
    role: 'picker',
    color: 'bg-gradient-to-r from-green-500 to-emerald-500',
  },
  {
    email: 'courier@demo.com',
    password: 'courier123',
    name: 'Курьер',
    role: 'courier',
    color: 'bg-gradient-to-r from-orange-500 to-amber-500',
  },
];

export default function DemoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleQuickLogin = async (email: string, password: string) => {
    if (!auth) {
      setError('Firebase не настроен. Пожалуйста, настройте Firebase перед использованием.');
      return;
    }

    setLoading(email);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа. Убедитесь, что пользователь создан в Firebase.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Демо-пользователи</h1>
          <p className="text-gray-600">Выберите роль для быстрого входа</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm animate-slide-up">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoUsers.map((user) => (
            <Card
              key={user.email}
              variant="glass"
              className="hover:shadow-glow transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 ${user.color} rounded-2xl flex items-center justify-center shadow-glow`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{user.role.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                </div>
              </div>
              
              <Button
                variant="gradient"
                className="w-full"
                onClick={() => handleQuickLogin(user.email, user.password)}
                loading={loading === user.email}
                disabled={loading !== null}
              >
                {loading === user.email ? 'Вход...' : 'Быстрый вход'}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Card variant="glass" className="bg-yellow-50 border-yellow-200">
            <p className="text-sm text-gray-700">
              <strong>Примечание:</strong> Для работы демо-пользователей их нужно сначала создать в Firebase Console.
              <br />
              См. инструкции в файле <code className="bg-white px-2 py-1 rounded">scripts/create-demo-data.ts</code>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

