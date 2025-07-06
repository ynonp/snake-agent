import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GameControls from '../../../components/snake/GameControls'
import { gameStore, gameActions } from '../../../store/gameStore'

// Mock valtio
vi.mock('valtio', () => ({
  useSnapshot: vi.fn((state) => state),
}))

// Mock the game store
vi.mock('../../../store/gameStore', () => ({
  gameStore: {
    gameStarted: false,
    gameOver: false,
    score: 0,
  },
  gameActions: {
    startGame: vi.fn(),
    resetGame: vi.fn(),
  },
}))

describe('GameControls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset game state
    gameStore.gameStarted = false
    gameStore.gameOver = false
    gameStore.score = 0
  })

  describe('Before Game Start', () => {
    it('should show "Start Game" button', () => {
      gameStore.gameStarted = false
      gameStore.gameOver = false
      
      render(<GameControls />)
      
      expect(screen.getByText('Start Game')).toBeTruthy()
    })

    it('should show keyboard instructions', () => {
      gameStore.gameStarted = false
      gameStore.gameOver = false
      
      render(<GameControls />)
      
      expect(screen.getByText('Press Space to start or use arrow keys to move')).toBeTruthy()
    })

    it('should call startGame when button clicked', () => {
      gameStore.gameStarted = false
      gameStore.gameOver = false
      
      render(<GameControls />)
      
      const startButton = screen.getByText('Start Game')
      fireEvent.click(startButton)
      
      expect(gameActions.startGame).toHaveBeenCalled()
    })

    it('should have correct button styling for start game', () => {
      gameStore.gameStarted = false
      gameStore.gameOver = false
      
      render(<GameControls />)
      
      const startButton = screen.getByText('Start Game')
      expect(startButton.className).toContain('bg-green-600')
      expect(startButton.className).toContain('text-white')
      expect(startButton.className).toContain('font-semibold')
      expect(startButton.className).toContain('rounded-lg')
      expect(startButton.className).toContain('hover:bg-green-700')
    })
  })

  describe('During Game', () => {
    it('should show "Playing..." status', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = false
      
      render(<GameControls />)
      
      expect(screen.getByText('Playing...')).toBeTruthy()
    })

    it('should show control instructions', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = false
      
      render(<GameControls />)
      
      expect(screen.getByText('Use arrow keys to control the snake')).toBeTruthy()
    })

    it('should show apple scoring information', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = false
      
      render(<GameControls />)
      
      expect(screen.getByText('🍎 Red Apple: 10 points')).toBeTruthy()
      expect(screen.getByText('🌟 Gold Apple: 50 points')).toBeTruthy()
    })

    it('should have correct styling for playing status', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = false
      
      render(<GameControls />)
      
      const playingStatus = screen.getByText('Playing...')
      expect(playingStatus.className).toContain('text-lg')
      expect(playingStatus.className).toContain('font-semibold')
      expect(playingStatus.className).toContain('text-green-600')
    })

    it('should not show start game button during play', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = false
      
      render(<GameControls />)
      
      expect(screen.queryByText('Start Game')).toBeFalsy()
    })

    it('should not show game over elements during play', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = false
      
      render(<GameControls />)
      
      expect(screen.queryByText('Game Over!')).toBeFalsy()
      expect(screen.queryByText('Play Again')).toBeFalsy()
    })
  })

  describe('Game Over', () => {
    it('should show "Game Over!" message', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 100
      
      render(<GameControls />)
      
      expect(screen.getByText('Game Over!')).toBeTruthy()
    })

    it('should display final score', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 250
      
      render(<GameControls />)
      
      expect(screen.getByText('Final Score: 250')).toBeTruthy()
    })

    it('should show "Play Again" button', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 100
      
      render(<GameControls />)
      
      expect(screen.getByText('Play Again')).toBeTruthy()
    })

    it('should call resetGame when button clicked', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 100
      
      render(<GameControls />)
      
      const playAgainButton = screen.getByText('Play Again')
      fireEvent.click(playAgainButton)
      
      expect(gameActions.resetGame).toHaveBeenCalled()
    })

    it('should show restart instruction', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 100
      
      render(<GameControls />)
      
      expect(screen.getByText('Press Space to restart')).toBeTruthy()
    })

    it('should have correct styling for game over message', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 100
      
      render(<GameControls />)
      
      const gameOverMessage = screen.getByText('Game Over!')
      expect(gameOverMessage.className).toContain('text-xl')
      expect(gameOverMessage.className).toContain('font-bold')
      expect(gameOverMessage.className).toContain('text-red-600')
    })

    it('should have correct styling for final score', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 100
      
      render(<GameControls />)
      
      const finalScore = screen.getByText('Final Score: 100')
      expect(finalScore.className).toContain('text-lg')
      expect(finalScore.className).toContain('text-gray-700')
    })

    it('should have correct button styling for play again', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 100
      
      render(<GameControls />)
      
      const playAgainButton = screen.getByText('Play Again')
      expect(playAgainButton.className).toContain('bg-blue-600')
      expect(playAgainButton.className).toContain('text-white')
      expect(playAgainButton.className).toContain('font-semibold')
      expect(playAgainButton.className).toContain('rounded-lg')
      expect(playAgainButton.className).toContain('hover:bg-blue-700')
    })

    it('should display different scores correctly', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 0
      
      const { rerender } = render(<GameControls />)
      
      expect(screen.getByText('Final Score: 0')).toBeTruthy()
      
      gameStore.score = 9999
      rerender(<GameControls />)
      
      expect(screen.getByText('Final Score: 9999')).toBeTruthy()
    })

    it('should not show playing elements during game over', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 100
      
      render(<GameControls />)
      
      expect(screen.queryByText('Playing...')).toBeFalsy()
      expect(screen.queryByText('Use arrow keys to control the snake')).toBeFalsy()
    })

    it('should not show start game button during game over', () => {
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 100
      
      render(<GameControls />)
      
      expect(screen.queryByText('Start Game')).toBeFalsy()
    })
  })

  describe('Component Structure', () => {
    it('should have proper container styling', () => {
      render(<GameControls />)
      
      const outerContainer = screen.getByText('Start Game').closest('div')?.parentElement
      expect(outerContainer?.className).toContain('text-center')
      expect(outerContainer?.className).toContain('space-y-4')
    })

    it('should handle state transitions correctly', () => {
      gameStore.gameStarted = false
      gameStore.gameOver = false
      
      const { rerender } = render(<GameControls />)
      
      // Initial state
      expect(screen.getByText('Start Game')).toBeTruthy()
      
      // Start playing
      gameStore.gameStarted = true
      gameStore.gameOver = false
      rerender(<GameControls />)
      
      expect(screen.getByText('Playing...')).toBeTruthy()
      expect(screen.queryByText('Start Game')).toBeFalsy()
      
      // Game over (gameStarted remains true for game over state)
      gameStore.gameStarted = true
      gameStore.gameOver = true
      gameStore.score = 150
      rerender(<GameControls />)
      
      expect(screen.getByText('Game Over!')).toBeTruthy()
      expect(screen.getByText('Final Score: 150')).toBeTruthy()
      expect(screen.queryByText('Playing...')).toBeFalsy()
    })
  })
})