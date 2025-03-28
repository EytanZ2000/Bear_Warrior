import React from 'react';
import { useGameContext } from '../context/GameContext';

export const Shop: React.FC = () => {
  const { 
    honey,
    purchaseItem,
    currentSkin,
    setSkin,
    stats,
    upgradeStats,
    isShopOpen 
  } = useGameContext();

  if (!isShopOpen) return null;

  const skins = [
    { id: 'default', name: 'Classic Brown', price: 0 },
    { id: 'golden', name: 'Golden Warrior', price: 100 },
    { id: 'dark', name: 'Dark Forest', price: 150 },
    { id: 'polar', name: 'Polar Bear', price: 200 },
    { id: 'panda', name: 'Panda', price: 250 },
    { id: 'grizzly', name: 'Grizzly', price: 300 },
    { id: 'cosmic', name: 'Cosmic Bear', price: 500 },
  ];

  const upgrades = [
    { id: 'speed', name: 'Speed', price: 50, current: stats.speed },
    { id: 'strength', name: 'Strength', price: 75, current: stats.strength },
    { id: 'defense', name: 'Defense', price: 100, current: stats.defense },
  ];

  const weapons = [
    { id: 'sword', name: 'Honey Sword', price: 150, description: 'Fast and balanced' },
    { id: 'axe', name: 'Bee Axe', price: 200, description: 'Heavy but powerful' },
    { id: 'hammer', name: 'Hive Hammer', price: 250, description: 'Massive damage' },
    { id: 'spear', name: 'Stinger Spear', price: 300, description: 'Long reach' },
    { id: 'mace', name: 'Royal Mace', price: 350, description: 'Area damage' },
  ];

  const MAX_STAT_LEVEL = 10;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-white/90 p-6 rounded-lg shadow-xl w-96">
      <h2 className="text-2xl font-bold mb-4">Bear Shop</h2>
      <div className="text-lg mb-4">Honey: {honey} 🍯</div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Skins</h3>
        <div className="grid grid-cols-2 gap-2">
          {skins.map((skin) => (
            <button
              key={skin.id}
              onClick={() => honey >= skin.price && setSkin(skin.id)}
              className={`p-2 rounded ${
                currentSkin === skin.id
                  ? 'bg-yellow-500 text-white'
                  : honey >= skin.price
                  ? 'bg-gray-200 hover:bg-gray-300'
                  : 'bg-gray-300 opacity-50 cursor-not-allowed'
              }`}
              disabled={honey < skin.price}
            >
              {skin.name} ({skin.price} 🍯)
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Upgrades</h3>
        <div className="grid grid-cols-1 gap-2">
          {upgrades.map((upgrade) => (
            <button
              key={upgrade.id}
              onClick={() => honey >= upgrade.price && upgradeStats(upgrade.id)}
              className={`p-2 rounded ${
                upgrade.current >= MAX_STAT_LEVEL
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : honey >= upgrade.price
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              disabled={upgrade.current >= MAX_STAT_LEVEL || honey < upgrade.price}
            >
              {upgrade.name} (Level {upgrade.current}/{MAX_STAT_LEVEL}) - {upgrade.price} 🍯
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Weapons</h3>
        <div className="grid grid-cols-1 gap-2">
          {weapons.map((weapon) => (
            <button
              key={weapon.id}
              onClick={() => purchaseItem('weapon', weapon.id, weapon.price)}
              className={`p-2 ${
                honey >= weapon.price
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              } rounded`}
              disabled={honey < weapon.price}
            >
              <div className="flex justify-between items-center">
                <span>{weapon.name}</span>
                <span>{weapon.price} 🍯</span>
              </div>
              <div className="text-sm opacity-75">{weapon.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};