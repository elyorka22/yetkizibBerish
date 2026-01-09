'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <Card className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Заказ оформлен!</h1>
        <p className="text-gray-600 mb-8">
          Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.
        </p>
        <div className="space-y-3">
          <Link href="/shop">
            <Button variant="gradient" className="w-full">
              Продолжить покупки
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              На главную
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

