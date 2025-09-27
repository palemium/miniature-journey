// Accessibility utilities for the application

/**
 * Generate unique ID for accessible components
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Announce messages to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.setAttribute('aria-hidden', 'false')
  announcement.style.position = 'absolute'
  announcement.style.left = '-10000px'
  announcement.style.width = '1px'
  announcement.style.height = '1px'
  announcement.style.overflow = 'hidden'

  document.body.appendChild(announcement)
  announcement.textContent = message

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Trap focus within a container
 */
export const trapFocus = (container: HTMLElement): () => void => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>

  if (focusableElements.length === 0) return () => {}

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  // Focus first element
  firstElement.focus()

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Check if element is in viewport
 */
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Scroll element into view with accessibility considerations
 */
export const scrollToElement = (element: HTMLElement, behavior: 'smooth' | 'auto' = 'smooth'): void => {
  element.scrollIntoView({
    behavior,
    block: 'start',
    inline: 'nearest'
  })

  // Announce to screen readers
  announceToScreenReader(`Scrolled to ${element.getAttribute('aria-label') || 'element'}`)
}

/**
 * Manage keyboard navigation
 */
export const manageKeyboardNavigation = (
  element: HTMLElement,
  onEnter?: () => void,
  onSpace?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
): void => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        onEnter?.()
        break
      case ' ':
        e.preventDefault()
        onSpace?.()
        break
      case 'Escape':
        e.preventDefault()
        onEscape?.()
        break
      case 'ArrowUp':
        e.preventDefault()
        onArrowUp?.()
        break
      case 'ArrowDown':
        e.preventDefault()
        onArrowDown?.()
        break
      case 'ArrowLeft':
        e.preventDefault()
        onArrowLeft?.()
        break
      case 'ArrowRight':
        e.preventDefault()
        onArrowRight?.()
        break
    }
  }

  element.addEventListener('keydown', handleKeyDown)
}

/**
 * Set ARIA attributes dynamically
 */
export const setAriaAttributes = (element: HTMLElement, attributes: Record<string, string>): void => {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(`aria-${key}`, value)
  })
}

/**
 * Manage reduced motion preference
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get color scheme preference
 */
export const getColorSchemePreference = (): 'light' | 'dark' => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

/**
 * Check if high contrast mode is preferred
 */
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Accessibility hook for managing focus
 */
export const useFocusManagement = () => {
  const focusFirst = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }

  const focusLast = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus()
    }
  }

  const restoreFocus = (element: HTMLElement) => {
    element.focus()
  }

  return { focusFirst, focusLast, restoreFocus }
}

/**
 * Create accessible tooltips
 */
export const createAccessibleTooltip = (
  triggerElement: HTMLElement,
  tooltipElement: HTMLElement,
  _placement: 'top' | 'bottom' | 'left' | 'right' = 'top'
): (() => void) => {
  const tooltipId = generateId('tooltip')

  // Set ARIA attributes
  triggerElement.setAttribute('aria-describedby', tooltipId)
  tooltipElement.setAttribute('id', tooltipId)
  tooltipElement.setAttribute('role', 'tooltip')

  // Initially hide tooltip
  tooltipElement.style.display = 'none'

  const showTooltip = () => {
    tooltipElement.style.display = 'block'
    announceToScreenReader(tooltipElement.textContent || '')
  }

  const hideTooltip = () => {
    tooltipElement.style.display = 'none'
  }

  // Event listeners
  triggerElement.addEventListener('mouseenter', showTooltip)
  triggerElement.addEventListener('focus', showTooltip)
  triggerElement.addEventListener('mouseleave', hideTooltip)
  triggerElement.addEventListener('blur', hideTooltip)

  // Keyboard support
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      hideTooltip()
    }
  }

  triggerElement.addEventListener('keydown', handleKeyDown)

  return () => {
    triggerElement.removeEventListener('mouseenter', showTooltip)
    triggerElement.removeEventListener('focus', showTooltip)
    triggerElement.removeEventListener('mouseleave', hideTooltip)
    triggerElement.removeEventListener('blur', hideTooltip)
    triggerElement.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Skip to content link
 */
export const createSkipLink = (targetId: string): HTMLAnchorElement => {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = 'Skip to main content'
  skipLink.className = 'skip-link'
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #007bff;
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 0 0 4px 0;
    z-index: 1000;
  `

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0'
  })

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px'
  })

  return skipLink
}