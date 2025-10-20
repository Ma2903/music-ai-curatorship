// frontend/src/components/UI/Button.tsx
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  const variantClasses = {
    primary:
      'bg-green-500 text-black hover:bg-green-400 disabled:bg-neutral-600 disabled:text-neutral-400',
    secondary:
      'bg-neutral-700 text-white hover:bg-neutral-600 disabled:bg-neutral-800 disabled:text-neutral-500',
    ghost:
      'border border-neutral-400 text-neutral-400 hover:border-white hover:text-white disabled:border-neutral-600 disabled:text-neutral-600',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold rounded-lg transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}

