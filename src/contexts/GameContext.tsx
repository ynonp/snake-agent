'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { gameStore, gameActions } from '../store/gameStore';
import { GameState, GameActions } from '../types/game';

interface GameContextType {
  gameState: GameState;
  gameActions: GameActions;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const contextValue: GameContextType = {
    gameState: gameStore,
    gameActions,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};