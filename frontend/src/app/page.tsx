'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && user) {
      // Если пользователь авторизован, редиректим на соответствующую страницу
      switch (user.role) {
        case UserRole.SUPER_ADMIN:
        case UserRole.MANAGER:
          router.push('/dashboard');
          break;
        case UserRole.PICKER:
          router.push('/picker');
          break;
        case UserRole.COURIER:
          router.push('/courier');
          break;
        default:
          // Для неавторизованных или неизвестных ролей остаемся на главной
          break;
      }
    }
  }, [user, loading, router]);

  // Показываем главную страницу для неавторизованных пользователей
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          
          <header className="glass border-b border-white/20 backdrop-blur-xl relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold gradient-text">YetkazibBeish</h1>
                </div>
                <div className="flex items-center gap-4">
                  <Link href="/login">
                    <Button variant="outline">Войти</Button>
                  </Link>
                  <Link href="/shop">
                    <Button variant="gradient">Каталог</Button>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h2 className="text-5xl md:text-6xl font-bold gradient-text mb-6 animate-fade-in">
                Быстрая доставка
                <br />
                прямо к вашей двери
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Заказывайте любимые товары с доставкой. Без регистрации или с личным кабинетом.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                    Перейти к каталогу
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Войти в систему
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Показываем загрузку для авторизованных пользователей во время редиректа
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Загрузка...</p>
      </div>
    </div>
  );
}

