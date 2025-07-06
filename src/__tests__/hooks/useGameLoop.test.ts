import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameLoop } from '../../hooks/useGameLoop'
import { gameStore, gameActions } from '../../store/gameStore'

// Mock the store
vi.mock('../../store/gameStore', () => ({
  gameStore: {
    gameStarted: false,
    gameOver: false,
    speed: 500,
    snake: [{ x: 12, y: 12 }],
    direction: 'DOWN',
    nextDirection: 'DOWN',
    apple: null,
    score: 0,
    gridSize: 20,
    boardWidth: 25,
    boardHeight: 25,
  },
  gameActions: {
    moveSnake: vi.fn(),
    startGame: vi.fn(),
    resetGame: vi.fn(),
    changeDirection: vi.fn(),
    generateApple: vi.fn(),
    checkCollision: vi.fn(),
    checkAppleCollision: vi.fn(),
    increaseSpeed: vi.fn(),
  },
}))

// Mock valtio
vi.mock('valtio', () => ({
  useSnapshot: vi.fn((state) => state),
}))

describe('useGameLoop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useFakeTimers()
    
    // Reset game state
    gameStore.gameStarted = false
    gameStore.gameOver = false
    gameStore.speed = 500
    
    // Mock window methods
    global.requestAnimationFrame = vi.fn()
    global.cancelAnimationFrame = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return game state and actions', () => {
    const { result } = renderHook(() => useGameLoop())
    
    expect(result.current.gameState).toBeDefined()
    expect(result.current.gameActions).toBeDefined()
    expect(result.current.gameActions).toBe(gameActions)
  })

  it('should start animation frame loop when game starts', () => {
    const { rerender } = renderHook(() => useGameLoop())
    
    expect(global.requestAnimationFrame).not.toHaveBeenCalled()
    
    // Start the game
    gameStore.gameStarted = true
    rerender()
    
    expect(global.requestAnimationFrame).toHaveBeenCalled()
  })

  it('should stop animation frame loop when game ends', () => {
    gameStore.gameStarted = true
    const { rerender } = renderHook(() => useGameLoop())
    
    // End the game
    gameStore.gameOver = true
    rerender()
    
    expect(global.cancelAnimationFrame).toHaveBeenCalled()
  })

  it('should handle keyboard events correctly', () => {
    renderHook(() => useGameLoop())
    
    // Test arrow key handling
    const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    const arrowLeftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    const arrowRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    
    gameStore.gameStarted = true
    gameStore.gameOver = false
    
    act(() => {
      window.dispatchEvent(arrowUpEvent)
    })
    expect(gameActions.changeDirection).toHaveBeenCalledWith('UP')
    
    act(() => {
      window.dispatchEvent(arrowDownEvent)
    })
    expect(gameActions.changeDirection).toHaveBeenCalledWith('DOWN')
    
    act(() => {
      window.dispatchEvent(arrowLeftEvent)
    })
    expect(gameActions.changeDirection).toHaveBeenCalledWith('LEFT')
    
    act(() => {
      window.dispatchEvent(arrowRightEvent)
    })
    expect(gameActions.changeDirection).toHaveBeenCalledWith('RIGHT')
  })

  it('should handle space key for starting game', () => {
    renderHook(() => useGameLoop())
    
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
    
    gameStore.gameStarted = false
    gameStore.gameOver = false
    
    act(() => {
      window.dispatchEvent(spaceEvent)
    })
    
    expect(gameActions.startGame).toHaveBeenCalled()
  })

  it('should handle space key for restarting game', () => {
    renderHook(() => useGameLoop())
    
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
    
    gameStore.gameStarted = false
    gameStore.gameOver = true
    
    act(() => {
      window.dispatchEvent(spaceEvent)
    })
    
    expect(gameActions.resetGame).toHaveBeenCalled()
  })

  it('should prevent default on handled keys', () => {
    renderHook(() => useGameLoop())
    
    const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
    
    const preventDefaultSpy = vi.spyOn(arrowUpEvent, 'preventDefault')
    const spacePreventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault')
    
    gameStore.gameStarted = true
    gameStore.gameOver = false
    
    act(() => {
      window.dispatchEvent(arrowUpEvent)
      window.dispatchEvent(spaceEvent)
    })
    
    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(spacePreventDefaultSpy).toHaveBeenCalled()
  })

  it('should not handle arrow keys when game is not started', () => {
    renderHook(() => useGameLoop())
    
    const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    
    gameStore.gameStarted = false
    gameStore.gameOver = false
    
    act(() => {
      window.dispatchEvent(arrowUpEvent)
    })
    
    expect(gameActions.changeDirection).not.toHaveBeenCalled()
  })

  it('should not handle arrow keys when game is over', () => {
    renderHook(() => useGameLoop())
    
    const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    
    gameStore.gameStarted = false
    gameStore.gameOver = true
    
    act(() => {
      window.dispatchEvent(arrowUpEvent)
    })
    
    expect(gameActions.changeDirection).not.toHaveBeenCalled()
  })

  it('should call moveSnake at correct intervals based on speed', () => {
    let animationCallback: ((timestamp: number) => void) | undefined
    
    global.requestAnimationFrame = vi.fn((callback) => {
      animationCallback = callback
      return 1
    })
    
    gameStore.gameStarted = true
    gameStore.gameOver = false
    gameStore.speed = 500
    
    renderHook(() => useGameLoop())
    
    expect(animationCallback).toBeDefined()
    
    // First call - should not move (no time elapsed)
    act(() => {
      animationCallback!(0)
    })
    expect(gameActions.moveSnake).not.toHaveBeenCalled()
    
    // Second call - should move (enough time elapsed)
    act(() => {
      animationCallback!(500)
    })
    expect(gameActions.moveSnake).toHaveBeenCalled()
  })

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useGameLoop())
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should cleanup animation frame on unmount', () => {
    gameStore.gameStarted = true
    
    const { unmount } = renderHook(() => useGameLoop())
    
    unmount()
    
    expect(global.cancelAnimationFrame).toHaveBeenCalled()
  })

  it('should not start game loop when game is not started', () => {
    gameStore.gameStarted = false
    gameStore.gameOver = false
    
    renderHook(() => useGameLoop())
    
    expect(global.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('should not start game loop when game is over', () => {
    gameStore.gameStarted = false
    gameStore.gameOver = true
    
    renderHook(() => useGameLoop())
    
    expect(global.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('should restart game loop when conditions change', () => {
    gameStore.gameStarted = false
    gameStore.gameOver = false
    
    const { rerender } = renderHook(() => useGameLoop())
    
    expect(global.requestAnimationFrame).not.toHaveBeenCalled()
    
    // Start game
    gameStore.gameStarted = true
    rerender()
    
    expect(global.requestAnimationFrame).toHaveBeenCalled()
  })
})