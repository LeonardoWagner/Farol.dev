import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function GlowCard({
  children,
  className,
  glow = 'none',
}: {
  children: ReactNode;
  className?: string;
  glow?: 'coral' | 'blue' | 'purple' | 'none';
}) {
  const glowClass =
    glow === 'coral'
      ? 'hover:shadow-glow-coral'
      : glow === 'blue'
        ? 'hover:shadow-glow-blue'
        : glow === 'purple'
          ? 'hover:shadow-glow-brand'
          : '';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-(--surface-card-border) bg-(--surface-card) p-6 shadow-md',
        'transition-shadow duration-[400ms] ease-[cubic-bezier(0,0,0.2,1)]',
        glowClass,
        className,
      )}
    >
      {/* Scan light — a soft diagonal sweep, hover-only (see globals.css'
          scan-light keyframe; not running at all until hovered). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:[animation:scan-light_1.1s_ease-out]"
      />
      {children}
    </div>
  );
}
