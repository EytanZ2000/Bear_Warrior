import React from 'react';
import { BearSprite } from '../assets/BearSprite';

interface BearProps {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

export const Bear: React.FC<BearProps> = ({ position, velocity }) => {
  const direction = velocity.x < 0 ? 'left' : 'right';

  return (
    <div
      className="absolute transition-transform"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scaleX(${direction === 'left' ? -1 : 1})`,
      }}
    >
      <BearSprite />
    </div>
  );
};