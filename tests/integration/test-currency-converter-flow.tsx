import { render, screen, waitFor } from '@testing-library/react';
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
    {
      id: 'EUR',
      country: 'EMU',
      currency: 'euro',
      amount: 1,
      code: 'EUR',
      rate: 25.285,
      lastUpdated: new Date(),
    },
  ],
  fetchedAt: new Date(),
};

describe('Currency Converter Integration Flow', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockExchangeRates,
      isLoading: false,
      error: null,
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
  });

  it('should display available currencies when data is loaded', async () => {
    render(<CurrencyConverter />);

    await waitFor(() => {
      expect(screen.getByText('USD - dollar')).toBeInTheDocument();
      expect(screen.getByText('EUR - euro')).toBeInTheDocument();
    });
  });

  it('should handle currency conversion flow', async () => {
    const setAmount = vi.fn();
    const setCurrency = vi.fn();
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
      setAmount,
      selectedCurrency: 'USD',
      setCurrency,
      conversionResult,
      errors: {},
    });

    render(<CurrencyConverter />);

    await waitFor(() => {
      // Test for basic elements that should be present during conversion
      expect(screen.getAllByText('Currency Converter')).toHaveLength(2);
      expect(screen.getByText('Amount (CZK)')).toBeInTheDocument();
      expect(screen.getByText('To Currency')).toBeInTheDocument();

      // Check that the form has values populated
      const amountInput = screen.getByLabelText(
        'Amount (CZK)'
      ) as HTMLInputElement;
      const currencySelect = screen.getByLabelText(
        'To Currency'
      ) as HTMLSelectElement;

      expect(amountInput.value).toBe('1000');
      expect(currencySelect.value).toBe('USD');
    });
  });

  it('should show loading state while fetching rates', () => {
    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<CurrencyConverter />);

    expect(screen.getByText('Loading currency rates...')).toBeInTheDocument();
  });

  it('should allow user to refresh rates', async () => {
    const refetch = vi.fn();
    mockUseCurrencyRates.mockReturnValue({
      exchangeRates: mockExchangeRates,
      isLoading: false,
      error: null,
      refetch,
    });

    render(<CurrencyConverter />);

    const refreshButton = screen.getByText('Refresh Rates');
    await user.click(refreshButton);

    expect(refetch).toHaveBeenCalled();
  });
});
