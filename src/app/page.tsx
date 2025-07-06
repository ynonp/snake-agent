'use client';

import SnakeGame from '../components/snake/SnakeGame';
import { GameProvider } from '../contexts/GameContext';

export default function Home() {
  return (
    <GameProvider>
      <SnakeGame />
    </GameProvider>
  );
}