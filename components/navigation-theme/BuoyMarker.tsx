import { cn } from '@/lib/utils';

/** A small stylized navigation buoy — used as a light accent icon (e.g. next
 * to a heading), not as a replacement for numbered markers that already
 * carry their own meaning/animation elsewhere. */
export function BuoyMarker({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn('shrink-0', className)}
      fill="none"
    >
      <path d="M12 2 L15 8 L9 8 Z" fill="currentColor" opacity="0.9" />
      <rect x="10.5" y="8" width="3" height="9" rx="1" fill="currentColor" opacity="0.85" />
      <ellipse cx="12" cy="19" rx="6" ry="1.6" fill="currentColor" opacity="0.25" />
      <circle cx="12" cy="4.2" r="1.1" fill="currentColor" />
    </svg>
  );
}
