import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'gradient' | 'glass';
}

export function Card({ children, className, onClick, variant = 'default' }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl p-4 md:p-6 transition-all duration-300',
        {
          'bg-white shadow-soft hover:shadow-soft-lg': variant === 'default',
          'bg-gradient-primary text-white shadow-glow hover:shadow-glow-lg': variant === 'gradient',
          'glass shadow-soft-lg': variant === 'glass',
          'cursor-pointer transform hover:scale-[1.02]': onClick,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

