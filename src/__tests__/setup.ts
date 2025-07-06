import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  return setTimeout(cb, 16) // 16ms ≈ 60fps
})

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id)
})

// Mock Math.random for consistent testing
const mockRandom = vi.fn(() => 0.5)
vi.spyOn(Math, 'random').mockImplementation(mockRandom)

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  mockRandom.mockReturnValue(0.5)
  
  // Ensure global animation frame functions are available
  global.requestAnimationFrame = vi.fn((cb) => {
    return setTimeout(cb, 16)
  })
  
  global.cancelAnimationFrame = vi.fn((id) => {
    clearTimeout(id)
  })
})