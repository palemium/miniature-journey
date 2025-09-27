import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ConversionResult } from '@/components/ConversionResult'

describe('ConversionResult Component', () => {
  const mockResult = {
    originalAmount: 1000,
    originalCurrency: 'CZK',
    targetAmount: 42.94,
    targetCurrency: 'USD',
    exchangeRate: 23.285,
    conversionDate: new Date('2024-09-27'),
    timestamp: new Date()
  }

  const mockOnConvertAgain = vi.fn()

  it('should display conversion result when result is provided', () => {
    render(
      <ConversionResult
        result={mockResult}
        onConvertAgain={mockOnConvertAgain}
      />
    )

    expect(screen.getByText('1,000.00 CZK = 42.94 USD')).toBeInTheDocument()
    expect(screen.getByText('Exchange rate: 1 USD = 23.285 CZK')).toBeInTheDocument()
    expect(screen.getByText('Rate date: Sep 27, 2024')).toBeInTheDocument()
  })

  it('should display loading state when isLoading is true', () => {
    render(
      <ConversionResult
        result={null}
        isLoading={true}
        onConvertAgain={mockOnConvertAgain}
      />
    )

    expect(screen.getByText('Converting...')).toBeInTheDocument()
  })

  it('should call onConvertAgain when button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ConversionResult
        result={mockResult}
        onConvertAgain={mockOnConvertAgain}
      />
    )

    const convertAgainButton = screen.getByText('Convert again')
    await user.click(convertAgainButton)

    expect(mockOnConvertAgain).toHaveBeenCalled()
  })

  it('should display error message when error is provided', () => {
    render(
      <ConversionResult
        result={null}
        error="Conversion failed"
        onConvertAgain={mockOnConvertAgain}
      />
    )

    expect(screen.getByText('Conversion failed')).toBeInTheDocument()
  })
})