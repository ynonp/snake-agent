import { proxy } from 'valtio';
import { GameState, Position, Direction } from '../types/game';

const GRID_SIZE = 20;
const BOARD_WIDTH = 25;
const BOARD_HEIGHT = 25;
const INITIAL_SPEED = 500;
const MIN_SPEED = 50;

const initialState: GameState = {
  snake: [{ x: 12, y: 12 }],
  direction: 'DOWN',
  nextDirection: 'DOWN',
  apple: null,
  score: 0,
  gameOver: false,
  gameStarted: false,
  speed: INITIAL_SPEED,
  gridSize: GRID_SIZE,
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
};

export const gameStore = proxy<GameState>(initialState);

export const gameActions = {
  startGame: () => {
    gameStore.gameStarted = true;
    gameStore.gameOver = false;
    gameActions.generateApple();
  },

  resetGame: () => {
    Object.assign(gameStore, {
      ...initialState,
      snake: [{ x: 12, y: 12 }],
      direction: 'DOWN',
      nextDirection: 'DOWN',
      apple: null,
      score: 0,
      gameOver: false,
      gameStarted: false,
      speed: INITIAL_SPEED,
    });
    gameActions.generateApple();
  },

  changeDirection: (direction: Direction) => {
    // Prevent reversing direction
    const currentDirection = gameStore.direction;
    const oppositeDirections: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    if (oppositeDirections[currentDirection] !== direction) {
      gameStore.nextDirection = direction;
    }
  },

  moveSnake: () => {
    if (gameStore.gameOver || !gameStore.gameStarted) return;

    // Update direction
    gameStore.direction = gameStore.nextDirection;

    const head = gameStore.snake[0];
    const newHead: Position = { ...head };

    // Move head based on direction
    switch (gameStore.direction) {
      case 'UP':
        newHead.y -= 1;
        break;
      case 'DOWN':
        newHead.y += 1;
        break;
      case 'LEFT':
        newHead.x -= 1;
        break;
      case 'RIGHT':
        newHead.x += 1;
        break;
    }

    // Check for collisions
    if (gameActions.checkCollision(newHead)) {
      gameStore.gameOver = true;
      return;
    }

    // Add new head
    gameStore.snake.unshift(newHead);

    // Check if apple is eaten
    if (gameActions.checkAppleCollision(newHead)) {
      gameStore.score += gameStore.apple!.points;
      gameActions.generateApple();
      gameActions.increaseSpeed();
    } else {
      // Remove tail if no apple eaten
      gameStore.snake.pop();
    }
  },

  checkCollision: (head: Position = gameStore.snake[0]) => {
    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= BOARD_WIDTH ||
      head.y < 0 ||
      head.y >= BOARD_HEIGHT
    ) {
      return true;
    }

    // Check self collision
    for (let i = 1; i < gameStore.snake.length; i++) {
      if (gameStore.snake[i].x === head.x && gameStore.snake[i].y === head.y) {
        return true;
      }
    }

    return false;
  },

  checkAppleCollision: (head: Position = gameStore.snake[0]) => {
    if (!gameStore.apple) return false;
    return (
      head.x === gameStore.apple.position.x &&
      head.y === gameStore.apple.position.y
    );
  },

  generateApple: () => {
    let newPosition: Position;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      newPosition = {
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * BOARD_HEIGHT),
      };
      attempts++;
    } while (
      attempts < maxAttempts &&
      gameStore.snake.some(
        (segment) => segment.x === newPosition.x && segment.y === newPosition.y
      )
    );

    // 20% chance for gold apple
    const isGold = Math.random() < 0.2;
    
    gameStore.apple = {
      position: newPosition,
      type: isGold ? 'gold' : 'regular',
      points: isGold ? 50 : 10,
    };
  },

  increaseSpeed: () => {
    if (gameStore.speed > MIN_SPEED) {
      gameStore.speed = Math.max(MIN_SPEED, gameStore.speed - 5);
    }
  },
};