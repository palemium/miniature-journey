import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { ConversionForm } from '@/components/ConversionForm'

describe('ConversionForm Component', () => {
  const mockCurrencies = [
    {
      id: 'USD',
      country: 'USA',
      currency: 'dollar',
      amount: 1,
      code: 'USD',
      rate: 23.285,
      lastUpdated: new Date()
    },
    {
      id: 'EUR',
      country: 'EMU',
      currency: 'euro',
      amount: 1,
      code: 'EUR',
      rate: 25.285,
      lastUpdated: new Date()
    }
  ]

  const mockOnConvert = vi.fn()

  beforeEach(() => {
    mockOnConvert.mockClear()
  })

  it('should render form with amount input and currency dropdown', () => {
    render(
      <ConversionForm
        availableCurrencies={mockCurrencies}
        onConvert={mockOnConvert}
      />
    )

    expect(screen.getByLabelText('Amount in CZK')).toBeInTheDocument()
    expect(screen.getByLabelText('Convert to')).toBeInTheDocument()
    expect(screen.getByText('Convert')).toBeInTheDocument()
  })

  it('should validate amount input', async () => {
    const user = userEvent.setup()
    render(
      <ConversionForm
        availableCurrencies={mockCurrencies}
        onConvert={mockOnConvert}
      />
    )

    const amountInput = screen.getByLabelText('Amount in CZK')
    await user.type(amountInput, '-100')

    expect(screen.getByText('Amount must be positive')).toBeInTheDocument()
  })

  it('should call onConvert with correct parameters', async () => {
    const user = userEvent.setup()
    render(
      <ConversionForm
        availableCurrencies={mockCurrencies}
        onConvert={mockOnConvert}
      />
    )

    const amountInput = screen.getByLabelText('Amount in CZK')
    const currencySelect = screen.getByLabelText('Convert to')
    const convertButton = screen.getByText('Convert')

    await user.type(amountInput, '1000')
    await user.selectOptions(currencySelect, 'USD')
    await user.click(convertButton)

    expect(mockOnConvert).toHaveBeenCalledWith({
      amountCZK: 1000,
      targetCurrency: 'USD',
      timestamp: expect.any(Date)
    })
  })

  it('should handle loading state', () => {
    render(
      <ConversionForm
        availableCurrencies={mockCurrencies}
        onConvert={mockOnConvert}
        isLoading={true}
      />
    )

    expect(screen.getByText('Converting...')).toBeInTheDocument()
    expect(screen.getByText('Convert')).toBeDisabled()
  })
})