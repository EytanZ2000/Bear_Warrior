import React from 'react';
import { Plane, Cloud } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Forest() {
  // Create refs for moving clouds
  const cloudsRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cloudsRef.current) {
      // Move clouds slowly
      cloudsRef.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 5;
    }
  });

  // Generate more trees
  const trees = Array.from({ length: 50 }).map((_, i) => {
    const x = Math.random() * 60 - 30;
    const z = Math.random() * 60 - 30;
    const scale = 0.5 + Math.random() * 0.5;
    return { position: [x, 0, z], scale };
  });

  // Generate random positions for collectible weapons
  const weaponSpots = Array.from({ length: 5 }).map((_, i) => {
    const x = Math.random() * 40 - 20;
    const z = Math.random() * 40 - 20;
    return { position: [x, 0.5, z], type: Math.random() > 0.5 ? 'sword' : 'axe' };
  });

  return (
    <group>
      {/* Ground */}
      <Plane
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        args={[100, 100]}
      >
        <meshStandardMaterial color="#2d5a27" />
      </Plane>

      {/* Sun */}
      <mesh position={[50, 30, -50]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>

      {/* Clouds */}
      <group ref={cloudsRef} position={[0, 15, 0]}>
        <Cloud position={[-10, 0, -10]} args={[3, 2]} />
        <Cloud position={[10, 2, -5]} args={[4, 2]} />
        <Cloud position={[-5, 1, 5]} args={[3.5, 2]} />
        <Cloud position={[15, -1, 10]} args={[3, 2]} />
      </group>

      {/* Trees */}
      {trees.map((tree, i) => (
        <group key={i} position={tree.position as any} scale={[tree.scale, tree.scale, tree.scale]}>
          {/* Tree Trunk */}
          <mesh castShadow position={[0, 1, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 2]} />
            <meshStandardMaterial color="#4a2105" />
          </mesh>
          {/* Tree Top - More detailed with multiple layers */}
          <group position={[0, 2.5, 0]}>
            <mesh castShadow position={[0, -0.5, 0]}>
              <coneGeometry args={[1.2, 1.5, 8]} />
              <meshStandardMaterial color="#1a472a" />
            </mesh>
            <mesh castShadow position={[0, 0, 0]}>
              <coneGeometry args={[0.9, 1.5, 8]} />
              <meshStandardMaterial color="#2d5a27" />
            </mesh>
            <mesh castShadow position={[0, 0.5, 0]}>
              <coneGeometry args={[0.6, 1.5, 8]} />
              <meshStandardMaterial color="#1a472a" />
            </mesh>
          </group>
        </group>
      ))}

      {/* Collectible Weapons */}
      {weaponSpots.map((weapon, i) => (
        <group key={`weapon-${i}`} position={weapon.position as any} rotation={[0, Math.random() * Math.PI * 2, 0]}>
          {weapon.type === 'sword' ? (
            <group>
              <mesh castShadow>
                <boxGeometry args={[0.1, 0.8, 0.1]} />
                <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh castShadow position={[0, 0.4, 0]}>
                <boxGeometry args={[0.2, 0.1, 0.1]} />
                <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          ) : (
            <group>
              <mesh castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.6]} />
                <meshStandardMaterial color="brown" />
              </mesh>
              <mesh castShadow position={[0.2, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
                <coneGeometry args={[0.15, 0.3, 4]} />
                <meshStandardMaterial color="silver" metalness={0.8} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}