import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { CurrencyList } from '@/components/CurrencyList'

describe('CurrencyList Component', () => {
  const mockRates = [
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
    },
    {
      id: 'GBP',
      country: 'United Kingdom',
      currency: 'pound',
      amount: 1,
      code: 'GBP',
      rate: 30.285,
      lastUpdated: new Date()
    }
  ]

  const mockOnCurrencySelect = vi.fn()

  beforeEach(() => {
    mockOnCurrencySelect.mockClear()
  })

  it('should display loading state when isLoading is true', () => {
    render(
      <CurrencyList
        rates={[]}
        isLoading={true}
        error={null}
        onCurrencySelect={mockOnCurrencySelect}
      />
    )

    expect(screen.getByText('Loading exchange rates...')).toBeInTheDocument()
  })

  it('should display error message when error is provided', () => {
    render(
      <CurrencyList
        rates={[]}
        isLoading={false}
        error="Network error"
        onCurrencySelect={mockOnCurrencySelect}
      />
    )

    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('should display currency rates when data is available', () => {
    render(
      <CurrencyList
        rates={mockRates}
        isLoading={false}
        error={null}
        onCurrencySelect={mockOnCurrencySelect}
      />
    )

    expect(screen.getByText('USD - US Dollar')).toBeInTheDocument()
    expect(screen.getByText('EUR - Euro')).toBeInTheDocument()
    expect(screen.getByText('GBP - British Pound')).toBeInTheDocument()
    expect(screen.getByText('23.285 CZK')).toBeInTheDocument()
    expect(screen.getByText('25.285 CZK')).toBeInTheDocument()
    expect(screen.getByText('30.285 CZK')).toBeInTheDocument()
  })

  it('should handle search functionality', async () => {
    const user = userEvent.setup()
    render(
      <CurrencyList
        rates={mockRates}
        isLoading={false}
        error={null}
        onCurrencySelect={mockOnCurrencySelect}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search currencies...')
    await user.type(searchInput, 'USD')

    expect(screen.getByText('USD - US Dollar')).toBeInTheDocument()
    expect(screen.queryByText('EUR - Euro')).not.toBeInTheDocument()
    expect(screen.queryByText('GBP - British Pound')).not.toBeInTheDocument()
  })

  it('should handle currency selection', async () => {
    const user = userEvent.setup()
    render(
      <CurrencyList
        rates={mockRates}
        isLoading={false}
        error={null}
        onCurrencySelect={mockOnCurrencySelect}
        selectedCurrency="USD"
      />
    )

    const usdItem = screen.getByText('USD - US Dollar')
    await user.click(usdItem)

    expect(mockOnCurrencySelect).toHaveBeenCalledWith('USD')
  })

  it('should highlight selected currency', () => {
    render(
      <CurrencyList
        rates={mockRates}
        isLoading={false}
        error={null}
        onCurrencySelect={mockOnCurrencySelect}
        selectedCurrency="USD"
      />
    )

    const usdItem = screen.getByText('USD - US Dollar')
    expect(usdItem).toHaveAttribute('data-selected', 'true')
  })

  it('should handle sorting by code', async () => {
    const user = userEvent.setup()
    render(
      <CurrencyList
        rates={mockRates}
        isLoading={false}
        error={null}
        onCurrencySelect={mockOnCurrencySelect}
      />
    )

    const sortButton = screen.getByText('Code')
    await user.click(sortButton)

    const items = screen.getAllByText(/CZK$/)
    expect(items[0]).toHaveTextContent('23.285 CZK') // EUR should be first when sorted by code
  })
})