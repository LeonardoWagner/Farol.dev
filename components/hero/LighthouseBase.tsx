'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

const LIGHTHOUSE_X = 1.7;
const LIGHTHOUSE_Z = -1;
const WATER_Y = -0.6;

/** Top surface of the stone platform — the tower and keeper's house both
 * stand on this, and it's exported so LighthouseModel can start the tower
 * body exactly here instead of guessing an offset. */
export const PLATFORM_TOP_Y = WATER_Y + 0.16;

type RockSpec = {
  x: number;
  z: number;
  y: number;
  scale: [number, number, number];
  rotation: [number, number, number];
  color: string;
};

// Deliberately uneven in count-per-side, size and depth — the previous
// version's 5 rocks read as "two symmetric round humps flanking the tower"
// because they were mirrored left/right at similar sizes. These are placed
// off-axis and at four different scales, with two nearly submerged (top
// barely above WATER_Y) so the waterline reads as irregular, not a clean
// ring around a pedestal.
const ROCKS: RockSpec[] = [
  { x: -0.58, z: 0.22, y: WATER_Y - 0.05, scale: [0.34, 0.22, 0.3], rotation: [0.3, 0.4, 0.1], color: '#1C2233' },
  { x: -0.34, z: 0.42, y: WATER_Y - 0.14, scale: [0.2, 0.13, 0.18], rotation: [0.5, 1.9, 0.2], color: '#181E2C' },
  { x: 0.5, z: 0.3, y: WATER_Y - 0.1, scale: [0.26, 0.16, 0.24], rotation: [0.2, 2.4, 0.4], color: '#20263A' },
  { x: 0.14, z: 0.48, y: WATER_Y - 0.16, scale: [0.16, 0.1, 0.15], rotation: [0.6, 0.8, 0.1], color: '#1A2030' },
];

// Small footprint for the keeper's house, offset to one side of the tower —
// this asymmetry plus the platform is what breaks the "tower floating in
// open water" reading, not a modeled island.
const HOUSE_WIDTH = 0.52;
const HOUSE_DEPTH = 0.4;
const HOUSE_HEIGHT = 0.32;
const HOUSE_X = -0.34;
const HOUSE_Z = 0.08;

/**
 * The tower's foundation: a low hexagonal stone platform (wider than the
 * tower, mostly submerged at the edges), a small keeper's-house volume
 * offset to one side, and a handful of irregular, asymmetric rocks around
 * the waterline. Replaces the earlier "two rounded rock masses" version,
 * which read as symmetric humps rather than a shoreline.
 */
export function LighthouseBase() {
  const rockGeometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);

  return (
    <group position={[LIGHTHOUSE_X, 0, LIGHTHOUSE_Z]}>
      {/* Stone platform — hexagonal prism, wider than the tower, giving the
          composition a horizontal base instead of a vertical line meeting
          the water directly. */}
      <mesh position={[0.04, WATER_Y + 0.05, 0.02]}>
        <cylinderGeometry args={[0.62, 0.7, 0.18, 6]} />
        <meshStandardMaterial color="#3A4156" roughness={0.85} metalness={0.06} />
      </mesh>

      {/* Keeper's house — small rectangular volume beside the tower, with a
          low pitched roof and a dark door/window notch. Off-center on
          purpose: the tower does not rise from the exact middle of the
          platform, which keeps the composition asymmetric. */}
      <mesh position={[HOUSE_X, PLATFORM_TOP_Y + HOUSE_HEIGHT / 2, HOUSE_Z]}>
        <boxGeometry args={[HOUSE_WIDTH, HOUSE_HEIGHT, HOUSE_DEPTH]} />
        <meshStandardMaterial color="#E4DECF" emissive="#4A4638" emissiveIntensity={0.3} roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[HOUSE_X, PLATFORM_TOP_Y + HOUSE_HEIGHT + 0.07, HOUSE_Z]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.42, 0.16, 4]} />
        <meshStandardMaterial color="#232A3B" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Door — small dark inset on the house's front face */}
      <mesh position={[HOUSE_X, PLATFORM_TOP_Y + 0.11, HOUSE_Z + HOUSE_DEPTH / 2 + 0.005]}>
        <planeGeometry args={[0.1, 0.2]} />
        <meshStandardMaterial color="#12151F" roughness={0.9} />
      </mesh>
      {/* Small lit window beside the door */}
      <mesh position={[HOUSE_X + 0.16, PLATFORM_TOP_Y + 0.19, HOUSE_Z + HOUSE_DEPTH / 2 + 0.005]}>
        <planeGeometry args={[0.07, 0.07]} />
        <meshStandardMaterial color="#FFD9C7" emissive="#FF8F73" emissiveIntensity={0.6} roughness={0.5} />
      </mesh>

      {ROCKS.map((rock, i) => (
        <mesh
          key={i}
          geometry={rockGeometry}
          position={[rock.x, rock.y, rock.z]}
          scale={rock.scale}
          rotation={rock.rotation}
        >
          <meshStandardMaterial color={rock.color} roughness={0.8} metalness={0.08} />
        </mesh>
      ))}

      {/* Contact shadow — an ellipse, not a circle, and offset toward the
          house so it follows the asymmetric footprint instead of implying a
          perfectly round pedestal underneath. */}
      <mesh position={[-0.12, WATER_Y - 0.01, 0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.15, 0.8, 1]}>
        <circleGeometry args={[0.62, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
