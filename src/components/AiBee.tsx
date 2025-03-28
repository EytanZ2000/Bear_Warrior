import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameContext } from '../context/GameContext';

interface AiBeeProps {
  initialPosition: [number, number, number];
}

export function AiBee({ initialPosition }: AiBeeProps) {
  const beeRef = useRef<THREE.Group>(null);
  const { position: playerPosition } = useGameContext();
  const beeState = useRef({
    position: new THREE.Vector3(...initialPosition),
    velocity: new THREE.Vector3(),
    patrolPoint: new THREE.Vector3(...initialPosition),
    state: 'patrol' as 'patrol' | 'chase' | 'attack',
  });

  useFrame((state, delta) => {
    if (!beeRef.current) return;

    const bee = beeRef.current;
    const distanceToPlayer = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z
    ).distanceTo(beeState.current.position);

    // AI State Machine
    if (distanceToPlayer < 5 && beeState.current.state !== 'chase') {
      beeState.current.state = 'chase';
    } else if (distanceToPlayer > 8 && beeState.current.state === 'chase') {
      beeState.current.state = 'patrol';
    }

    // AI Behavior
    switch (beeState.current.state) {
      case 'patrol':
        // Simple patrol pattern
        const time = state.clock.getElapsedTime();
        beeState.current.position.x = initialPosition[0] + Math.sin(time) * 2;
        beeState.current.position.z = initialPosition[2] + Math.cos(time) * 2;
        beeState.current.position.y = initialPosition[1] + Math.sin(time * 2) * 0.5;
        break;

      case 'chase':
        // Chase player
        const direction = new THREE.Vector3(
          playerPosition.x,
          playerPosition.y + 1,
          playerPosition.z
        ).sub(beeState.current.position);
        direction.normalize();
        beeState.current.velocity.add(direction.multiplyScalar(delta * 5));
        beeState.current.velocity.multiplyScalar(0.95); // Damping
        beeState.current.position.add(beeState.current.velocity);
        break;
    }

    // Update bee position and rotation
    bee.position.copy(beeState.current.position);
    if (beeState.current.velocity.length() > 0.1) {
      bee.lookAt(
        bee.position.x + beeState.current.velocity.x,
        bee.position.y + beeState.current.velocity.y,
        bee.position.z + beeState.current.velocity.z
      );
    }

    // Wing animation
    const wings = bee.children.filter((child) => child.name === 'wing');
    wings.forEach((wing, i) => {
      wing.rotation.z = Math.sin(state.clock.getElapsedTime() * 30) * 0.5;
    });
  });

  return (
    <group ref={beeRef}>
      {/* Bee Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.4]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Bee Stripes */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.4, 0.3, 0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Bee Wings */}
      <mesh name="wing" position={[0.2, 0.1, 0]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh name="wing" position={[-0.2, 0.1, 0]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Bee Stinger */}
      <mesh position={[0, 0, -0.3]}>
        <coneGeometry args={[0.05, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}