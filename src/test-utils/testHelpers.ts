import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { GameProvider } from '../contexts/GameContext'
import { vi } from 'vitest'

// Custom render function that includes providers
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <GameProvider>{children}</GameProvider>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Keyboard event simulation helpers
export const simulateKeyPress = (key: string, eventInit?: KeyboardEventInit) => {
  const event = new KeyboardEvent('keydown', {
    key,
    code: key,
    bubbles: true,
    cancelable: true,
    ...eventInit,
  })
  
  window.dispatchEvent(event)
  return event
}

export const simulateArrowKey = (direction: 'Up' | 'Down' | 'Left' | 'Right') => {
  return simulateKeyPress(`Arrow${direction}`)
}

export const simulateSpaceKey = () => {
  return simulateKeyPress(' ')
}

// Animation frame helpers
export const advanceAnimationFrame = (time: number = 16) => {
  vi.advanceTimersByTime(time)
}

export const mockAnimationFrame = () => {
  const callbacks: Array<() => void> = []
  
  const requestAnimationFrame = vi.fn((callback: () => void) => {
    callbacks.push(callback)
    return callbacks.length - 1
  })
  
  const cancelAnimationFrame = vi.fn((id: number) => {
    callbacks.splice(id, 1)
  })
  
  const executeCallbacks = () => {
    const currentCallbacks = [...callbacks]
    callbacks.length = 0
    currentCallbacks.forEach(callback => callback())
  }
  
  return {
    requestAnimationFrame,
    cancelAnimationFrame,
    executeCallbacks,
  }
}

// Mock Math.random for predictable testing
export const mockMathRandom = (value: number) => {
  const mockFn = vi.fn(() => value)
  vi.spyOn(Math, 'random').mockImplementation(mockFn)
  return mockFn
}

// Reset mock random to a specific sequence
export const mockRandomSequence = (values: number[]) => {
  let index = 0
  const mockFn = vi.fn(() => {
    const value = values[index % values.length]
    index++
    return value
  })
  vi.spyOn(Math, 'random').mockImplementation(mockFn)
  return mockFn
}

// Wait for state updates
export const waitForStateUpdate = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}