import { describe, it, expect, beforeEach, vi } from 'vitest'
import { gameStore, gameActions } from '../../store/gameStore'
import { Direction, Position } from '../../types/game'

describe('Game Store', () => {
  beforeEach(() => {
    // Reset game state before each test
    gameActions.resetGame()
    vi.clearAllMocks()
    // Reset Math.random mock
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(gameStore.snake).toEqual([{ x: 12, y: 12 }])
      expect(gameStore.direction).toBe('DOWN')
      expect(gameStore.nextDirection).toBe('DOWN')
      expect(gameStore.score).toBe(0)
      expect(gameStore.gameOver).toBe(false)
      expect(gameStore.gameStarted).toBe(false)
      expect(gameStore.speed).toBe(500)
      expect(gameStore.gridSize).toBe(20)
      expect(gameStore.boardWidth).toBe(25)
      expect(gameStore.boardHeight).toBe(25)
    })

    it('should have snake at center position', () => {
      expect(gameStore.snake[0]).toEqual({ x: 12, y: 12 })
      expect(gameStore.snake.length).toBe(1)
    })

    it('should have initial direction as DOWN', () => {
      expect(gameStore.direction).toBe('DOWN')
      expect(gameStore.nextDirection).toBe('DOWN')
    })

    it('should have speed set to 500ms', () => {
      expect(gameStore.speed).toBe(500)
    })

    it('should have game not started and not over', () => {
      expect(gameStore.gameStarted).toBe(false)
      expect(gameStore.gameOver).toBe(false)
    })
  })

  describe('Game Actions', () => {
    describe('startGame()', () => {
      it('should set gameStarted to true', () => {
        gameActions.startGame()
        expect(gameStore.gameStarted).toBe(true)
      })

      it('should set gameOver to false', () => {
        gameStore.gameOver = true
        gameActions.startGame()
        expect(gameStore.gameOver).toBe(false)
      })

      it('should generate an apple', () => {
        gameActions.startGame()
        expect(gameStore.apple).not.toBeNull()
        expect(gameStore.apple?.position).toBeDefined()
        expect(gameStore.apple?.type).toBeDefined()
        expect(gameStore.apple?.points).toBeDefined()
      })
    })

    describe('resetGame()', () => {
      it('should reset all game state to initial values', () => {
        // Modify game state
        gameStore.score = 100
        gameStore.gameStarted = true
        gameStore.gameOver = true
        gameStore.speed = 200
        gameStore.snake = [{ x: 10, y: 10 }, { x: 11, y: 10 }]
        gameStore.direction = 'LEFT'
        gameStore.nextDirection = 'LEFT'

        gameActions.resetGame()

        expect(gameStore.score).toBe(0)
        expect(gameStore.gameStarted).toBe(false)
        expect(gameStore.gameOver).toBe(false)
        expect(gameStore.speed).toBe(500)
        expect(gameStore.snake).toEqual([{ x: 12, y: 12 }])
        expect(gameStore.direction).toBe('DOWN')
        expect(gameStore.nextDirection).toBe('DOWN')
      })

      it('should reset snake position to center', () => {
        gameStore.snake = [{ x: 20, y: 20 }]
        gameActions.resetGame()
        expect(gameStore.snake).toEqual([{ x: 12, y: 12 }])
      })

      it('should reset score to 0', () => {
        gameStore.score = 500
        gameActions.resetGame()
        expect(gameStore.score).toBe(0)
      })

      it('should generate a new apple', () => {
        gameActions.resetGame()
        expect(gameStore.apple).not.toBeNull()
      })
    })

    describe('changeDirection()', () => {
      it('should update nextDirection when valid', () => {
        gameStore.direction = 'DOWN'
        gameActions.changeDirection('LEFT')
        expect(gameStore.nextDirection).toBe('LEFT')
      })

      it('should prevent reverse direction - UP when going DOWN', () => {
        gameStore.direction = 'DOWN'
        gameActions.changeDirection('UP')
        expect(gameStore.nextDirection).toBe('DOWN') // Should remain unchanged
      })

      it('should prevent reverse direction - DOWN when going UP', () => {
        gameStore.direction = 'UP'
        gameStore.nextDirection = 'UP'
        gameActions.changeDirection('DOWN')
        expect(gameStore.nextDirection).toBe('UP') // Should remain unchanged
      })

      it('should prevent reverse direction - LEFT when going RIGHT', () => {
        gameStore.direction = 'RIGHT'
        gameStore.nextDirection = 'RIGHT'
        gameActions.changeDirection('LEFT')
        expect(gameStore.nextDirection).toBe('RIGHT') // Should remain unchanged
      })

      it('should prevent reverse direction - RIGHT when going LEFT', () => {
        gameStore.direction = 'LEFT'
        gameStore.nextDirection = 'LEFT'
        gameActions.changeDirection('RIGHT')
        expect(gameStore.nextDirection).toBe('LEFT') // Should remain unchanged
      })

      it('should allow perpendicular direction changes', () => {
        gameStore.direction = 'DOWN'
        gameActions.changeDirection('LEFT')
        expect(gameStore.nextDirection).toBe('LEFT')

        gameStore.direction = 'DOWN'
        gameActions.changeDirection('RIGHT')
        expect(gameStore.nextDirection).toBe('RIGHT')

        gameStore.direction = 'LEFT'
        gameActions.changeDirection('UP')
        expect(gameStore.nextDirection).toBe('UP')

        gameStore.direction = 'LEFT'
        gameActions.changeDirection('DOWN')
        expect(gameStore.nextDirection).toBe('DOWN')
      })
    })

    describe('moveSnake()', () => {
      it('should not move if game not started', () => {
        const originalSnake = [...gameStore.snake]
        gameStore.gameStarted = false
        gameActions.moveSnake()
        expect(gameStore.snake).toEqual(originalSnake)
      })

      it('should not move if game over', () => {
        const originalSnake = [...gameStore.snake]
        gameStore.gameOver = true
        gameActions.moveSnake()
        expect(gameStore.snake).toEqual(originalSnake)
      })

      it('should update snake direction to nextDirection', () => {
        gameStore.gameStarted = true
        gameStore.direction = 'DOWN'
        gameStore.nextDirection = 'LEFT'
        gameActions.moveSnake()
        expect(gameStore.direction).toBe('LEFT')
      })

      it('should move snake head DOWN', () => {
        gameStore.gameStarted = true
        gameStore.direction = 'DOWN'
        gameStore.nextDirection = 'DOWN'
        gameStore.snake = [{ x: 12, y: 12 }]
        gameActions.moveSnake()
        expect(gameStore.snake[0]).toEqual({ x: 12, y: 13 })
      })

      it('should move snake head UP', () => {
        gameStore.gameStarted = true
        gameStore.direction = 'UP'
        gameStore.nextDirection = 'UP'
        gameStore.snake = [{ x: 12, y: 12 }]
        gameActions.moveSnake()
        expect(gameStore.snake[0]).toEqual({ x: 12, y: 11 })
      })

      it('should move snake head LEFT', () => {
        gameStore.gameStarted = true
        gameStore.direction = 'LEFT'
        gameStore.nextDirection = 'LEFT'
        gameStore.snake = [{ x: 12, y: 12 }]
        gameActions.moveSnake()
        expect(gameStore.snake[0]).toEqual({ x: 11, y: 12 })
      })

      it('should move snake head RIGHT', () => {
        gameStore.gameStarted = true
        gameStore.direction = 'RIGHT'
        gameStore.nextDirection = 'RIGHT'
        gameStore.snake = [{ x: 12, y: 12 }]
        gameActions.moveSnake()
        expect(gameStore.snake[0]).toEqual({ x: 13, y: 12 })
      })

      it('should add new head to snake array', () => {
        gameStore.gameStarted = true
        gameStore.direction = 'DOWN'
        gameStore.snake = [{ x: 12, y: 12 }]
        const originalLength = gameStore.snake.length
        gameActions.moveSnake()
        expect(gameStore.snake.length).toBe(originalLength) // Length stays same when no apple
        expect(gameStore.snake[0]).toEqual({ x: 12, y: 13 })
      })

      it('should remove tail when no apple eaten', () => {
        gameStore.gameStarted = true
        gameStore.direction = 'DOWN'
        gameStore.snake = [{ x: 12, y: 12 }, { x: 12, y: 13 }]
        gameStore.apple = { position: { x: 10, y: 10 }, type: 'regular', points: 10 }
        gameActions.moveSnake()
        expect(gameStore.snake.length).toBe(2) // Should remain 2 (tail removed)
      })

      it('should keep tail when apple eaten', () => {
        gameStore.gameStarted = true
        gameStore.direction = 'DOWN'
        gameStore.snake = [{ x: 12, y: 12 }, { x: 12, y: 13 }]
        gameStore.apple = { position: { x: 12, y: 13 }, type: 'regular', points: 10 }
        
        // Mock the collision check to return true for the apple
        vi.spyOn(gameActions, 'checkAppleCollision').mockReturnValue(true)
        
        gameActions.moveSnake()
        expect(gameStore.snake.length).toBe(3) // Should grow
      })

      it('should end game when collision detected', () => {
        gameStore.gameStarted = true
        gameStore.direction = 'LEFT'
        gameStore.snake = [{ x: 0, y: 12 }] // At left wall
        
        // Mock the collision check to return true
        vi.spyOn(gameActions, 'checkCollision').mockReturnValue(true)
        
        gameActions.moveSnake()
        expect(gameStore.gameOver).toBe(true)
      })
    })

    describe('checkCollision()', () => {
      it('should return true when snake hits top wall', () => {
        const headPosition: Position = { x: 12, y: -1 }
        const collision = gameActions.checkCollision(headPosition)
        expect(collision).toBe(true)
      })

      it('should return true when snake hits bottom wall', () => {
        const headPosition: Position = { x: 12, y: 25 }
        const collision = gameActions.checkCollision(headPosition)
        expect(collision).toBe(true)
      })

      it('should return true when snake hits left wall', () => {
        const headPosition: Position = { x: -1, y: 12 }
        const collision = gameActions.checkCollision(headPosition)
        expect(collision).toBe(true)
      })

      it('should return true when snake hits right wall', () => {
        const headPosition: Position = { x: 25, y: 12 }
        const collision = gameActions.checkCollision(headPosition)
        expect(collision).toBe(true)
      })

      it('should return true when snake hits itself', () => {
        gameStore.snake = [
          { x: 12, y: 12 },
          { x: 12, y: 13 },
          { x: 12, y: 14 },
          { x: 11, y: 14 },
          { x: 11, y: 13 },
        ]
        const headPosition: Position = { x: 11, y: 13 } // Same as body segment
        const collision = gameActions.checkCollision(headPosition)
        expect(collision).toBe(true)
      })

      it('should return false when no collision', () => {
        gameStore.snake = [{ x: 12, y: 12 }]
        const headPosition: Position = { x: 12, y: 13 }
        const collision = gameActions.checkCollision(headPosition)
        expect(collision).toBe(false)
      })

      it('should use current snake head when no position provided', () => {
        gameStore.snake = [{ x: -1, y: 12 }] // At wall
        const collision = gameActions.checkCollision()
        expect(collision).toBe(true)
      })
    })

    describe('checkAppleCollision()', () => {
      it('should return true when snake head position matches apple position', () => {
        gameStore.apple = { position: { x: 12, y: 13 }, type: 'regular', points: 10 }
        const headPosition: Position = { x: 12, y: 13 }
        const collision = gameActions.checkAppleCollision(headPosition)
        expect(collision).toBe(true)
      })

      it('should return false when positions do not match', () => {
        gameStore.apple = { position: { x: 12, y: 13 }, type: 'regular', points: 10 }
        const headPosition: Position = { x: 10, y: 10 }
        const collision = gameActions.checkAppleCollision(headPosition)
        expect(collision).toBe(false)
      })

      it('should return false when no apple exists', () => {
        gameStore.apple = null
        const headPosition: Position = { x: 12, y: 13 }
        const collision = gameActions.checkAppleCollision(headPosition)
        expect(collision).toBe(false)
      })

      it('should use current snake head when no position provided', () => {
        gameStore.snake = [{ x: 12, y: 13 }]
        gameStore.apple = { position: { x: 12, y: 13 }, type: 'regular', points: 10 }
        const collision = gameActions.checkAppleCollision()
        expect(collision).toBe(true)
      })
    })

    describe('generateApple()', () => {
      it('should create apple at random position', () => {
        gameActions.generateApple()
        expect(gameStore.apple).not.toBeNull()
        expect(gameStore.apple?.position).toBeDefined()
        expect(typeof gameStore.apple?.position.x).toBe('number')
        expect(typeof gameStore.apple?.position.y).toBe('number')
      })

      it('should not place apple on snake body', () => {
        // Set up snake covering many positions
        gameStore.snake = [
          { x: 12, y: 12 },
          { x: 12, y: 13 },
          { x: 12, y: 14 },
        ]
        
        // Mock Math.random to return positions not on snake
        let callCount = 0
        vi.spyOn(Math, 'random').mockImplementation(() => {
          callCount++
          // First calls return positions on snake, later calls return safe positions
          if (callCount <= 4) {
            return 0.48 // This should generate x: 12, y: 12 (on snake)
          } else {
            return 0.4 // This should generate x: 10, y: 10 (not on snake)
          }
        })
        
        gameActions.generateApple()
        
        expect(gameStore.apple).not.toBeNull()
        const applePos = gameStore.apple?.position
        const onSnake = gameStore.snake.some(segment => 
          segment.x === applePos?.x && segment.y === applePos?.y
        )
        expect(onSnake).toBe(false)
      })

      it('should create regular apple with 10 points', () => {
        // Mock Math.random to return 0.5 (not < 0.2, so regular apple)
        vi.spyOn(Math, 'random').mockReturnValue(0.5)
        
        gameActions.generateApple()
        
        expect(gameStore.apple?.type).toBe('regular')
        expect(gameStore.apple?.points).toBe(10)
      })

      it('should create gold apple with 50 points', () => {
        // Mock Math.random to return 0.1 (< 0.2, so gold apple)
        vi.spyOn(Math, 'random').mockReturnValue(0.1)
        
        gameActions.generateApple()
        
        expect(gameStore.apple?.type).toBe('gold')
        expect(gameStore.apple?.points).toBe(50)
      })

      it('should set correct points for regular apple', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.9)
        gameActions.generateApple()
        expect(gameStore.apple?.points).toBe(10)
      })

      it('should set correct points for gold apple', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.05)
        gameActions.generateApple()
        expect(gameStore.apple?.points).toBe(50)
      })
    })

    describe('increaseSpeed()', () => {
      it('should decrease speed value (increase actual speed)', () => {
        gameStore.speed = 500
        gameActions.increaseSpeed()
        expect(gameStore.speed).toBe(495)
      })

      it('should not go below minimum speed (50ms)', () => {
        gameStore.speed = 50
        gameActions.increaseSpeed()
        expect(gameStore.speed).toBe(50)
      })

      it('should reduce speed by 5ms increments', () => {
        gameStore.speed = 200
        gameActions.increaseSpeed()
        expect(gameStore.speed).toBe(195)
        
        gameActions.increaseSpeed()
        expect(gameStore.speed).toBe(190)
      })

      it('should not go below 50ms even if current speed is close', () => {
        gameStore.speed = 52
        gameActions.increaseSpeed()
        expect(gameStore.speed).toBe(50)
      })
    })
  })
})