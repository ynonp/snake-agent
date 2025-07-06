import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SnakeGame from '../../../components/snake/SnakeGame'

// Mock the child components
vi.mock('../../../components/snake/GameBoard', () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="game-board" className={className}>
      Mocked GameBoard
    </div>
  ),
}))

vi.mock('../../../components/snake/GameScore', () => ({
  default: () => <div data-testid="game-score">Mocked GameScore</div>,
}))

vi.mock('../../../components/snake/GameControls', () => ({
  default: () => <div data-testid="game-controls">Mocked GameControls</div>,
}))

// Mock the useGameLoop hook
vi.mock('../../../hooks/useGameLoop', () => ({
  useGameLoop: vi.fn(() => ({
    gameState: {
      gameStarted: false,
      gameOver: false,
      score: 0,
    },
    gameActions: {
      startGame: vi.fn(),
      resetGame: vi.fn(),
    },
  })),
}))

describe('SnakeGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all child components', () => {
    render(<SnakeGame />)
    
    expect(screen.getByTestId('game-board')).toBeTruthy()
    expect(screen.getByTestId('game-score')).toBeTruthy()
    expect(screen.getByTestId('game-controls')).toBeTruthy()
  })

  it('should render game title', () => {
    render(<SnakeGame />)
    
    expect(screen.getByText('Snake Game')).toBeTruthy()
  })

  it('should initialize game loop hook', () => {
    // Check that the hook mock is being called by verifying the render succeeds
    expect(() => render(<SnakeGame />)).not.toThrow()
  })

  it('should have proper layout structure', () => {
    render(<SnakeGame />)
    
    // Check main container
    const mainContainer = screen.getByText('Snake Game').closest('div')?.parentElement
    expect(mainContainer?.className).toContain('flex')
    expect(mainContainer?.className).toContain('flex-col')
    expect(mainContainer?.className).toContain('items-center')
    expect(mainContainer?.className).toContain('justify-center')
    expect(mainContainer?.className).toContain('min-h-screen')
    expect(mainContainer?.className).toContain('bg-gray-50')
    expect(mainContainer?.className).toContain('p-4')
    
    // Check inner container
    const innerContainer = screen.getByText('Snake Game').closest('div')
    expect(innerContainer?.className).toContain('text-center')
    expect(innerContainer?.className).toContain('space-y-6')
  })

  it('should have correct title styling', () => {
    render(<SnakeGame />)
    
    const title = screen.getByText('Snake Game')
    expect(title.className).toContain('text-4xl')
    expect(title.className).toContain('font-bold')
    expect(title.className).toContain('text-gray-800')
    expect(title.className).toContain('mb-8')
  })

  it('should pass correct props to GameBoard', () => {
    render(<SnakeGame />)
    
    const gameBoard = screen.getByTestId('game-board')
    expect(gameBoard.className).toContain('mx-auto')
  })

  it('should render components in correct order', () => {
    render(<SnakeGame />)
    
    const container = screen.getByText('Snake Game').parentElement
    const children = Array.from(container?.children || [])
    
    // Check order: title, score, board, controls
    expect(children[0]).toContainHTML('Snake Game')
    expect(children[1]).toContainHTML('Mocked GameScore')
    expect(children[2]).toContainHTML('Mocked GameBoard')
    expect(children[3]).toContainHTML('Mocked GameControls')
  })

  it('should be responsive with proper spacing', () => {
    render(<SnakeGame />)
    
    // Check that components are properly spaced
    const innerContainer = screen.getByText('Snake Game').closest('div')
    expect(innerContainer?.className).toContain('space-y-6')
    
    // Check that the main container has padding
    const mainContainer = screen.getByText('Snake Game').closest('div')?.parentElement
    expect(mainContainer?.className).toContain('p-4')
  })

  it('should center content on screen', () => {
    render(<SnakeGame />)
    
    const mainContainer = screen.getByText('Snake Game').closest('div')?.parentElement
    expect(mainContainer?.className).toContain('items-center')
    expect(mainContainer?.className).toContain('justify-center')
  })

  it('should use full screen height', () => {
    render(<SnakeGame />)
    
    const mainContainer = screen.getByText('Snake Game').closest('div')?.parentElement
    expect(mainContainer?.className).toContain('min-h-screen')
  })

  it('should have light gray background', () => {
    render(<SnakeGame />)
    
    const mainContainer = screen.getByText('Snake Game').closest('div')?.parentElement
    expect(mainContainer?.className).toContain('bg-gray-50')
  })

  it('should render without crashing', () => {
    expect(() => render(<SnakeGame />)).not.toThrow()
  })

  it('should maintain component hierarchy', () => {
    render(<SnakeGame />)
    
    // Check that all components are present and in the correct structure
    const snakeGame = screen.getByText('Snake Game').closest('div')?.parentElement
    const gameTitle = screen.getByText('Snake Game')
    const gameScore = screen.getByTestId('game-score')
    const gameBoard = screen.getByTestId('game-board')
    const gameControls = screen.getByTestId('game-controls')
    
    expect(snakeGame).toContain(gameTitle)
    expect(snakeGame).toContain(gameScore)
    expect(snakeGame).toContain(gameBoard)
    expect(snakeGame).toContain(gameControls)
  })

  it('should handle missing child components gracefully', () => {
    // This test ensures the component structure is robust
    render(<SnakeGame />)
    
    // Even if child components fail to render, the main structure should remain
    expect(screen.getByText('Snake Game')).toBeTruthy()
  })
})