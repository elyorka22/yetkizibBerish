'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrderCard } from '@/components/orders/OrderCard';
import { orderService } from '@/services/firestore';
import { Order, OrderStatus, UserRole } from '@/types';
import { where } from 'firebase/firestore';
import { orderApi } from '@/lib/api';

export default function PickerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role !== UserRole.PICKER) {
      router.push('/');
      return;
    }

    if (user) {
      const unsubscribe = orderService.subscribe(
        (updatedOrders) => {
          const myOrders = updatedOrders.filter(
            order => order.pickerId === user.id
          );
          setOrders(myOrders);
          setLoading(false);
        },
        [where('pickerId', '==', user.id)]
      );

      return () => unsubscribe();
    }
  }, [user, authLoading, router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (newStatus !== OrderStatus.PICKED) return;

    try {
      await orderApi.updateStatus(orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Ошибка обновления статуса заказа');
    }
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

  const activeOrders = orders.filter(
    order => order.status === OrderStatus.ASSIGNED_TO_PICKER
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Мои заказы</h2>
        <p className="text-gray-600 mb-4">
          Активных заказов: {activeOrders.length}
        </p>
      </div>

      <div>
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-soft p-8 text-center">
            <p className="text-gray-500">У вас нет назначенных заказов</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              showActions={order.status === OrderStatus.ASSIGNED_TO_PICKER}
            />
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

