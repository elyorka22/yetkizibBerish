'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'Супер Администратор',
      [UserRole.MANAGER]: 'Менеджер',
      [UserRole.PICKER]: 'Сборщик',
      [UserRole.COURIER]: 'Курьер',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'bg-gradient-primary',
      [UserRole.MANAGER]: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      [UserRole.PICKER]: 'bg-gradient-to-r from-green-500 to-emerald-500',
      [UserRole.COURIER]: 'bg-gradient-to-r from-orange-500 to-amber-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="glass border-b border-white/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${getRoleColor(user?.role || UserRole.MANAGER)} rounded-xl flex items-center justify-center shadow-glow`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">YetkazibBeish</h1>
                {user && (
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
                    {getRoleLabel(user.role)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/50 rounded-xl border border-white/20">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

