/**
 * Static SVG rendition of the lighthouse + beam — no JS-driven motion beyond
 * the CSS-transitioned rotation used by the moon's interactive mode. Doubles
 * as: (1) the hero visual during the no-3D content pass, and (2) the
 * permanent fallback for prefers-reduced-motion, low-end devices, and no-WebGL.
 * Mirrors the 3D scene's layered beam (core/cone/halo) as three stacked
 * gradients rather than one flat shape. Water and boat live in the separate,
 * always-on SeaLayer (a flat CSS/SVG layer shared by both the 3D and
 * fallback paths), not here.
 */
export function HeroFallback({ rotation = 0 }: { rotation?: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
        role="img"
        aria-label="Ilustração de um farol projetando luz sobre o mar"
      >
        <defs>
          <linearGradient id="beamHaloGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8F73" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#8A5CFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4C6FFF" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="beamCoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD9C7" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#B18CFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4C6FFF" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="beamInnerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF8EE" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFB68F" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="lanternGlowWide" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB68F" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8A5CFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8EE" stopOpacity="1" />
            <stop offset="35%" stopColor="#FF6B57" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8A5CFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="towerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#525A70" />
            <stop offset="18%" stopColor="#2E3548" />
            <stop offset="100%" stopColor="#181C28" />
          </linearGradient>
          <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="mediumBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          {/* Static (non-animated) grain — the R3F beam gets its "dust in
              light" texture from a per-frame shader term; a fixed turbulence
              pattern gives the same suggestion of internal variation here
              without any per-frame cost. */}
          <filter id="beamGrain" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="7" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0" />
          </filter>
        </defs>

        {/* Beam — rotates around the lantern position when the moon's
            interactive mode sets a click target; eased by CSS, not JS. */}
        <g
          style={{
            transformOrigin: '760px 175px',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <polygon
            points="760,175 -160,600 300,700 760,175"
            fill="url(#beamHaloGradient)"
            filter="url(#softBlur)"
          />
          <polygon
            points="760,175 -40,545 250,660 760,175"
            fill="url(#beamCoreGradient)"
            filter="url(#mediumBlur)"
          />
          <polygon points="760,175 -40,545 250,660 760,175" fill="#ffffff" filter="url(#beamGrain)" opacity="0.5" />
          {/* Tight bright inner core, close to the lantern */}
          <polygon
            points="760,175 590,420 690,460 760,175"
            fill="url(#beamInnerGradient)"
            filter="url(#mediumBlur)"
          />
          {/* A few light motes inside the beam */}
          <circle cx="600" cy="330" r="3" fill="#FFE4D6" opacity="0.7" />
          <circle cx="500" cy="410" r="2.2" fill="#D8C9FF" opacity="0.6" />
          <circle cx="420" cy="470" r="2.6" fill="#FFE4D6" opacity="0.5" />
          <circle cx="330" cy="510" r="2" fill="#C7D4FF" opacity="0.55" />
        </g>

        {/* Lighthouse tower — gradient gives it a lit-left/dark-right volume */}
        <polygon points="733,520 787,520 778,205 742,205" fill="url(#towerGradient)" />
        {/* Rim highlight on the left edge, catching the beam's warmth */}
        <line x1="735" y1="510" x2="744" y2="210" stroke="#FF9E80" strokeWidth="1.5" opacity="0.35" />
        {/* Tonal band detail */}
        <rect x="737" y="345" width="46" height="14" fill="#5B6478" opacity="0.7" />
        {/* Thin lit trim between tower and lantern */}
        <rect x="738" y="198" width="44" height="4" rx="2" fill="#FF8F73" opacity="0.4" />
        {/* Lantern room */}
        <rect x="739" y="152" width="42" height="53" rx="3" fill="#232838" stroke="#525A6E" strokeWidth="1.5" />
        {/* Thin glowing frame at the top of the lantern glass */}
        <rect x="741" y="152" width="38" height="3" fill="#FFD9C7" opacity="0.7" />
        <polygon points="736,152 760,120 784,152" fill="#1B2030" stroke="#525A6E" strokeWidth="1.5" />
        {/* Glow — wide halo + bright core */}
        <circle cx="760" cy="178" r="80" fill="url(#lanternGlowWide)" />
        <circle cx="760" cy="178" r="46" fill="url(#lanternGlow)" />
        <circle cx="760" cy="178" r="9" fill="#FFF8EF" />
      </svg>
    </div>
  );
}
