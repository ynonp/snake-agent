import { describe, it, expect } from 'vitest'
import { Position, Apple, Direction, GameState, GameActions } from '../../types/game'

describe('Game Types', () => {
  describe('Position interface', () => {
    it('should have x and y number properties', () => {
      const position: Position = { x: 10, y: 20 }
      
      expect(position.x).toBe(10)
      expect(position.y).toBe(20)
      expect(typeof position.x).toBe('number')
      expect(typeof position.y).toBe('number')
    })
  })

  describe('Apple interface', () => {
    it('should have correct properties for regular apple', () => {
      const apple: Apple = {
        position: { x: 5, y: 5 },
        type: 'regular',
        points: 10,
      }
      
      expect(apple.position).toEqual({ x: 5, y: 5 })
      expect(apple.type).toBe('regular')
      expect(apple.points).toBe(10)
    })

    it('should have correct properties for gold apple', () => {
      const apple: Apple = {
        position: { x: 15, y: 15 },
        type: 'gold',
        points: 50,
      }
      
      expect(apple.position).toEqual({ x: 15, y: 15 })
      expect(apple.type).toBe('gold')
      expect(apple.points).toBe(50)
    })
  })

  describe('Direction type', () => {
    it('should accept valid direction values', () => {
      const up: Direction = 'UP'
      const down: Direction = 'DOWN'
      const left: Direction = 'LEFT'
      const right: Direction = 'RIGHT'
      
      expect(up).toBe('UP')
      expect(down).toBe('DOWN')
      expect(left).toBe('LEFT')
      expect(right).toBe('RIGHT')
    })
  })

  describe('GameState interface', () => {
    it('should have all required properties', () => {
      const gameState: GameState = {
        snake: [{ x: 12, y: 12 }],
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
      
      expect(gameState.snake).toEqual([{ x: 12, y: 12 }])
      expect(gameState.direction).toBe('DOWN')
      expect(gameState.nextDirection).toBe('DOWN')
      expect(gameState.apple).toBeNull()
      expect(gameState.score).toBe(0)
      expect(gameState.gameOver).toBe(false)
      expect(gameState.gameStarted).toBe(false)
      expect(gameState.speed).toBe(500)
      expect(gameState.gridSize).toBe(20)
      expect(gameState.boardWidth).toBe(25)
      expect(gameState.boardHeight).toBe(25)
    })

    it('should allow apple to be null or Apple object', () => {
      const stateWithoutApple: GameState = {
        snake: [{ x: 12, y: 12 }],
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
      
      const stateWithApple: GameState = {
        ...stateWithoutApple,
        apple: {
          position: { x: 10, y: 10 },
          type: 'regular',
          points: 10,
        },
      }
      
      expect(stateWithoutApple.apple).toBeNull()
      expect(stateWithApple.apple).not.toBeNull()
      expect(stateWithApple.apple?.type).toBe('regular')
    })
  })

  describe('GameActions interface', () => {
    it('should define all required action methods', () => {
      // This test ensures the interface structure is correct
      const actions: GameActions = {
        startGame: () => {},
        resetGame: () => {},
        moveSnake: () => {},
        changeDirection: () => {},
        generateApple: () => {},
        checkCollision: () => false,
        checkAppleCollision: () => false,
        increaseSpeed: () => {},
      }
      
      expect(typeof actions.startGame).toBe('function')
      expect(typeof actions.resetGame).toBe('function')
      expect(typeof actions.moveSnake).toBe('function')
      expect(typeof actions.changeDirection).toBe('function')
      expect(typeof actions.generateApple).toBe('function')
      expect(typeof actions.checkCollision).toBe('function')
      expect(typeof actions.checkAppleCollision).toBe('function')
      expect(typeof actions.increaseSpeed).toBe('function')
    })
  })
})