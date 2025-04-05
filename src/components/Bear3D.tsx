import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameContext } from '../context/GameContext';
import * as THREE from 'three';

export function Bear3D() {
  const bearRef = useRef<THREE.Group>(null);
  const armsRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);
  const { position, velocity, currentSkin, equipment, isAttacking } = useGameContext();
  const { camera } = useThree();
  const [cameraMode, setCameraMode] = useState<'third-person' | 'over-the-shoulder' | 'first-person'>('third-person');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'j') {
        setCameraMode((prev) => {
          if (prev === 'third-person') return 'over-the-shoulder';
          if (prev === 'over-the-shoulder') return 'first-person';
          return 'third-person';
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

      // Update camera position based on the selected mode
      if (cameraMode === 'third-person') {
        camera.position.set(position.x, position.y + 5, position.z + 10);
        camera.lookAt(position.x, position.y + 1, position.z);
      } else if (cameraMode === 'over-the-shoulder') {
        camera.position.set(position.x - 2, position.y + 2, position.z + 5);
        camera.lookAt(position.x, position.y + 1, position.z);
      } else if (cameraMode === 'first-person') {
        camera.position.set(position.x, position.y + 1.5, position.z);
        camera.lookAt(position.x + velocity.x, position.y + 1.5, position.z + velocity.z);
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
      {cameraMode !== 'first-person' && (
        <mesh castShadow position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color={getSkinColor()} 
            metalness={currentSkin === 'cosmic' ? 0.8 : 0}
            roughness={currentSkin === 'cosmic' ? 0.2 : 0.8}
          />
        </mesh>
      )}

      {/* Cosmic bear special effects */}
      {currentSkin === 'cosmic' && cameraMode !== 'first-person' && (
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
      {cameraMode !== 'first-person' && (
        <mesh castShadow position={[0, 1, 0]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial 
            color={getSkinColor()}
            metalness={currentSkin === 'cosmic' ? 0.8 : 0}
            roughness={currentSkin === 'cosmic' ? 0.2 : 0.8}
          />
        </mesh>
      )}

      {/* For Grizzly bear, add fur texture through normal mapping */}
      {currentSkin === 'grizzly' && cameraMode !== 'first-person' && (
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
      {currentSkin === 'panda' && cameraMode !== 'first-person' && (
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
      {cameraMode !== 'first-person' && (
        <mesh castShadow position={[0, 1, 0]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial color={getSkinColor()} />
        </mesh>
      )}

      {/* Bear Arms Group */}
      <group ref={armsRef}>
        {/* Smaller, Cuter Arms */}
        {cameraMode !== 'first-person' && (
          <>
            <mesh castShadow position={[0.4, 0.5, 0]}>
              <capsuleGeometry args={[0.1, 0.3]} />
              <meshStandardMaterial color={getSkinColor()} />
            </mesh>
            <mesh castShadow position={[-0.4, 0.5, 0]}>
              <capsuleGeometry args={[0.1, 0.3]} />
              <meshStandardMaterial color={getSkinColor()} />
            </mesh>
          </>
        )}
      </group>

      {/* Bear Ears */}
      {cameraMode !== 'first-person' && (
        <>
          <mesh castShadow position={[0.2, 1.3, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color={getSkinColor()} />
          </mesh>
          <mesh castShadow position={[-0.2, 1.3, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color={getSkinColor()} />
          </mesh>
        </>
      )}

      {/* Bigger Eyes */}
      {cameraMode !== 'first-person' && (
        <>
          <mesh position={[0.18, 1.1, 0.35]}>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[-0.18, 1.1, 0.35]}>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </>
      )}

      {/* Cute Small Black Nose */}
      {cameraMode !== 'first-person' && (
        <mesh position={[0, 0.95, 0.4]}>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      )}

      {/* Cute Mouth */}
      {cameraMode !== 'first-person' && (
        <mesh position={[0, 0.85, 0.38]}>
          <torusGeometry args={[0.05, 0.01, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#4a3328" />
        </mesh>
      )}

      {/* Weapon visibility in first-person */}
      {equipment.weapon && (
        <group 
          ref={weaponRef}
          position={cameraMode === 'first-person' ? [0.5, -0.5, -1] : [0.4, 0.5, 0]} 
          rotation={[0, 0, isAttacking ? -Math.PI / 2 : -Math.PI / 6]}
        >
          {equipment.weapon === 'sword' && (
            <>
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.8, 0.08]} />
                <meshStandardMaterial color="silver" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh castShadow position={[0, -0.35, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.2]} />
                <meshStandardMaterial color="brown" roughness={0.8} />
              </mesh>
              <mesh castShadow position={[0, 0.4, 0]}>
                <boxGeometry args={[0.2, 0.08, 0.08]} />
                <meshStandardMaterial color="gold" metalness={0.9} roughness={0.1} />
              </mesh>
            </>
          )}
          {/* Add other weapon types here */}
        </group>
      )}
    </group>
  );
}