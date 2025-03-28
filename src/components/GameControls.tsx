import React from 'react';

export const GameControls: React.FC = () => {
  return (
    <div className="p-4 bg-white/80 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Controls</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-semibold">Move Left:</span> A
        </div>
        <div>
          <span className="font-semibold">Move Right:</span> D
        </div>
        <div>
          <span className="font-semibold">Jump:</span> W
        </div>
        <div>
          <span className="font-semibold">Attack:</span> Space
        </div>
        <div>
          <span className="font-semibold">Camera:</span> Mouse
        </div>
      </div>
    </div>
  );
};