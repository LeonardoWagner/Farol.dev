'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * Toggle for the beam's interactive-control mode. A real <button> (not a
 * decorative div) — keyboard-focusable, announces its pressed state, and
 * describes itself via `aria-describedby` rather than relying on a
 * hover-only visual tooltip (which touch users would never see).
 */
export function Moon({ active, onClick }: { active: boolean; onClick: () => void }) {
  const tooltipId = useId();

  return (
    <div className="group absolute top-[8%] right-[26%] z-10">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        aria-pressed={active}
        aria-describedby={tooltipId}
        aria-label={
          active ? 'Desativar controle da luz do farol' : 'Ativar controle da luz do farol'
        }
        className={cn(
          'relative block h-10 w-10 rounded-full',
          'transition-transform duration-300 hover:scale-110 focus-visible:scale-110',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--focus-ring)',
          'sm:h-12 sm:w-12',
        )}
      >
        {/* Glow halo — wider and stronger when active */}
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 rounded-full blur-md transition-all duration-500',
            active ? 'scale-[2.4] opacity-100' : 'scale-150 opacity-50 group-hover:opacity-80',
          )}
          style={{
            background: active
              ? 'radial-gradient(circle, rgba(201,214,255,0.55) 0%, rgba(138,92,255,0.3) 45%, transparent 75%)'
              : 'radial-gradient(circle, rgba(201,214,255,0.28) 0%, transparent 70%)',
          }}
        />
        {/* Moon disc */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full transition-shadow duration-500"
          style={{
            background: 'radial-gradient(circle at 34% 30%, #FFFFFF 0%, #DCE1EE 45%, #A6ACBE 100%)',
            boxShadow: active
              ? '0 0 0 2px rgba(255,255,255,0.55), 0 0 26px rgba(180,195,255,0.85)'
              : '0 0 12px rgba(190,200,255,0.4)',
          }}
        />
        {/* Subtle craters — kept low-contrast so it reads as a moon, not a face */}
        <span aria-hidden className="absolute top-[52%] left-[26%] h-[16%] w-[16%] rounded-full bg-black/10" />
        <span aria-hidden className="absolute top-[28%] left-[56%] h-[11%] w-[11%] rounded-full bg-black/10" />
      </button>

      {/* Tooltip/status — visible on hover or keyboard focus (CSS-only,
          `:focus-within` covers focusing the button itself), and always
          exposed to assistive tech via aria-describedby regardless of
          visibility, so touch/screen-reader users get the same information. */}
      <p
        id={tooltipId}
        role="status"
        className={cn(
          'pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[11px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100',
          active
            ? 'border-purple/40 bg-(--surface-raised) text-purple'
            : 'border-(--border-subtle) bg-(--surface-raised) text-(--text-secondary)',
        )}
      >
        {active ? 'Luz liberada — mova o cursor' : 'Controlar a luz'}
      </p>
    </div>
  );
}
