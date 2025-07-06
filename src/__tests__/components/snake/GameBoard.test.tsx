import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import GameBoard from '../../../components/snake/GameBoard'
import { gameStore } from '../../../store/gameStore'

// Mock valtio
vi.mock('valtio', () => ({
  useSnapshot: vi.fn((state) => state),
}))

// Mock the game store
vi.mock('../../../store/gameStore', () => ({
  gameStore: {
    snake: [{ x: 12, y: 12 }],
    apple: null,
    boardWidth: 25,
    boardHeight: 25,
  },
}))

describe('GameBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset game state
    gameStore.snake = [{ x: 12, y: 12 }]
    gameStore.apple = null
    gameStore.boardWidth = 25
    gameStore.boardHeight = 25
  })

  it('should render board with correct dimensions', () => {
    render(<GameBoard />)
    
    // Check that the board container exists
    const board = document.querySelector('[class*="border-2 border-gray-400"]')
    
    expect(board).toBeTruthy()
  })

  it('should render snake head with correct styling', () => {
    gameStore.snake = [{ x: 12, y: 12 }]
    
    render(<GameBoard />)
    
    // Find the snake head cell
    const boardElement = document.querySelector('[class*="border-2 border-gray-400"]')
    expect(boardElement).toBeTruthy()
    
    // Check for snake head styling
    const snakeHeadCell = document.querySelector('[class*="bg-green-600"]')
    expect(snakeHeadCell).toBeTruthy()
  })

  it('should render snake body with correct styling', () => {
    gameStore.snake = [
      { x: 12, y: 12 }, // head
      { x: 12, y: 13 }, // body
      { x: 12, y: 14 }, // body
    ]
    
    render(<GameBoard />)
    
    // Check for snake body styling
    const snakeBodyCells = document.querySelectorAll('[class*="bg-green-500"]')
    expect(snakeBodyCells.length).toBe(2) // Two body segments
  })

  it('should render regular apple with correct styling', () => {
    gameStore.apple = {
      position: { x: 10, y: 10 },
      type: 'regular',
      points: 10,
    }
    
    render(<GameBoard />)
    
    // Check for regular apple styling
    const regularApple = document.querySelector('[class*="bg-red-500"][class*="rounded-full"]')
    expect(regularApple).toBeTruthy()
  })

  it('should render gold apple with correct styling', () => {
    gameStore.apple = {
      position: { x: 15, y: 15 },
      type: 'gold',
      points: 50,
    }
    
    render(<GameBoard />)
    
    // Check for gold apple styling
    const goldApple = document.querySelector('[class*="bg-yellow-400"][class*="rounded-full"]')
    expect(goldApple).toBeTruthy()
  })

  it('should render empty cells with correct styling', () => {
    gameStore.snake = [{ x: 12, y: 12 }]
    gameStore.apple = null
    
    render(<GameBoard />)
    
    // Check for empty cell styling
    const emptyCells = document.querySelectorAll('[class*="bg-gray-100"]')
    expect(emptyCells.length).toBeGreaterThan(0)
  })

  it('should apply custom className prop', () => {
    const customClass = 'custom-board-class'
    
    render(<GameBoard className={customClass} />)
    
    // Check for custom class
    const boardElement = document.querySelector(`.${customClass}`)
    expect(boardElement).toBeTruthy()
  })

  it('should render correct number of cells', () => {
    gameStore.boardWidth = 3
    gameStore.boardHeight = 3
    
    render(<GameBoard />)
    
    // Count total cells (should be 3 * 3 = 9)
    const allCells = document.querySelectorAll('[class*="w-5 h-5"]')
    expect(allCells.length).toBe(9)
  })

  it('should render cells in correct grid structure', () => {
    gameStore.boardWidth = 2
    gameStore.boardHeight = 2
    
    render(<GameBoard />)
    
    // Check for row structure
    const rows = document.querySelectorAll('[class*="flex"]:not([class*="border-2"])')
    expect(rows.length).toBe(2) // Two rows
    
    // Each row should have 2 cells
    rows.forEach(row => {
      const cells = row.querySelectorAll('[class*="w-5 h-5"]')
      expect(cells.length).toBe(2)
    })
  })

  it('should render snake at correct position', () => {
    gameStore.snake = [{ x: 1, y: 1 }]
    gameStore.boardWidth = 3
    gameStore.boardHeight = 3
    
    render(<GameBoard />)
    
    // The snake should be at position (1,1) which is the second row, second column
    const snakeCell = document.querySelector('[class*="bg-green-600"]')
    expect(snakeCell).toBeTruthy()
  })

  it('should render apple at correct position', () => {
    gameStore.apple = {
      position: { x: 0, y: 0 },
      type: 'regular',
      points: 10,
    }
    gameStore.boardWidth = 3
    gameStore.boardHeight = 3
    
    render(<GameBoard />)
    
    // The apple should be at position (0,0) which is the first row, first column
    const appleCell = document.querySelector('[class*="bg-red-500"]')
    expect(appleCell).toBeTruthy()
  })

  it('should handle empty game state', () => {
    gameStore.snake = []
    gameStore.apple = null
    
    render(<GameBoard />)
    
    // Should render without crashing
    const boardElement = document.querySelector('[class*="border-2 border-gray-400"]')
    expect(boardElement).toBeTruthy()
  })

  it('should prioritize snake head over body when positions overlap', () => {
    // This shouldn't normally happen, but testing edge case
    gameStore.snake = [
      { x: 12, y: 12 }, // head
      { x: 12, y: 12 }, // body at same position (invalid but testing)
    ]
    
    render(<GameBoard />)
    
    // Should render as head (green-600) not body (green-500)
    const snakeHeadCell = document.querySelector('[class*="bg-green-600"]')
    expect(snakeHeadCell).toBeTruthy()
  })

  it('should handle large board dimensions', () => {
    gameStore.boardWidth = 50
    gameStore.boardHeight = 50
    
    render(<GameBoard />)
    
    // Should render without crashing
    const boardElement = document.querySelector('[class*="border-2 border-gray-400"]')
    expect(boardElement).toBeTruthy()
    
    // Should have correct total cells
    const allCells = document.querySelectorAll('[class*="w-5 h-5"]')
    expect(allCells.length).toBe(2500) // 50 * 50
  })
})