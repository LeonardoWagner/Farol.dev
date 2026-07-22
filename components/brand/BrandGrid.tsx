import { cn } from '@/lib/utils';

/** Subtle technical grid texture — a quiet structural motif behind editorial sections. */
export function BrandGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 opacity-[0.06]', className)}
      style={{
        backgroundImage:
          'linear-gradient(to right, var(--color-white) 1px, transparent 1px), ' +
          'linear-gradient(to bottom, var(--color-white) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
      }}
    />
  );
}
