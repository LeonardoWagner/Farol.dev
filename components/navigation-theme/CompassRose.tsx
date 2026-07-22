import { cn } from '@/lib/utils';

/** Minimalist compass rose — a thin technical grafismo, not a dominant
 * illustration. Used sparingly (About, Process) as a nod to the
 * navigation/direction concept. */
export function CompassRose({ size = 120, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn('pointer-events-none opacity-[0.14]', className)}
      fill="none"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.4" />
      {/* Cardinal ticks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="4"
          x2="50"
          y2={deg % 90 === 0 ? '14' : '10'}
          stroke="currentColor"
          strokeWidth={deg % 90 === 0 ? 0.8 : 0.5}
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {/* Main N-S / E-W needle, diamond points */}
      <path d="M50,10 L54,50 L50,90 L46,50 Z" stroke="currentColor" strokeWidth="0.6" />
      <path d="M10,50 L50,54 L90,50 L50,46 Z" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
      <text x="50" y="24" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="monospace">
        N
      </text>
    </svg>
  );
}
