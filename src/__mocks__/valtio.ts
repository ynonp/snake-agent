import { vi } from 'vitest'

// Mock valtio's proxy and snapshot
export const proxy = vi.fn((state) => {
  return new Proxy(state, {
    get(target, prop) {
      return target[prop]
    },
    set(target, prop, value) {
      target[prop] = value
      return true
    }
  })
})

export const snapshot = vi.fn((state) => state)

export const useSnapshot = vi.fn((state) => state)

// Mock ref for testing
export const ref = vi.fn((initialValue) => ({
  current: initialValue
}))

// Mock subscribe for testing
export const subscribe = vi.fn((state, callback) => {
  const unsubscribe = vi.fn()
  return unsubscribe
})