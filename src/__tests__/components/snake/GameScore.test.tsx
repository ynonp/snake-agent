import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import GameScore from '../../../components/snake/GameScore'
import { gameStore } from '../../../store/gameStore'

// Mock valtio
vi.mock('valtio', () => ({
  useSnapshot: vi.fn((state) => state),
}))

// Mock the game store
vi.mock('../../../store/gameStore', () => ({
  gameStore: {
    score: 0,
    snake: [{ x: 12, y: 12 }],
    speed: 500,
  },
}))

describe('GameScore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset game state
    gameStore.score = 0
    gameStore.snake = [{ x: 12, y: 12 }]
    gameStore.speed = 500
  })

  it('should display current score', () => {
    gameStore.score = 150
    
    render(<GameScore />)
    
    expect(screen.getByText('Score: 150')).toBeTruthy()
  })

  it('should display snake length', () => {
    gameStore.snake = [
      { x: 12, y: 12 },
      { x: 12, y: 13 },
      { x: 12, y: 14 },
    ]
    
    render(<GameScore />)
    
    expect(screen.getByText('Snake Length: 3')).toBeTruthy()
  })

  it('should display speed percentage calculation', () => {
    gameStore.speed = 500
    
    render(<GameScore />)
    
    // Speed percentage = ((600 - 500) / 550) * 100 = 18.18...% rounded to 18%
    expect(screen.getByText('Speed: 18%')).toBeTruthy()
  })

  it('should calculate speed percentage correctly for different speeds', () => {
    // Test with minimum speed (50ms)
    gameStore.speed = 50
    
    const { rerender } = render(<GameScore />)
    
    // Speed percentage = ((600 - 50) / 550) * 100 = 100%
    expect(screen.getByText('Speed: 100%')).toBeTruthy()
    
    // Test with maximum speed (600ms)
    gameStore.speed = 600
    rerender(<GameScore />)
    
    // Speed percentage = ((600 - 600) / 550) * 100 = 0%
    expect(screen.getByText('Speed: 0%')).toBeTruthy()
  })

  it('should calculate speed percentage correctly for mid-range speeds', () => {
    gameStore.speed = 325
    
    render(<GameScore />)
    
    // Speed percentage = ((600 - 325) / 550) * 100 = 50%
    expect(screen.getByText('Speed: 50%')).toBeTruthy()
  })

  it('should update when game state changes', () => {
    gameStore.score = 100
    gameStore.snake = [{ x: 12, y: 12 }, { x: 12, y: 13 }]
    gameStore.speed = 400
    
    const { rerender } = render(<GameScore />)
    
    expect(screen.getByText('Score: 100')).toBeTruthy()
    expect(screen.getByText('Snake Length: 2')).toBeTruthy()
    expect(screen.getByText('Speed: 36%')).toBeTruthy() // ((600-400)/550)*100 = 36.36% = 36%
    
    // Update state
    gameStore.score = 200
    gameStore.snake = [{ x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }]
    gameStore.speed = 300
    
    rerender(<GameScore />)
    
    expect(screen.getByText('Score: 200')).toBeTruthy()
    expect(screen.getByText('Snake Length: 3')).toBeTruthy()
    expect(screen.getByText('Speed: 55%')).toBeTruthy() // ((600-300)/550)*100 = 54.54% = 55%
  })

  it('should handle zero score', () => {
    gameStore.score = 0
    
    render(<GameScore />)
    
    expect(screen.getByText('Score: 0')).toBeTruthy()
  })

  it('should handle single snake segment', () => {
    gameStore.snake = [{ x: 12, y: 12 }]
    
    render(<GameScore />)
    
    expect(screen.getByText('Snake Length: 1')).toBeTruthy()
  })

  it('should handle large scores', () => {
    gameStore.score = 999999
    
    render(<GameScore />)
    
    expect(screen.getByText('Score: 999999')).toBeTruthy()
  })

  it('should handle long snake', () => {
    gameStore.snake = Array.from({ length: 100 }, (_, i) => ({ x: i, y: 0 }))
    
    render(<GameScore />)
    
    expect(screen.getByText('Snake Length: 100')).toBeTruthy()
  })

  it('should have correct styling classes', () => {
    render(<GameScore />)
    
    const container = screen.getByText('Score: 0').closest('div')
    expect(container).toBeTruthy()
    
    // Check for score styling
    const scoreElement = screen.getByText('Score: 0')
    expect(scoreElement.className).toContain('text-2xl')
    expect(scoreElement.className).toContain('font-bold')
    expect(scoreElement.className).toContain('text-gray-800')
    
    // Check for snake length styling
    const lengthElement = screen.getByText('Snake Length: 1')
    expect(lengthElement.className).toContain('text-sm')
    expect(lengthElement.className).toContain('text-gray-600')
    
    // Check for speed styling
    const speedElement = screen.getByText('Speed: 18%')
    expect(speedElement.className).toContain('text-sm')
    expect(speedElement.className).toContain('text-gray-600')
  })

  it('should render all score components', () => {
    gameStore.score = 75
    gameStore.snake = [{ x: 12, y: 12 }, { x: 12, y: 13 }]
    gameStore.speed = 450
    
    render(<GameScore />)
    
    // All three components should be visible
    expect(screen.getByText('Score: 75')).toBeTruthy()
    expect(screen.getByText('Snake Length: 2')).toBeTruthy()
    expect(screen.getByText('Speed: 27%')).toBeTruthy() // ((600-450)/550)*100 = 27.27% = 27%
  })

  it('should handle edge case speeds correctly', () => {
    // Test speed below minimum (should still calculate correctly)
    gameStore.speed = 25
    
    render(<GameScore />)
    
    // Speed percentage = ((600 - 25) / 550) * 100 = 104.54% = 105%
    expect(screen.getByText('Speed: 105%')).toBeTruthy()
  })
})