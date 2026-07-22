import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

const colors = {
  coral: 'rgba(255,107,87,0.35)',
  blue: 'rgba(76,111,255,0.35)',
  purple: 'rgba(138,92,255,0.3)',
  teal: 'rgba(62,216,182,0.3)',
} as const;

/** Positioned radial glow blob — a small reusable accent, used standalone
 * (e.g. via a static `className`) and as the building block for
 * components/lighting/SectionLighting's per-section presets (via `x`/`y`).
 *
 * Two things CSS animations force a specific structure for here:
 * - `x`/`y` are the glow's *center point*; a plain resting `translate(-50%,
 *   -50%)` would get clobbered the instant the drift animation starts (an
 *   animated `transform` overrides the whole property while running), so
 *   the centering is baked into every `ambient-drift` keyframe step instead.
 * - The pulse can't just animate `opacity` to hardcoded values either, or
 *   every glow would breathe to the same brightness regardless of its own
 *   configured intensity — `ambient-pulse` reads `--base-opacity`, set here
 *   per instance, and scales relative to it. */
export function BrandGlow({
  color = 'purple',
  className,
  size = 480,
  opacity = 1,
  blur = 80,
  x,
  y,
  durationS,
  delayS = 0,
  paused = false,
}: {
  color?: keyof typeof colors;
  className?: string;
  size?: number;
  /** Overrides the color preset's own alpha, when a preset needs a specific intensity. */
  opacity?: number;
  blur?: number;
  x?: string;
  y?: string;
  /** Set to enable the slow drift+breathe animation; omit for a static glow. */
  durationS?: number;
  delayS?: number;
  /** Set true to freeze the animation (e.g. section scrolled out of view). */
  paused?: boolean;
}) {
  const animated = typeof durationS === 'number';
  const hasPosition = x !== undefined && y !== undefined;

  const style: CSSProperties & Record<'--base-opacity', number> = {
    left: hasPosition ? x : undefined,
    top: hasPosition ? y : undefined,
    transform: hasPosition && !animated ? 'translate(-50%, -50%)' : undefined,
    width: size,
    height: size,
    opacity: animated ? undefined : opacity,
    '--base-opacity': opacity,
    filter: `blur(${blur}px)`,
    background: `radial-gradient(circle, ${colors[color]} 0%, transparent 70%)`,
    animation: animated
      ? `ambient-drift ${durationS}s ease-in-out ${delayS}s infinite alternate, ambient-pulse ${durationS! * 1.6}s ease-in-out ${delayS}s infinite`
      : undefined,
    animationPlayState: animated ? (paused ? 'paused' : 'running') : undefined,
  };

  return (
    <div aria-hidden className={cn('pointer-events-none absolute rounded-full', className)} style={style} />
  );
}
