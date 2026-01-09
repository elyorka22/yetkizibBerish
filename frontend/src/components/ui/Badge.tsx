import { clsx } from 'clsx';
import { OrderStatus } from '@/types';

interface BadgeProps {
  status: OrderStatus | string;
  className?: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500 text-white shadow-lg shadow-blue-500/50',
  assigned_to_picker: 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50',
  picked: 'bg-green-500 text-white shadow-lg shadow-green-500/50',
  assigned_to_courier: 'bg-purple-500 text-white shadow-lg shadow-purple-500/50',
  in_delivery: 'bg-orange-500 text-white shadow-lg shadow-orange-500/50',
  delivered: 'bg-gray-600 text-white shadow-lg shadow-gray-600/50',
};

const statusLabels: Record<string, string> = {
  new: 'Новый',
  assigned_to_picker: 'Назначен сборщику',
  picked: 'Собран',
  assigned_to_courier: 'Назначен курьеру',
  in_delivery: 'В доставке',
  delivered: 'Доставлен',
};

const statusIcons: Record<string, string> = {
  new: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
  assigned_to_picker: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  picked: 'M5 13l4 4L19 7',
  assigned_to_courier: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  in_delivery: 'M13 10V3L4 14h7v7l9-11h-7z',
  delivered: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
};

export function Badge({ status, className }: BadgeProps) {
  const iconPath = statusIcons[status];
  
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide',
        statusColors[status] || 'bg-gray-500 text-white shadow-lg',
        'transform transition-all hover:scale-105',
        className
      )}
    >
      {iconPath && (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={iconPath} />
        </svg>
      )}
      {statusLabels[status] || status}
    </span>
  );
}

