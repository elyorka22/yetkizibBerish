import { clsx } from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform active:scale-95',
        {
          'bg-gradient-primary text-white hover:shadow-glow focus:ring-primary-500':
            variant === 'primary' || variant === 'gradient',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500':
            variant === 'secondary',
          'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg focus:ring-red-500':
            variant === 'danger',
          'border-2 border-primary-500 text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-600 focus:ring-primary-500':
            variant === 'outline',
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
          'opacity-50 cursor-not-allowed transform-none': disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></span>
          Загрузка...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

