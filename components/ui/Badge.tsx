import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const colors = {
  neutral: 'bg-(--surface-raised) text-(--text-secondary) border-(--border-subtle)',
  coral: 'bg-coral/15 text-coral border-coral/30',
  blue: 'bg-blue/15 text-blue border-blue/30',
  purple: 'bg-purple/15 text-purple border-purple/30',
  teal: 'bg-teal/15 text-teal border-teal/30',
} as const;

export function Badge({
  children,
  color = 'neutral',
  className,
}: {
  children: ReactNode;
  color?: keyof typeof colors;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-body text-xs font-semibold',
        colors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
