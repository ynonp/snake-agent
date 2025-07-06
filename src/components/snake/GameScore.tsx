'use client';

import React from 'react';
import { useSnapshot } from 'valtio';
import { gameStore } from '../../store/gameStore';

const GameScore: React.FC = () => {
  const gameState = useSnapshot(gameStore);

  return (
    <div className="text-center space-y-2">
      <div className="text-2xl font-bold text-gray-800">
        Score: {gameState.score}
      </div>
      <div className="text-sm text-gray-600">
        Snake Length: {gameState.snake.length}
      </div>
      <div className="text-sm text-gray-600">
        Speed: {Math.round(((600 - gameState.speed) / 550) * 100)}%
      </div>
    </div>
  );
};

export default GameScore;