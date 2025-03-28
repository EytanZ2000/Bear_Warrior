import React from 'react';

export const BearSprite: React.FC = () => {
  return (
    <div className="w-16 h-16 bg-brown-500 rounded-full relative">
      {/* Bear body */}
      <div className="absolute inset-0 bg-amber-700 rounded-full" />
      
      {/* Bear ears */}
      <div className="absolute -top-3 -left-1 w-4 h-4 bg-amber-800 rounded-full" />
      <div className="absolute -top-3 -right-1 w-4 h-4 bg-amber-800 rounded-full" />
      
      {/* Bear face */}
      <div className="absolute top-2 left-3 w-2 h-2 bg-black rounded-full" />
      <div className="absolute top-2 right-3 w-2 h-2 bg-black rounded-full" />
      <div className="absolute top-4 left-4 right-4 h-2 bg-amber-900 rounded-full" />
    </div>
  );
};