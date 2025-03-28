import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Bear3D } from './components/Bear3D';
import { Forest } from './components/Forest';
import { GameControls } from './components/GameControls';
import { Shop } from './components/Shop';
import { Inventory } from './components/Inventory';
import { AiBee } from './components/AiBee';
import { GameProvider } from './context/GameContext';

function App() {
  // Create multiple bee positions
  const beePositions: [number, number, number][] = [
    [5, 2, 5],
    [-5, 3, -5],
    [8, 2, -3],
    [-3, 3, 8],
  ];

  return (
    <div className="h-screen w-screen">
      <GameProvider>
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 75 }}
          className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600"
        >
          <Environment preset="forest" />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Bear3D />
          <Forest />
          {beePositions.map((position, index) => (
            <AiBee key={index} initialPosition={position} />
          ))}
          <OrbitControls
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={15}
          />
        </Canvas>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <GameControls />
        </div>
        <Shop />
        <Inventory />
      </GameProvider>
    </div>
  );
}

export default App;