'use client';

import { Order } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

interface OrderCardProps {
  order: Order;
  onStatusChange?: (orderId: string, newStatus: string) => void;
  onAssign?: (orderId: string) => void;
  showActions?: boolean;
}

export function OrderCard({ order, onStatusChange, onAssign, showActions = true }: OrderCardProps) {
  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy, HH:mm');
  };

  return (
    <Card className="mb-4 hover:shadow-soft-lg transition-all duration-300 border-l-4 border-l-primary-500">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold shadow-glow">
                #
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Заказ {order.id.slice(0, 8).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <Badge status={order.status} />
          </div>

          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Клиент</p>
                  <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Телефон</p>
                  <p className="text-sm font-semibold text-gray-900">{order.customerPhone}</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">Адрес доставки</p>
                  <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-2">Товары:</p>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{item.productName} × {item.quantity}</span>
                    <span className="font-semibold text-gray-900">{item.price * item.quantity} ₽</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Итого:</span>
                <span className="text-2xl font-bold gradient-text">{order.totalAmount} ₽</span>
              </div>
            </div>
          </div>
        </div>

        {showActions && (onStatusChange || onAssign) && (
          <div className="flex flex-col gap-3 md:w-56">
            {onAssign && (
              <button
                onClick={() => onAssign(order.id)}
                className="px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-glow transition-all font-semibold text-sm transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Назначить
                </span>
              </button>
            )}
            {onStatusChange && (
              <div className="relative">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium bg-white appearance-none cursor-pointer hover:border-primary-300 transition-all"
                >
                  <option value="new">Новый</option>
                  <option value="assigned_to_picker">Назначен сборщику</option>
                  <option value="picked">Собран</option>
                  <option value="assigned_to_courier">Назначен курьеру</option>
                  <option value="in_delivery">В доставке</option>
                  <option value="delivered">Доставлен</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

