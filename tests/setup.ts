import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import React from 'react'

// Mock global fetch
Object.defineProperty(globalThis, 'fetch', {
  value: vi.fn(),
  writable: true,
})

// Mock styled-components
vi.mock('styled-components', async () => {
  const actual = await vi.importActual<typeof import('styled-components')>('styled-components')
  return {
    ...actual,
    // Mock styled components to return regular divs for testing
    default: (tag: string) => {
      return (styles: TemplateStringsArray, ...interpolations: any[]) => {
        return ({ children, ...props }: any) => {
          // Return a simple div with className for testing
          return React.createElement(tag || 'div', {
            ...props,
            className: props.className || 'styled-component'
          }, children)
        }
      }
    },
    createGlobalStyle: () => {
      return () => null
    },
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  }
})

// Mock window.matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})