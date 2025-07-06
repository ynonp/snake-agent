import { GameState, Position, Apple } from '../types/game'

// Default test positions
export const CENTER_POSITION: Position = { x: 12, y: 12 }
export const TOP_LEFT_POSITION: Position = { x: 0, y: 0 }
export const BOTTOM_RIGHT_POSITION: Position = { x: 24, y: 24 }

// Test apple fixtures
export const REGULAR_APPLE: Apple = {
  position: { x: 10, y: 10 },
  type: 'regular',
  points: 10,
}

export const GOLD_APPLE: Apple = {
  position: { x: 15, y: 15 },
  type: 'gold',
  points: 50,
}

// Game state fixtures
export const INITIAL_GAME_STATE: GameState = {
  snake: [CENTER_POSITION],
  direction: 'DOWN',
  nextDirection: 'DOWN',
  apple: null,
  score: 0,
  gameOver: false,
  gameStarted: false,
  speed: 500,
  gridSize: 20,
  boardWidth: 25,
  boardHeight: 25,
}

export const PLAYING_GAME_STATE: GameState = {
  ...INITIAL_GAME_STATE,
  gameStarted: true,
  apple: REGULAR_APPLE,
  snake: [
    { x: 12, y: 12 },
    { x: 12, y: 13 },
    { x: 12, y: 14 },
  ],
  score: 30,
  speed: 450,
}

export const GAME_OVER_STATE: GameState = {
  ...PLAYING_GAME_STATE,
  gameOver: true,
  gameStarted: false,
  score: 150,
}

// Snake configurations for testing
export const SNAKE_NEAR_WALL = [
  { x: 0, y: 5 }, // Head at left wall
  { x: 1, y: 5 },
  { x: 2, y: 5 },
]

export const SNAKE_SELF_COLLISION = [
  { x: 10, y: 10 }, // Head
  { x: 10, y: 11 },
  { x: 10, y: 12 },
  { x: 9, y: 12 },
  { x: 9, y: 11 },
  { x: 9, y: 10 }, // Body segment at same position as head after move
]