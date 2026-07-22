import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <p className="mb-4 font-body text-xs font-semibold tracking-wide text-coral uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-display-s md:text-display-m font-display font-bold tracking-tight text-white">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-body-l leading-relaxed text-(--text-secondary)">{description}</p>
      ) : null}
    </div>
  );
}
