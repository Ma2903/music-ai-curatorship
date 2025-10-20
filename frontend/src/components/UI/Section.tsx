// frontend/src/components/UI/Section.tsx
import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({
  title,
  subtitle,
  children,
  className = '',
}: SectionProps) {
  return (
    <section className={`mb-12 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        {subtitle && <p className="text-neutral-400 text-sm">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

