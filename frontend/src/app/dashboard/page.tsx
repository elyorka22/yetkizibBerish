'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrderCard } from '@/components/orders/OrderCard';
import { orderService } from '@/services/firestore';
import { Order, OrderStatus, UserRole } from '@/types';
import { canPerformAction } from '@/lib/rbac';
import { orderApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && !canPerformAction(user.role, 'canViewAllOrders')) {
      router.push('/');
      return;
    }

    const unsubscribe = orderService.subscribe((updatedOrders) => {
      setOrders(updatedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Ошибка обновления статуса заказа');
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const stats = {
    new: orders.filter(o => o.status === OrderStatus.NEW).length,
    inProgress: orders.filter(o => 
      [OrderStatus.ASSIGNED_TO_PICKER, OrderStatus.PICKED, OrderStatus.ASSIGNED_TO_COURIER, OrderStatus.IN_DELIVERY].includes(o.status)
    ).length,
    delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Панель управления</h2>
          {canPerformAction(user!.role, 'canManageProducts') && (
            <a href="/admin/demo-data">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Создать демо-данные
              </Button>
            </a>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-glow transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Новые заказы</p>
                <p className="text-4xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </Card>
          <Card className="border-l-4 border-l-orange-500 hover:shadow-glow transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">В работе</p>
                <p className="text-4xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
          <Card className="border-l-4 border-l-green-500 hover:shadow-glow transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Доставлено</p>
                <p className="text-4xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <div className="relative inline-block">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as OrderStatus | 'all')}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white font-medium text-gray-700 appearance-none cursor-pointer hover:border-primary-300 transition-all pr-10"
            >
              <option value="all">Все заказы</option>
              <option value={OrderStatus.NEW}>Новые</option>
              <option value={OrderStatus.ASSIGNED_TO_PICKER}>Назначены сборщику</option>
              <option value={OrderStatus.PICKED}>Собраны</option>
              <option value={OrderStatus.ASSIGNED_TO_COURIER}>Назначены курьеру</option>
              <option value={OrderStatus.IN_DELIVERY}>В доставке</option>
              <option value={OrderStatus.DELIVERED}>Доставлены</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        {filteredOrders.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">Заказов не найдено</p>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              showActions={canPerformAction(user!.role, 'canChangeOrderStatus')}
            />
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

