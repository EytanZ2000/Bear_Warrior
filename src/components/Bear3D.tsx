import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameContext } from '../context/GameContext';
import * as THREE from 'three';

export function Bear3D() {
  const bearRef = useRef<THREE.Group>(null);
  const armsRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);
  const { position, velocity, currentSkin, equipment, isAttacking } = useGameContext();

  useFrame((state) => {
    if (bearRef.current) {
      bearRef.current.position.x = position.x;
      bearRef.current.position.y = position.y;
      bearRef.current.position.z = position.z;

      // Rotate bear based on movement direction
      if (velocity.x !== 0 || velocity.z !== 0) {
        const angle = Math.atan2(velocity.x, velocity.z);
        bearRef.current.rotation.y = angle;
      }

      // Animate arms when attacking
      if (armsRef.current && isAttacking) {
        const time = state.clock.getElapsedTime();
        armsRef.current.rotation.x = Math.sin(time * 15) * 0.5;
      } else if (armsRef.current) {
        // Gentle arm swing while walking
        const time = state.clock.getElapsedTime();
        armsRef.current.rotation.x = Math.sin(time * 5) * 0.2;
      }
    }
  });

  // Get skin color based on selected skin
  const getSkinColor = () => {
    switch (currentSkin) {
      case 'golden':
        return '#FFD700';
      case 'dark':
        return '#4A2810';
      case 'polar':
        return '#F0F0F0';
      case 'panda':
        return '#FFFFFF'; // Main panda color is white
      case 'grizzly':
        return '#8B4513'; // Dark brown for grizzly
      case 'cosmic':
        // Use animated color for cosmic bear
        const time = Date.now() * 0.001;
        const hue = (time * 50) % 360;
        return `hsl(${hue}, 70%, 50%)`; // Shifting rainbow color
      default:
        return '#8B4513'; // Default brown bear
    }
  };

  return (
    <group ref={bearRef}>
      {/* Bear Body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={getSkinColor()} 
          metalness={currentSkin === 'cosmic' ? 0.8 : 0}
          roughness={currentSkin === 'cosmic' ? 0.2 : 0.8}
        />
      </mesh>

      {/* Cosmic bear special effects */}
      {currentSkin === 'cosmic' && (
        <>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent={true}
              opacity={0.2}
            />
          </mesh>
          <pointLight
            position={[0, 0.5, 0]}
            distance={1}
            intensity={1}
            color={getSkinColor()}
          />
        </>
      )}

      {/* Rest of bear parts - update their material properties */}
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial 
          color={getSkinColor()}
          metalness={currentSkin === 'cosmic' ? 0.8 : 0}
          roughness={currentSkin === 'cosmic' ? 0.2 : 0.8}
        />
      </mesh>

      {/* For Grizzly bear, add fur texture through normal mapping */}
      {currentSkin === 'grizzly' && (
        <mesh castShadow position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshStandardMaterial
            color="#704214"
            transparent={true}
            opacity={0.3}
            roughness={1}
          />
        </mesh>
      )}

      {/* Additional black patches for panda */}
      {currentSkin === 'panda' && (
        <>
          {/* Eye patches */}
          <mesh castShadow position={[0.2, 1.1, 0.3]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh castShadow position={[-0.2, 1.1, 0.3]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
          
          {/* Body patches */}
          <mesh castShadow position={[0, 0.5, 0.3]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </>
      )}

      {/* Bear Head */}
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={getSkinColor()} />
      </mesh>

      {/* Bear Arms Group */}
      <group ref={armsRef}>
        {/* Smaller, Cuter Arms */}
        <mesh castShadow position={[0.4, 0.5, 0]}>
          <capsuleGeometry args={[0.1, 0.3]} />
          <meshStandardMaterial color={getSkinColor()} />
        </mesh>
        <mesh castShadow position={[-0.4, 0.5, 0]}>
          <capsuleGeometry args={[0.1, 0.3]} />
          <meshStandardMaterial color={getSkinColor()} />
        </mesh>
      </group>

      {/* Bear Ears */}
      <mesh castShadow position={[0.2, 1.3, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={getSkinColor()} />
      </mesh>
      <mesh castShadow position={[-0.2, 1.3, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={getSkinColor()} />
      </mesh>

      {/* Bigger Eyes */}
      <mesh position={[0.18, 1.1, 0.35]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.18, 1.1, 0.35]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Cute Small Black Nose */}
      <mesh position={[0, 0.95, 0.4]}>
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Cute Mouth */}
      <mesh position={[0, 0.85, 0.38]}>
        <torusGeometry args={[0.05, 0.01, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#4a3328" />
      </mesh>
    </group>
  );
}