import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ErrorMessage } from '@/components/ErrorMessage'

describe('ErrorMessage Component', () => {
  const mockOnDismiss = vi.fn()
  const mockOnRetry = vi.fn()

  beforeEach(() => {
    mockOnDismiss.mockClear()
    mockOnRetry.mockClear()
  })

  it('should display error message', () => {
    render(
      <ErrorMessage
        message="Network error"
        onDismiss={mockOnDismiss}
      />
    )

    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('should show retry button when showRetry is true', () => {
    render(
      <ErrorMessage
        message="Network error"
        showRetry={true}
        onRetry={mockOnRetry}
      />
    )

    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ErrorMessage
        message="Network error"
        showRetry={true}
        onRetry={mockOnRetry}
      />
    )

    const retryButton = screen.getByText('Retry')
    await user.click(retryButton)

    expect(mockOnRetry).toHaveBeenCalled()
  })

  it('should call onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ErrorMessage
        message="Network error"
        onDismiss={mockOnDismiss}
      />
    )

    const dismissButton = screen.getByText('Dismiss')
    await user.click(dismissButton)

    expect(mockOnDismiss).toHaveBeenCalled()
  })

  it('should apply different styles based on type', () => {
    const { rerender } = render(
      <ErrorMessage
        message="Warning message"
        type="warning"
        onDismiss={mockOnDismiss}
      />
    )

    expect(screen.getByRole('alert')).toHaveClass('warning')

    rerender(
      <ErrorMessage
        message="Info message"
        type="info"
        onDismiss={mockOnDismiss}
      />
    )

    expect(screen.getByRole('alert')).toHaveClass('info')
  })
})