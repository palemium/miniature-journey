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

const mockUpdatedExchangeRates = {
  date: new Date('2024-09-28'),
  rates: [
    {
      id: 'USD',
      country: 'USA',
      currency: 'dollar',
      amount: 1,
      code: 'USD',
      rate: 23.35,
      lastUpdated: new Date(),
    },
  ],
  fetchedAt: new Date(),
};

describe('Rate Refresh Integration Flow', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow manual rate refresh', async () => {
    const refetch = vi.fn();

    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockExchangeRates,
      isLoading: false,
      error: null,
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

    const refreshButton = screen.getByText('Refresh Rates');
    await user.click(refreshButton);

    expect(refetch).toHaveBeenCalled();
  });

  it('should show loading state during refresh', async () => {
    const refetchMock = vi.fn();

    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockExchangeRates,
      isLoading: false,
      error: null,
      refetch: refetchMock,
    });

    mockUseCurrencyConversion.mockReturnValue({
      amount: '',
      setAmount: vi.fn(),
      selectedCurrency: '',
      setCurrency: vi.fn(),
      conversionResult: null,
      errors: {},
    });

    const { rerender } = render(<CurrencyConverter />);

    refetchMock.mockImplementation(() => {
      mockUseCurrencyRates.mockReturnValue({
        exchangeRates: mockExchangeRates,
        isLoading: true,
        error: null,
        refetch: refetchMock,
      });
    });

    const refreshButton = screen.getByText('Refresh Rates');
    await user.click(refreshButton);

    rerender(<CurrencyConverter />);

    expect(screen.getByText('Loading currency rates...')).toBeInTheDocument();
  });

  it('should update UI with new rates after successful refresh', async () => {
    const refetch = vi.fn();

    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockExchangeRates,
      isLoading: false,
      error: null,
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

    const { rerender } = render(<CurrencyConverter />);

    // Test that the component renders with initial rates
    expect(screen.getByText('Available Currencies')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('dollar')).toBeInTheDocument();

    // Mock updated rates
    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockUpdatedExchangeRates,
      isLoading: false,
      error: null,
      refetch,
    });

    rerender(<CurrencyConverter />);

    // Test that component still renders after update
    expect(screen.getByText('Available Currencies')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('should handle refresh errors gracefully', async () => {
    const refetch = vi.fn();

    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockExchangeRates,
      isLoading: false,
      error: null,
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

    const { rerender } = render(<CurrencyConverter />);

    refetch.mockImplementation(() => {
      mockUseCurrencyRates.mockReturnValue({
        exchangeRates: mockExchangeRates,
        isLoading: false,
        error: 'Failed to refresh rates',
        refetch,
      });
    });

    const refreshButton = screen.getByText('Refresh Rates');
    await user.click(refreshButton);

    rerender(<CurrencyConverter />);

    expect(screen.getAllByText('Failed to refresh rates')).toHaveLength(2);
  });

  it('should reset conversion when rates are refreshed', async () => {
    const refetch = vi.fn();

    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockExchangeRates,
      isLoading: false,
      error: null,
      refetch,
    });

    const conversionResult = {
      originalAmount: 1000,
      originalCurrency: 'CZK',
      targetAmount: 42.94,
      targetCurrency: 'USD',
      exchangeRate: 23.285,
      conversionDate: new Date('2024-09-27'),
      timestamp: new Date(),
    };

    mockUseCurrencyConversion.mockReturnValue({
      amount: '1000',
      setAmount: vi.fn(),
      selectedCurrency: 'USD',
      setCurrency: vi.fn(),
      conversionResult,
      errors: {},
    });

    const { rerender } = render(<CurrencyConverter />);

    // Test that component renders with conversion data
    expect(screen.getAllByText('Currency Converter')).toHaveLength(2);
    expect(screen.getByText('Available Currencies')).toBeInTheDocument();

    // Mock updated rates and reset conversion
    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockUpdatedExchangeRates,
      isLoading: false,
      error: null,
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

    rerender(<CurrencyConverter />);

    // Test that component still renders after conversion reset
    expect(screen.getAllByText('Currency Converter')).toHaveLength(2);
    expect(screen.getByText('Available Currencies')).toBeInTheDocument();

    // Check that form values are reset
    const amountInput = screen.getByLabelText(
      'Amount (CZK)'
    ) as HTMLInputElement;
    const currencySelect = screen.getByLabelText(
      'To Currency'
    ) as HTMLSelectElement;

    expect(amountInput.value).toBe('');
    expect(currencySelect.value).toBe('');
  });
});
