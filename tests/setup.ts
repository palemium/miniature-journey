import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import React from 'react';

// Mock global fetch
Object.defineProperty(globalThis, 'fetch', {
  value: vi.fn(),
  writable: true,
});

// Mock styled-components with proper factory function
vi.mock('styled-components', () => {
  const createStyledComponent = (tag: string) => {
    return () => {
      const MockComponent = ({ children, ...props }: any) => {
        // Filter out styled-components specific props and props starting with $
        const filteredProps = { ...props };
        delete filteredProps.hasError;
        delete filteredProps.$marginTop;
        delete filteredProps.$marginBottom;
        delete filteredProps.$padding;
        delete filteredProps.variant;
        delete filteredProps.size;

        // Remove any props that start with $ (styled-components transient props)
        Object.keys(filteredProps).forEach(key => {
          if (key.startsWith('$')) {
            delete filteredProps[key];
          }
        });

        return React.createElement(
          tag,
          {
            ...filteredProps,
            className: props.className || 'styled-component',
            'data-testid': props['data-testid'] || 'styled-component',
          },
          children
        );
      };
      return MockComponent;
    };
  };

  const styled = new Proxy(createStyledComponent, {
    get: (target, prop) => {
      if (prop === 'default') return target;
      if (typeof prop === 'string') return target(prop);
      return target(prop.toString());
    },
  }) as any;

  return {
    default: styled,
    createGlobalStyle: () => () => null,
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

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
});

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});
