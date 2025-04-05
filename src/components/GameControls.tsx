import React, { useState, useEffect } from 'react';

export const GameControls: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'x') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="p-4 bg-white/80 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Controls</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-semibold">Move Forward:</span> W
        </div>
        <div>
          <span className="font-semibold">Move Backward:</span> S
        </div>
        <div>
          <span className="font-semibold">Move Left:</span> A
        </div>
        <div>
          <span className="font-semibold">Move Right:</span> D
        </div>
        <div>
          <span className="font-semibold">Jump:</span> Space
        </div>
        <div>
          <span className="font-semibold">Attack:</span> G
        </div>
        <div>
          <span className="font-semibold">Toggle Inventory:</span> E
        </div>
        <div>
          <span className="font-semibold">Toggle Shop:</span> B
        </div>
        <div>
          <span className="font-semibold">Camera Control:</span> Mouse
        </div>
        <div>
          <span className="font-semibold">Toggle Controls:</span> X
        </div>
        <div>
          <span className="font-semibold">Toggle Camera View:</span> J
        </div>
      </div>
    </div>
  );
};