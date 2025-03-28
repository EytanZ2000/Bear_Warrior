import React from 'react';
import { useGameContext } from '../context/GameContext';

export const Inventory: React.FC = () => {
  const { inventory, isInventoryOpen, equipment, equipItem } = useGameContext();

  if (!isInventoryOpen) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-white/90 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {inventory.map((item, index) => (
          <div
            key={index}
            className={`w-16 h-16 bg-gray-200 rounded p-2 cursor-pointer hover:bg-gray-300
                      ${equipment[item.type] === item.id ? 'border-2 border-yellow-500' : ''}`}
            onClick={() => equipItem(item)}
          >
            <div className="text-center">
              <div className="text-2xl">{item.icon}</div>
              <div className="text-xs">{item.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};