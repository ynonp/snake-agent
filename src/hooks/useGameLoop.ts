'use client';

import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { gameStore, gameActions } from '../store/gameStore';

export const useGameLoop = () => {
  const gameState = useSnapshot(gameStore);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!gameState.gameStarted || gameState.gameOver) {
        return;
      }

      if (timestamp - lastUpdateRef.current >= gameState.speed) {
        gameActions.moveSnake();
        lastUpdateRef.current = timestamp;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameState.gameStarted && !gameState.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameStarted, gameState.gameOver, gameState.speed]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameState.gameStarted || gameState.gameOver) {
        if (event.key === ' ') {
          event.preventDefault();
          if (gameState.gameOver) {
            gameActions.resetGame();
          } else {
            gameActions.startGame();
          }
        }
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          gameActions.changeDirection('UP');
          break;
        case 'ArrowDown':
          event.preventDefault();
          gameActions.changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          event.preventDefault();
          gameActions.changeDirection('LEFT');
          break;
        case 'ArrowRight':
          event.preventDefault();
          gameActions.changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameStarted, gameState.gameOver]);

  return { gameState, gameActions };
};