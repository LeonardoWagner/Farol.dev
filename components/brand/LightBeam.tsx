import { cn } from '@/lib/utils';

/**
 * Full-bleed CSS light-beam — the brand's signature motif (coral → lilás → azul
 * beam flaring from a point). Ported from the pre-migration FarolBeam. Used as
 * background texture in sections, and as the static hero fallback (no 3D/JS needed).
 */
export function LightBeam({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute top-[46%] left-[20%] h-[3px] w-[140%] -translate-y-1/2 -rotate-3 blur-[1.5px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--color-coral) 30%, var(--color-purple) 55%, var(--color-blue) 78%, transparent 100%)',
        }}
      />
      <div
        className="absolute top-[46%] left-[58%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[14px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,107,87,0.55) 0%, rgba(138,92,255,0.28) 42%, transparent 72%)',
        }}
      />
    </div>
  );
}
