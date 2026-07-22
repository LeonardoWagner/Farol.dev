'use client';

import { Canvas } from '@react-three/fiber';
import { LighthouseModel } from './LighthouseModel';
import { LighthouseBase } from './LighthouseBase';
import { HeroParticles } from './HeroParticles';

/** Default export — required by next/dynamic. Kept in its own module (rather
 * than inline in LighthouseScene) so the whole three.js/R3F chunk only loads
 * once the capability gate in LighthouseScene decides to mount it.
 *
 * Water and boat live in SeaLayer.tsx (a flat 2D CSS/SVG layer) after the
 * geometric water displacement turned into a broken-looking mess at this
 * camera's near-grazing viewing angle. This canvas carries the tower, its
 * rock base, the beam, and the two atmospheric particle layers. */
export default function LighthouseCanvas({
  interactive,
  pointerXRef,
  onAngleChange,
}: {
  interactive?: boolean;
  pointerXRef?: React.RefObject<number>;
  onAngleChange?: (normalized: number) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0.6, 1.7, 9.5], fov: 32 }}
      onCreated={({ camera }) => camera.lookAt(0.7, 0.7, -0.5)}
      shadows={false}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.22} color="#4C6FFF" />
      <directionalLight position={[-3, 4, 2]} intensity={0.35} color="#8A5CFF" />
      <hemisphereLight args={['#2A3A6B', '#05060A', 0.3]} />
      <LighthouseBase />
      <HeroParticles />
      <LighthouseModel interactive={interactive} pointerXRef={pointerXRef} onAngleChange={onAngleChange} />
    </Canvas>
  );
}
