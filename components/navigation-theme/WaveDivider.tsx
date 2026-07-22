import { cn } from '@/lib/utils';

/** A thin, discreet wave curve used as a section transition — the "ondas
 * abstratas" motif reused outside the hero, without repeating the hero's
 * full scene. Purely decorative. */
export function WaveDivider({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 24"
      preserveAspectRatio="none"
      className={cn('pointer-events-none h-6 w-full', flip && 'rotate-180', className)}
    >
      <path
        d="M0,14 Q75,4 150,14 T300,14 T450,14 T600,14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.25"
      />
    </svg>
  );
}
