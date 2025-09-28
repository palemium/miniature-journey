import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { useCurrencyRates, useCurrencyConversion } from '@/hooks';

vi.mock('@/hooks/useCurrencyRates');
vi.mock('@/hooks/useCurrencyConversion');

const mockUseCurrencyRates = useCurrencyRates as ReturnType<
  typeof vi.mocked<typeof useCurrencyRates>
>;
const mockUseCurrencyConversion = useCurrencyConversion as ReturnType<
  typeof vi.mocked<typeof useCurrencyConversion>
>;

describe('Error Handling Integration Flow', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display network error message when rates fetch fails', () => {
    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: null,
      isLoading: false,
      error: 'Failed to fetch exchange rates',
      refetch: vi.fn(),
    });

    mockUseCurrencyConversion.mockReturnValue({
      amount: '',
      setAmount: vi.fn(),
      selectedCurrency: '',
      setCurrency: vi.fn(),
      conversionResult: null,
      errors: {},
    });

    render(<CurrencyConverter />);

    expect(screen.getAllByText('Failed to fetch exchange rates')).toHaveLength(
      2
    );
    expect(screen.getAllByText('Retry')).toHaveLength(2);
  });

  it('should allow retry after network error', async () => {
    const refetch = vi.fn();
    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: null,
      isLoading: false,
      error: 'Network error',
      refetch,
    });

    mockUseCurrencyConversion.mockReturnValue({
      amount: '',
      setAmount: vi.fn(),
      selectedCurrency: '',
      setCurrency: vi.fn(),
      conversionResult: null,
      errors: {},
    });

    render(<CurrencyConverter />);

    const retryButtons = screen.getAllByText('Retry');
    await user.click(retryButtons[0]);

    expect(refetch).toHaveBeenCalled();
  });

  it('should display validation errors for invalid amount', () => {
    const mockExchangeRates = {
      date: new Date('2024-09-27'),
      rates: [
        {
          id: 'USD',
          country: 'USA',
          currency: 'dollar',
          amount: 1,
          code: 'USD',
          rate: 23.285,
          lastUpdated: new Date(),
        },
      ],
      fetchedAt: new Date(),
    };

    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockExchangeRates,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseCurrencyConversion.mockReturnValue({
      amount: '-100',
      setAmount: vi.fn(),
      selectedCurrency: 'USD',
      setCurrency: vi.fn(),
      conversionResult: null,
      errors: { amount: 'Amount must be positive' },
    });

    render(<CurrencyConverter />);

    expect(screen.getByText('Amount must be positive')).toBeInTheDocument();
  });

  it('should display error when currency not found', () => {
    const mockExchangeRates = {
      date: new Date('2024-09-27'),
      rates: [
        {
          id: 'USD',
          country: 'USA',
          currency: 'dollar',
          amount: 1,
          code: 'USD',
          rate: 23.285,
          lastUpdated: new Date(),
        },
      ],
      fetchedAt: new Date(),
    };

    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockExchangeRates,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseCurrencyConversion.mockReturnValue({
      amount: '1000',
      setAmount: vi.fn(),
      selectedCurrency: 'INVALID',
      setCurrency: vi.fn(),
      conversionResult: null,
      errors: { currency: 'Currency not found' },
    });

    render(<CurrencyConverter />);

    expect(screen.getByText('Currency not found')).toBeInTheDocument();
  });

  it('should handle conversion calculation errors', () => {
    const mockExchangeRates = {
      date: new Date('2024-09-27'),
      rates: [
        {
          id: 'USD',
          country: 'USA',
          currency: 'dollar',
          amount: 1,
          code: 'USD',
          rate: 23.285,
          lastUpdated: new Date(),
        },
      ],
      fetchedAt: new Date(),
    };

    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockExchangeRates,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseCurrencyConversion.mockReturnValue({
      amount: '1000',
      setAmount: vi.fn(),
      selectedCurrency: 'USD',
      setCurrency: vi.fn(),
      conversionResult: null,
      errors: { conversion: 'Conversion calculation failed' },
    });

    render(<CurrencyConverter />);

    expect(
      screen.getByText('Conversion calculation failed')
    ).toBeInTheDocument();
  });
});
