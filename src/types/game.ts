export interface Position {
  x: number;
  y: number;
}

export interface Apple {
  position: Position;
  type: 'regular' | 'gold';
  points: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameState {
  snake: Position[];
  direction: Direction;
  nextDirection: Direction;
  apple: Apple | null;
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
  speed: number;
  gridSize: number;
  boardWidth: number;
  boardHeight: number;
}

export interface GameActions {
  startGame: () => void;
  resetGame: () => void;
  moveSnake: () => void;
  changeDirection: (direction: Direction) => void;
  generateApple: () => void;
  checkCollision: () => boolean;
  checkAppleCollision: () => boolean;
  increaseSpeed: () => void;
}