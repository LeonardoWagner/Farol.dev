// Single source of truth for motion timing, consumed by GSAP and Framer Motion.
// CSS-only hover transitions use the plain --duration-*/--ease-* vars in globals.css instead —
// those two systems don't share a format, so we don't try to unify them here.

export const DURATION = {
  fast: 0.12,
  normal: 0.2,
  slow: 0.4,
  reveal: 0.7,
} as const;

// cubic-bezier equivalents of --ease-standard / --ease-out from globals.css
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;
export const EASE_OUT = [0, 0, 0.2, 1] as const;

// GSAP accepts named/string eases; these read the same curves as the Framer arrays above.
export const GSAP_EASE_STANDARD = 'cubic-bezier(0.4, 0, 0.2, 1)';
export const GSAP_EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
