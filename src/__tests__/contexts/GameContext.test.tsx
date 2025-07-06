import { describe, it, expect, vi } from 'vitest'
import { render, screen, renderHook } from '@testing-library/react'
import { GameProvider, useGame } from '../../contexts/GameContext'
import { gameStore, gameActions } from '../../store/gameStore'

// Mock the store
vi.mock('../../store/gameStore', () => ({
  gameStore: {
    gameStarted: false,
    gameOver: false,
    score: 0,
    snake: [{ x: 12, y: 12 }],
    direction: 'DOWN',
    nextDirection: 'DOWN',
    apple: null,
    speed: 500,
    gridSize: 20,
    boardWidth: 25,
    boardHeight: 25,
  },
  gameActions: {
    startGame: vi.fn(),
    resetGame: vi.fn(),
    moveSnake: vi.fn(),
    changeDirection: vi.fn(),
    generateApple: vi.fn(),
    checkCollision: vi.fn(),
    checkAppleCollision: vi.fn(),
    increaseSpeed: vi.fn(),
  },
}))

describe('GameContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GameProvider', () => {
    it('should provide game state and actions to children', () => {
      const TestComponent = () => {
        const { gameState, gameActions: actions } = useGame()
        return (
          <div>
            <div data-testid="game-started">{gameState.gameStarted.toString()}</div>
            <div data-testid="game-over">{gameState.gameOver.toString()}</div>
            <div data-testid="score">{gameState.score}</div>
            <div data-testid="actions-available">
              {typeof actions.startGame === 'function' ? 'true' : 'false'}
            </div>
          </div>
        )
      }
      
      render(
        <GameProvider>
          <TestComponent />
        </GameProvider>
      )
      
      expect(screen.getByTestId('game-started')).toHaveTextContent('false')
      expect(screen.getByTestId('game-over')).toHaveTextContent('false')
      expect(screen.getByTestId('score')).toHaveTextContent('0')
      expect(screen.getByTestId('actions-available')).toHaveTextContent('true')
    })

    it('should allow nested components to access context', () => {
      const NestedComponent = () => {
        const { gameState } = useGame()
        return <div data-testid="nested-score">{gameState.score}</div>
      }
      
      const ParentComponent = () => {
        return (
          <div>
            <NestedComponent />
          </div>
        )
      }
      
      render(
        <GameProvider>
          <ParentComponent />
        </GameProvider>
      )
      
      expect(screen.getByTestId('nested-score')).toHaveTextContent('0')
    })

    it('should provide all game state properties', () => {
      const TestComponent = () => {
        const { gameState } = useGame()
        return (
          <div>
            <div data-testid="snake-length">{gameState.snake.length}</div>
            <div data-testid="direction">{gameState.direction}</div>
            <div data-testid="speed">{gameState.speed}</div>
            <div data-testid="board-width">{gameState.boardWidth}</div>
            <div data-testid="board-height">{gameState.boardHeight}</div>
            <div data-testid="grid-size">{gameState.gridSize}</div>
          </div>
        )
      }
      
      render(
        <GameProvider>
          <TestComponent />
        </GameProvider>
      )
      
      expect(screen.getByTestId('snake-length')).toHaveTextContent('1')
      expect(screen.getByTestId('direction')).toHaveTextContent('DOWN')
      expect(screen.getByTestId('speed')).toHaveTextContent('500')
      expect(screen.getByTestId('board-width')).toHaveTextContent('25')
      expect(screen.getByTestId('board-height')).toHaveTextContent('25')
      expect(screen.getByTestId('grid-size')).toHaveTextContent('20')
    })

    it('should provide all game actions', () => {
      const TestComponent = () => {
        const { gameActions: actions } = useGame()
        return (
          <div>
            <div data-testid="start-game">{typeof actions.startGame}</div>
            <div data-testid="reset-game">{typeof actions.resetGame}</div>
            <div data-testid="move-snake">{typeof actions.moveSnake}</div>
            <div data-testid="change-direction">{typeof actions.changeDirection}</div>
            <div data-testid="generate-apple">{typeof actions.generateApple}</div>
            <div data-testid="check-collision">{typeof actions.checkCollision}</div>
            <div data-testid="check-apple-collision">{typeof actions.checkAppleCollision}</div>
            <div data-testid="increase-speed">{typeof actions.increaseSpeed}</div>
          </div>
        )
      }
      
      render(
        <GameProvider>
          <TestComponent />
        </GameProvider>
      )
      
      expect(screen.getByTestId('start-game')).toHaveTextContent('function')
      expect(screen.getByTestId('reset-game')).toHaveTextContent('function')
      expect(screen.getByTestId('move-snake')).toHaveTextContent('function')
      expect(screen.getByTestId('change-direction')).toHaveTextContent('function')
      expect(screen.getByTestId('generate-apple')).toHaveTextContent('function')
      expect(screen.getByTestId('check-collision')).toHaveTextContent('function')
      expect(screen.getByTestId('check-apple-collision')).toHaveTextContent('function')
      expect(screen.getByTestId('increase-speed')).toHaveTextContent('function')
    })

    it('should update context when game state changes', () => {
      const TestComponent = () => {
        const { gameState } = useGame()
        return (
          <div>
            <div data-testid="dynamic-score">{gameState.score}</div>
            <div data-testid="dynamic-started">{gameState.gameStarted.toString()}</div>
          </div>
        )
      }
      
      const { rerender } = render(
        <GameProvider>
          <TestComponent />
        </GameProvider>
      )
      
      expect(screen.getByTestId('dynamic-score')).toHaveTextContent('0')
      expect(screen.getByTestId('dynamic-started')).toHaveTextContent('false')
      
      // Update game state
      gameStore.score = 100
      gameStore.gameStarted = true
      
      rerender(
        <GameProvider>
          <TestComponent />
        </GameProvider>
      )
      
      expect(screen.getByTestId('dynamic-score')).toHaveTextContent('100')
      expect(screen.getByTestId('dynamic-started')).toHaveTextContent('true')
    })
  })

  describe('useGame hook', () => {
    it('should throw error when used outside provider', () => {
      const TestComponent = () => {
        useGame()
        return <div>Should not render</div>
      }
      
      // Capture console.error to avoid test pollution
      const originalError = console.error
      console.error = vi.fn()
      
      expect(() => {
        render(<TestComponent />)
      }).toThrow('useGame must be used within a GameProvider')
      
      console.error = originalError
    })

    it('should return correct context value when used within provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GameProvider>{children}</GameProvider>
      )
      
      const { result } = renderHook(() => useGame(), { wrapper })
      
      expect(result.current.gameState).toBeDefined()
      expect(result.current.gameActions).toBeDefined()
      expect(result.current.gameState).toBe(gameStore)
      expect(result.current.gameActions).toBe(gameActions)
    })

    it('should provide stable references', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GameProvider>{children}</GameProvider>
      )
      
      const { result, rerender } = renderHook(() => useGame(), { wrapper })
      
      const firstGameState = result.current.gameState
      const firstGameActions = result.current.gameActions
      
      rerender()
      
      const secondGameState = result.current.gameState
      const secondGameActions = result.current.gameActions
      
      expect(firstGameState).toBe(secondGameState)
      expect(firstGameActions).toBe(secondGameActions)
    })
  })

  describe('Context Integration', () => {
    it('should allow multiple components to access the same context', () => {
      const Component1 = () => {
        const { gameState } = useGame()
        return <div data-testid="component1-score">{gameState.score}</div>
      }
      
      const Component2 = () => {
        const { gameState } = useGame()
        return <div data-testid="component2-score">{gameState.score}</div>
      }
      
      render(
        <GameProvider>
          <Component1 />
          <Component2 />
        </GameProvider>
      )
      
      expect(screen.getByTestId('component1-score')).toHaveTextContent('0')
      expect(screen.getByTestId('component2-score')).toHaveTextContent('0')
    })

    it('should work with deeply nested components', () => {
      const DeeplyNestedComponent = () => {
        const { gameState } = useGame()
        return <div data-testid="deeply-nested">{gameState.snake.length}</div>
      }
      
      const Level3 = () => <DeeplyNestedComponent />
      const Level2 = () => <Level3 />
      const Level1 = () => <Level2 />
      
      render(
        <GameProvider>
          <Level1 />
        </GameProvider>
      )
      
      expect(screen.getByTestId('deeply-nested')).toHaveTextContent('1')
    })

    it('should handle conditional rendering', () => {
      const ConditionalComponent = ({ show }: { show: boolean }) => {
        const { gameState } = useGame()
        return show ? <div data-testid="conditional">{gameState.score}</div> : null
      }
      
      const { rerender } = render(
        <GameProvider>
          <ConditionalComponent show={false} />
        </GameProvider>
      )
      
      expect(screen.queryByTestId('conditional')).toBeFalsy()
      
      rerender(
        <GameProvider>
          <ConditionalComponent show={true} />
        </GameProvider>
      )
      
      expect(screen.getByTestId('conditional')).toHaveTextContent('0')
    })
  })
})