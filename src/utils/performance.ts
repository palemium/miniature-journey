// Performance utilities for the application

export interface PerformanceMetrics {
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
}

/**
 * Track Core Web Vitals
 */
export const trackWebVitals = (callback: (metrics: PerformanceMetrics) => void) => {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return
  }

  // First Contentful Paint
  const observerFCP = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    if (entries.length > 0) {
      const fcp = entries[0].startTime
      callback({ ...getMetrics(), firstContentfulPaint: fcp })
    }
  })
  observerFCP.observe({ entryTypes: ['paint'] })

  // Largest Contentful Paint
  const observerLCP = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    if (entries.length > 0) {
      const lcp = entries[entries.length - 1].startTime
      callback({ ...getMetrics(), largestContentfulPaint: lcp })
    }
  })
  observerLCP.observe({ entryTypes: ['largest-contentful-paint'] })

  // Cumulative Layout Shift
  let clsValue = 0
  const observerCLS = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value
      }
    }
    callback({ ...getMetrics(), cumulativeLayoutShift: clsValue })
  })
  observerCLS.observe({ entryTypes: ['layout-shift'] })

  // First Input Delay (FID is deprecated, use INP instead)
  const observerINP = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    if (entries.length > 0) {
      const inp = entries[0].duration
      callback({ ...getMetrics(), firstInputDelay: inp })
    }
  })
  observerINP.observe({ entryTypes: ['interaction'] })
}

/**
 * Get current performance metrics
 */
const getMetrics = (): PerformanceMetrics => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

  return {
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    timeToInteractive: navigation ? navigation.domInteractive - navigation.fetchStart : 0
  }
}

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Lazy load images
 */
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || img.src
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      })
    })

    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img)
    })
  }
}

/**
 * Preload critical resources
 */
export const preloadResources = (resources: string[]) => {
  resources.forEach((href) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = href.endsWith('.js') ? 'script' : 'style'
    link.href = href
    document.head.appendChild(link)
  })
}

/**
 * Cache API responses in memory
 */
export class APICache {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private maxAge: number

  constructor(maxAge: number = 600000) { // 10 minutes default
    this.maxAge = maxAge
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map()

  startTimer(label: string): void {
    this.metrics.set(label, performance.now())
  }

  endTimer(label: string): number {
    const startTime = this.metrics.get(label)
    if (!startTime) return 0

    const duration = performance.now() - startTime
    this.metrics.delete(label)

    // Log performance metrics in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log(`Performance: ${label} took ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(label)
    return fn().finally(() => this.endTimer(label))
  }

  measureSync<T>(label: string, fn: () => T): T {
    this.startTimer(label)
    try {
      return fn()
    } finally {
      this.endTimer(label)
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()