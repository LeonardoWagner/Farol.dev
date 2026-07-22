import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type Particle = { x: string; y: string; size: number; delayS: number };

// Fixed, hand-placed positions — not Math.random() per render. A handful of
// static dots read the same as a "generated" field at this low a count, with
// no risk of a random reseed ever changing them and no SSR/client mismatch
// to worry about.
const DEFAULT_PARTICLES: Particle[] = [
  { x: '12%', y: '30%', size: 3, delayS: 0 },
  { x: '28%', y: '68%', size: 2, delayS: 1.4 },
  { x: '52%', y: '18%', size: 2.5, delayS: 2.8 },
  { x: '74%', y: '55%', size: 3, delayS: 0.7 },
  { x: '88%', y: '22%', size: 2, delayS: 3.6 },
  { x: '64%', y: '82%', size: 2.5, delayS: 2.1 },
];

/** A few faint, slowly-pulsing dots — used sparingly (Process, Projects),
 * never as a dense field. */
export function LightParticles({
  color = 'rgba(255,255,255,0.5)',
  particles = DEFAULT_PARTICLES,
  className,
}: {
  color?: string;
  particles?: Particle[];
  className?: string;
}) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {particles.map((p, i) => {
        const style: CSSProperties & Record<'--base-opacity', number> = {
          left: p.x,
          top: p.y,
          width: p.size,
          height: p.size,
          background: color,
          animation: `ambient-pulse ${9 + p.delayS}s ease-in-out ${p.delayS}s infinite`,
          '--base-opacity': 0.7,
        };
        return <span key={i} className="absolute rounded-full" style={style} />;
      })}
    </div>
  );
}
