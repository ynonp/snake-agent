'use client';

import React from 'react';
import { useGameLoop } from '../../hooks/useGameLoop';
import GameBoard from './GameBoard';
import GameScore from './GameScore';
import GameControls from './GameControls';

const SnakeGame: React.FC = () => {
  useGameLoop();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Snake Game</h1>
        
        <GameScore />
        
        <GameBoard className="mx-auto" />
        
        <GameControls />
      </div>
    </div>
  );
};

export default SnakeGame;