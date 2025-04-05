import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface WeaponData {
  id: string;
  type: string;
  name: string;
  icon: string;
  level: number;
  damage: number;
  attackSpeed: number;
  effects?: string[];
}

interface GameContextType {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  isJumping: boolean;
  isAttacking: boolean;
  attackCooldown: boolean;
  honey: number;
  inventory: Array<{
    id: string;
    type: string;
    name: string;
    icon: string;
    level?: number;
  }>;
  equipment: {
    weapon?: string;
    armor?: string;
  };
  stats: {
    speed: number;
    strength: number;
    defense: number;
  };
  currentSkin: string;
  currentLevel: number;
  isInventoryOpen: boolean;
  isShopOpen: boolean;
  currentWeaponLevel: number;
  setSkin: (skinId: string) => void;
  purchaseItem: (type: string, itemId: string, price: number) => void;
  equipItem: (item: any) => void;
  upgradeStats: (statId: string) => void;
  collectWeapon: (weaponType: string) => void;
  collectHoney: (amount: number) => void;
}

const MAX_STAT_LEVEL = 10;
const STARTING_HONEY = 500;

const GameContext = createContext<GameContextType>({
  position: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  isJumping: false,
  isAttacking: false,
  attackCooldown: false,
  honey: STARTING_HONEY,
  inventory: [],
  equipment: {},
  stats: { speed: 1, strength: 1, defense: 1 },
  currentSkin: 'default',
  currentLevel: 1,
  isInventoryOpen: false,
  isShopOpen: false,
  currentWeaponLevel: 1,
  setSkin: () => {},
  purchaseItem: () => {},
  equipItem: () => {},
  upgradeStats: () => {},
  collectWeapon: () => {},
  collectHoney: () => {},
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackCooldown, setAttackCooldown] = useState(false);
  const [honey, setHoney] = useState(STARTING_HONEY);
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState({});
  const [stats, setStats] = useState({ speed: 1, strength: 1, defense: 1 });
  const [currentSkin, setCurrentSkin] = useState('default');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [currentWeaponLevel, setCurrentWeaponLevel] = useState(1);
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      
      // Toggle inventory with E
      if (e.key.toLowerCase() === 'e') {
        setIsInventoryOpen(prev => !prev);
        setIsShopOpen(false);
      }
      
      // Toggle shop with B
      if (e.key.toLowerCase() === 'b') {
        setIsShopOpen(prev => !prev);
        setIsInventoryOpen(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = setInterval(() => {
      const newVelocity = { ...velocity };
      const newPosition = { ...position };
      const moveSpeed = 0.1 * stats.speed;

      // Movement in all directions
      if (keysPressed.current.has('w')) newVelocity.z = -moveSpeed;
      else if (keysPressed.current.has('s')) newVelocity.z = moveSpeed;
      else newVelocity.z = 0;

      if (keysPressed.current.has('a')) newVelocity.x = -moveSpeed;
      else if (keysPressed.current.has('d')) newVelocity.x = moveSpeed;
      else newVelocity.x = 0;

      // Jumping
      if (keysPressed.current.has(' ') && !isJumping) {
        newVelocity.y = 0.2;
        setIsJumping(true);
      }

      // Gravity
      if (isJumping) {
        newVelocity.y -= 0.01;
      }

      // Update position
      newPosition.x += newVelocity.x;
      newPosition.y += newVelocity.y;
      newPosition.z += newVelocity.z;

      // Ground collision
      if (newPosition.y < 0) {
        newPosition.y = 0;
        newVelocity.y = 0;
        setIsJumping(false);
      }

      // Level transition check
      if (Math.abs(newPosition.x) > 50 || Math.abs(newPosition.z) > 50) {
        setCurrentLevel(prev => prev + 1);
        newPosition.x = 0;
        newPosition.z = 0;
      }

      setPosition(newPosition);
      setVelocity(newVelocity);
    }, 1000 / 60);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(gameLoop);
    };
  }, [position, velocity, isJumping, stats.speed]);

  const setSkin = (skinId: string) => {
    setCurrentSkin(skinId);
  };

  const purchaseItem = (type: string, itemId: string, price: number) => {
    if (honey >= price) {
      setHoney(prev => prev - price);
      setInventory(prev => [...prev, { 
        id: itemId, 
        type, 
        name: itemId, 
        icon: '⚔️',
        level: 1
      }]);
    }
  };

  const equipItem = (item: any) => {
    setEquipment(prev => ({ ...prev, [item.type]: item.id }));
  };

  const upgradeStats = (statId: string) => {
    setStats(prev => {
      if (prev[statId] < MAX_STAT_LEVEL) {
        return { ...prev, [statId]: prev[statId] + 1 };
      }
      return prev;
    });
  };

  const collectWeapon = (weaponType: string) => {
    setInventory(prev => [...prev, {
      id: weaponType,
      type: 'weapon',
      name: weaponType.charAt(0).toUpperCase() + weaponType.slice(1),
      icon: getWeaponIcon(weaponType),
      level: 1
    }]);
  };

  const collectHoney = (amount: number) => {
    setHoney(prev => prev + amount);
  };

  const getWeaponIcon = (weaponType: string) => {
    switch (weaponType) {
      case 'sword': return '🗡️';
      case 'axe': return '🪓';
      case 'hammer': return '🔨';
      case 'spear': return '🗡️';
      case 'mace': return '⚔️';
      default: return '⚔️';
    }
  };

  return (
    <GameContext.Provider value={{
      position,
      velocity,
      isJumping,
      isAttacking,
      attackCooldown,
      honey,
      inventory,
      equipment,
      stats,
      currentSkin,
      currentLevel,
      isInventoryOpen,
      isShopOpen,
      currentWeaponLevel,
      setSkin,
      purchaseItem,
      equipItem,
      upgradeStats,
      collectWeapon,
      collectHoney,
    }}>
      {children}
    </GameContext.Provider>
  );
};