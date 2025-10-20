// frontend/src/components/UI/Button.tsx
'use client';

import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-green-500 hover:bg-green-400 text-black font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50',
  secondary:
    'bg-neutral-700 hover:bg-neutral-600 text-white font-semibold border border-neutral-600 hover:border-neutral-500',
  ghost:
    'bg-transparent hover:bg-white/10 text-white font-semibold border border-neutral-600 hover:border-neutral-400',
  danger:
    'bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-red-500/50',
  success:
    'bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/30 hover:shadow-green-600/50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'transition-all duration-300 ease-in-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const fullWidthClass = fullWidth ? 'w-full' : '';

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidthClass}
    ${className}
  `.trim();

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Carregando...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex items-center justify-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

