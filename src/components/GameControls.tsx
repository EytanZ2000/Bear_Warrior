import React, { useState } from 'react';

export const GameControls: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="p-4 bg-white/80 rounded-lg shadow-md relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        X
      </button>
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
      </div>
    </div>
  );
};