'use client';

import React from 'react';
import { useSnapshot } from 'valtio';
import { gameStore, gameActions } from '../../store/gameStore';

const GameControls: React.FC = () => {
  const gameState = useSnapshot(gameStore);

  return (
    <div className="text-center space-y-4">
      {!gameState.gameStarted ? (
        <div className="space-y-2">
          <button
            onClick={gameActions.startGame}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Game
          </button>
          <div className="text-sm text-gray-600">
            Press Space to start or use arrow keys to move
          </div>
        </div>
      ) : gameState.gameOver ? (
        <div className="space-y-2">
          <div className="text-xl font-bold text-red-600 mb-2">Game Over!</div>
          <div className="text-lg text-gray-700">Final Score: {gameState.score}</div>
          <button
            onClick={gameActions.resetGame}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
          <div className="text-sm text-gray-600">
            Press Space to restart
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-lg font-semibold text-green-600">Playing...</div>
          <div className="text-sm text-gray-600">
            Use arrow keys to control the snake
          </div>
          <div className="text-xs text-gray-500">
            <div>🍎 Red Apple: 10 points</div>
            <div>🌟 Gold Apple: 50 points</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;