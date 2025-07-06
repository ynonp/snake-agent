'use client';

import React from 'react';
import { useSnapshot } from 'valtio';
import { gameStore } from '../../store/gameStore';
import { cn } from '../../lib/utils';

interface GameBoardProps {
  className?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ className }) => {
  const gameState = useSnapshot(gameStore);

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = gameState.snake[0]?.x === x && gameState.snake[0]?.y === y;
    const isSnakeBody = gameState.snake.some(
      (segment, index) => index > 0 && segment.x === x && segment.y === y
    );
    const isApple = gameState.apple?.position.x === x && gameState.apple?.position.y === y;

    let cellClass = 'w-5 h-5 border border-gray-300';

    if (isSnakeHead) {
      cellClass += ' bg-green-600 border-green-700';
    } else if (isSnakeBody) {
      cellClass += ' bg-green-500 border-green-600';
    } else if (isApple) {
      cellClass += gameState.apple?.type === 'gold' 
        ? ' bg-yellow-400 border-yellow-500 rounded-full' 
        : ' bg-red-500 border-red-600 rounded-full';
    } else {
      cellClass += ' bg-gray-100';
    }

    return (
      <div
        key={`${x}-${y}`}
        className={cellClass}
      />
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let y = 0; y < gameState.boardHeight; y++) {
      const cells = [];
      for (let x = 0; x < gameState.boardWidth; x++) {
        cells.push(renderCell(x, y));
      }
      rows.push(
        <div key={y} className="flex">
          {cells}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className={cn('inline-block border-2 border-gray-400 bg-gray-200', className)}>
      {renderBoard()}
    </div>
  );
};

export default GameBoard;