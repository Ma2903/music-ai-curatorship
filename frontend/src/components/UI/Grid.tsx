// frontend/src/components/UI/Grid.tsx
import { ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({
  children,
  columns = 4,
  gap = 'md',
  className = '',
}: GridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const columnClasses = {
    2: 'grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
  };

  return (
    <div
      className={`grid ${columnClasses[columns as keyof typeof columnClasses]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
}

