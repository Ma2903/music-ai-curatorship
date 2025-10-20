// frontend/src/components/UI/Header.tsx
import { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function Header({
  title,
  subtitle,
  action,
  className = '',
}: HeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-neutral-400 text-sm sm:text-base">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

