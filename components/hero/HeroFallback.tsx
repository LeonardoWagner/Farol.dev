/**
 * Static SVG rendition of the lighthouse + beam — no JS-driven motion beyond
 * the CSS-transitioned rotation used by the moon's interactive mode. Doubles
 * as: (1) the hero visual during the no-3D content pass, and (2) the
 * permanent fallback for prefers-reduced-motion, low-end devices, and no-WebGL
 * — which in practice means most mobile visitors (the 3D canvas is gated off
 * under 768px), so this silhouette gets the same architectural read as the
 * 3D model: banded tower, gallery ledge, railing, lantern-room mullions, a
 * short faceted roof, and an asymmetric rocky base with a small keeper's
 * house — not a single tapered column with a big halo, which is what this
 * used to be. Mirrors the 3D scene's layered beam (core/cone/halo) as three
 * stacked gradients rather than one flat shape. Water and boat live in the
 * separate, always-on SeaLayer (a flat CSS/SVG layer shared by both the 3D
 * and fallback paths), not here.
 */

const LANTERN_X = 760;
const LANTERN_Y = 219;

export function HeroFallback({ rotation = 0 }: { rotation?: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        viewBox="0 0 1000 700"
        // xMax (not xMid): on narrow mobile viewports "cover" scaling has to
        // crop width to fill the container, and centering that crop around
        // the viewBox's horizontal midpoint cut the lighthouse — which is
        // deliberately composed on the right side of the scene — almost
        // entirely out of frame. Right-aligning the crop keeps it in view.
        // No effect at wider aspect ratios, where the full width already
        // fits with no horizontal cropping.
        preserveAspectRatio="xMaxYMax slice"
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
            <stop offset="0%" stopColor="#FFB68F" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8A5CFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8EE" stopOpacity="1" />
            <stop offset="35%" stopColor="#FF6B57" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8A5CFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="towerCreamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F1ECDF" />
            <stop offset="20%" stopColor="#E4DECF" />
            <stop offset="100%" stopColor="#B9B29C" />
          </linearGradient>
          <linearGradient id="towerNavyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3A4568" />
            <stop offset="20%" stopColor="#242E4C" />
            <stop offset="100%" stopColor="#141A2C" />
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
            transformOrigin: `${LANTERN_X}px ${LANTERN_Y}px`,
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <polygon
            points={`${LANTERN_X},${LANTERN_Y} -160,600 300,700 ${LANTERN_X},${LANTERN_Y}`}
            fill="url(#beamHaloGradient)"
            filter="url(#softBlur)"
          />
          <polygon
            points={`${LANTERN_X},${LANTERN_Y} -40,545 250,660 ${LANTERN_X},${LANTERN_Y}`}
            fill="url(#beamCoreGradient)"
            filter="url(#mediumBlur)"
          />
          <polygon
            points={`${LANTERN_X},${LANTERN_Y} -40,545 250,660 ${LANTERN_X},${LANTERN_Y}`}
            fill="#ffffff"
            filter="url(#beamGrain)"
            opacity="0.5"
          />
          {/* Tight bright inner core, close to the lantern */}
          <polygon
            points={`${LANTERN_X},${LANTERN_Y} 590,440 690,475 ${LANTERN_X},${LANTERN_Y}`}
            fill="url(#beamInnerGradient)"
            filter="url(#mediumBlur)"
          />
          {/* A few light motes inside the beam */}
          <circle cx="600" cy="350" r="3" fill="#FFE4D6" opacity="0.7" />
          <circle cx="500" cy="425" r="2.2" fill="#D8C9FF" opacity="0.6" />
          <circle cx="420" cy="480" r="2.6" fill="#FFE4D6" opacity="0.5" />
          <circle cx="330" cy="515" r="2" fill="#C7D4FF" opacity="0.55" />
        </g>

        {/* --- Base: irregular, asymmetric rocks (not two mirrored round
            masses) plus a small keeper's house offset to one side — the
            tower stands on a shoreline, not in open water. --- */}
        <path
          d="M638,524 L664,494 L692,504 L700,478 L722,498 L742,506 L742,524 Z"
          fill="#1C2233"
        />
        <path d="M742,524 L744,502 L784,494 L820,508 L836,500 L858,524 Z" fill="#20263A" />
        <path d="M770,524 L788,512 L808,518 L806,524 Z" fill="#171C2C" opacity="0.85" />
        {/* Keeper's house — small volume to the left of the tower base */}
        <rect x="656" y="472" width="52" height="34" fill="url(#towerCreamGradient)" />
        <polygon points="650,472 682,450 714,472" fill="#232A3B" />
        <rect x="676" y="486" width="9" height="18" fill="#171B26" />
        <rect x="692" y="480" width="7" height="7" fill="#FFD9C7" opacity="0.85" />
        {/* Contact shadow — an ellipse, offset, not centered under the tower */}
        <ellipse cx="742" cy="527" rx="120" ry="10" fill="#04070d" opacity="0.4" />

        {/* --- Tower body: three banded segments (cream / navy / cream)
            instead of one long tapered shape, shorter and noticeably wider
            than before. --- */}
        {/* Segment A — base, cream */}
        <polygon points="721,506 799,506 795,402 725,402" fill="url(#towerCreamGradient)" />
        <rect x="726" y="452" width="10" height="22" fill="#171B26" />
        {/* Ring 1 */}
        <rect x="723" y="394" width="74" height="8" fill="#141A2C" />
        {/* Segment B — mid, navy */}
        <polygon points="725,394 795,394 790,314 730,314" fill="url(#towerNavyGradient)" />
        <rect x="782" y="348" width="7" height="9" fill="#FFD9C7" opacity="0.75" />
        {/* Ring 2 — lit trim */}
        <rect x="728" y="306" width="64" height="8" fill="#3A2A24" opacity="0.9" />
        <rect x="728" y="306" width="64" height="3" fill="#FF8F73" opacity="0.55" />
        {/* Segment C — upper, cream */}
        <polygon points="730,306 790,306 786,260 734,260" fill="url(#towerCreamGradient)" />

        {/* --- Gallery / varanda: a ledge much wider than the tower — the
            main silhouette break between the tower body and the lantern
            room. --- */}
        <rect x="692" y="255" width="136" height="10" rx="2" fill="#20263A" />
        {/* Guard-rail posts */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = 700 + i * 15;
          return <rect key={i} x={x} y="242" width="2.5" height="13" fill="#12151F" />;
        })}
        <rect x="698" y="240" width="124" height="3" fill="#12151F" />

        {/* --- Lantern room: mullions over a warm "lit glass" body so it
            reads as windows, not a solid drum. --- */}
        <rect x="731" y="194" width="58" height="50" fill="#FFE0C9" opacity="0.9" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={731 + i * 14.5} y="194" width="3" height="50" fill="#12151F" />
        ))}
        <rect x="729" y="192" width="62" height="4" fill="#FFD9C7" opacity="0.8" />
        <rect x="729" y="242" width="62" height="4" fill="#12151F" />

        {/* --- Roof: short, faceted, with a ridge line and a small finial —
            not a tall obelisk point or an oval dome. --- */}
        <polygon points="725,194 760,156 795,194" fill="#181E2C" stroke="#0E1220" strokeWidth="1.5" />
        <line x1="760" y1="156" x2="760" y2="194" stroke="#0E1220" strokeWidth="1" opacity="0.5" />
        <line x1="760" y1="156" x2="760" y2="146" stroke="#3A2A24" strokeWidth="2" />
        <circle cx="760" cy="143" r="3.5" fill="#FFD9C7" opacity="0.9" />

        {/* Glow — controlled halo sized to the lantern room, not the whole
            tower top */}
        <circle cx={LANTERN_X} cy={LANTERN_Y} r="34" fill="url(#lanternGlowWide)" />
        <circle cx={LANTERN_X} cy={LANTERN_Y} r="20" fill="url(#lanternGlow)" />
        <circle cx={LANTERN_X} cy={LANTERN_Y} r="7" fill="#FFF8EF" />
      </svg>
    </div>
  );
}
