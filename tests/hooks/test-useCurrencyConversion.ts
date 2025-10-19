import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';

describe('useCurrencyConversion Hook', () => {
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

  it('should calculate conversion when amount and currency are provided', async () => {
    const { result } = renderHook(() =>
      useCurrencyConversion(mockExchangeRates, { autoCalculate: true })
    );

    act(() => {
      result.current.setAmount('1000');
      result.current.setCurrency('USD');
    });

    await waitFor(() => {
      expect(result.current.conversionResult).toEqual({
        originalAmount: 1000,
        originalCurrency: 'CZK',
        targetAmount: expect.closeTo(42.94, 0.01),
        targetCurrency: 'USD',
        exchangeRate: 23.285,
        currencyAmount: 1,
        conversionDate: mockExchangeRates.date,
        timestamp: expect.any(Date),
      });
    });
  });

  it('should validate amount input', async () => {
    const { result } = renderHook(() =>
      useCurrencyConversion(mockExchangeRates, { autoCalculate: true })
    );

    act(() => {
      result.current.setAmount('-100');
    });

    await waitFor(() => {
      expect(result.current.errors.amount).toBe(
        'Amount must contain only numbers and at most one decimal point'
      );
      expect(result.current.conversionResult).toBeNull();
    });
  });

  it('should handle missing exchange rate data', async () => {
    const { result } = renderHook(() =>
      useCurrencyConversion(mockExchangeRates, { autoCalculate: true })
    );

    act(() => {
      result.current.setAmount('1000');
      result.current.setCurrency('INVALID');
    });

    await waitFor(() => {
      expect(result.current.errors.currency).toBe(
        'Invalid currency code format (must be 3 letters)'
      );
      expect(result.current.conversionResult).toBeNull();
    });
  });

  it('should reset conversion when exchange rates change', async () => {
    const { result, rerender } = renderHook(
      ({ exchangeRates }) =>
        useCurrencyConversion(exchangeRates, { autoCalculate: true }),
      { initialProps: { exchangeRates: mockExchangeRates } }
    );

    act(() => {
      result.current.setAmount('1000');
      result.current.setCurrency('USD');
    });

    await waitFor(() => {
      expect(result.current.conversionResult).not.toBeNull();
    });

    rerender({ exchangeRates: null });

    await waitFor(() => {
      expect(result.current.conversionResult).toBeNull();
      expect(result.current.amount).toBe('');
      expect(result.current.selectedCurrency).toBe('');
    });
  });
});
