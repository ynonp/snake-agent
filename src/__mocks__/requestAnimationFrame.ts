import { vi } from 'vitest'

// Mock requestAnimationFrame and cancelAnimationFrame
export const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  return setTimeout(callback, 16)
})

export const cancelAnimationFrame = vi.fn((id: number) => {
  clearTimeout(id)
})

// For testing, we can manually control timing
export const mockAnimationFrame = () => {
  const callbacks: Array<FrameRequestCallback> = []
  let currentId = 0
  
  const mockRequest = vi.fn((callback: FrameRequestCallback) => {
    const id = currentId++
    callbacks[id] = callback
    return id
  })
  
  const mockCancel = vi.fn((id: number) => {
    delete callbacks[id]
  })
  
  const executeCallbacks = (timestamp: number = Date.now()) => {
    Object.values(callbacks).forEach(callback => {
      if (callback) callback(timestamp)
    })
  }
  
  return {
    requestAnimationFrame: mockRequest,
    cancelAnimationFrame: mockCancel,
    executeCallbacks,
  }
}