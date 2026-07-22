'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

const LIGHTHOUSE_X = 1.7;
const LIGHTHOUSE_Z = -1;
const WATER_Y = -0.6;

type RockSpec = {
  x: number;
  z: number;
  y: number;
  scale: [number, number, number];
  rotation: [number, number, number];
  color: string;
};

// Fixed, hand-placed rocks — not procedurally scattered per render. A small
// cluster of low-poly (icosahedron, detail 0 — naturally faceted, no extra
// geometry cost) chunks around the tower's base, breaking up the "tower
// standing directly in flat water" look without modeling a real island.
const ROCKS: RockSpec[] = [
  { x: -0.32, z: 0.18, y: WATER_Y - 0.08, scale: [0.42, 0.26, 0.38], rotation: [0.2, 0.6, 0.1], color: '#1A2030' },
  { x: 0.26, z: 0.3, y: WATER_Y - 0.1, scale: [0.36, 0.22, 0.34], rotation: [0.4, 1.4, 0.2], color: '#1C2233' },
  { x: 0.08, z: -0.28, y: WATER_Y - 0.06, scale: [0.3, 0.2, 0.28], rotation: [0.1, 2.1, 0.3], color: '#20263A' },
  { x: -0.22, z: -0.22, y: WATER_Y - 0.12, scale: [0.26, 0.18, 0.24], rotation: [0.6, 0.3, 0.5], color: '#181E2C' },
  { x: 0.36, z: -0.05, y: WATER_Y - 0.14, scale: [0.22, 0.16, 0.22], rotation: [0.3, 1.8, 0.1], color: '#232A40' },
];

/**
 * Small rocky outcrop the tower stands on, so it reads as "built on the
 * shore" rather than floating in open water. Deliberately understated per
 * the brief ("base discreta, não uma ilha grande") — a handful of low-poly
 * rocks breaking the waterline, not a modeled island with its own texture
 * work.
 */
export function LighthouseBase() {
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);

  return (
    <group position={[LIGHTHOUSE_X, 0, LIGHTHOUSE_Z]}>
      {ROCKS.map((rock, i) => (
        <mesh
          key={i}
          geometry={geometry}
          position={[rock.x, rock.y, rock.z]}
          scale={rock.scale}
          rotation={rock.rotation}
        >
          <meshStandardMaterial color={rock.color} roughness={0.8} metalness={0.08} />
        </mesh>
      ))}
      {/* Faint contact shadow under the rocks, grounding them against the
          water instead of a hard silhouette edge. */}
      <mesh position={[0, WATER_Y - 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.62, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}
