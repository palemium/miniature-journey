import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';

describe('useCurrencyRates Hook', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch exchange rates on mount', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve(`27 Sep 2024
USA|dollar|1|USD|23.285`),
    } as any);

    const { result } = renderHook(() => useCurrencyRates());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.exchangeRates).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.exchangeRates).toBeTruthy();
      expect(result.current.exchangeRates?.date).toEqual(
        mockExchangeRates.date
      );
      expect(result.current.exchangeRates?.rates).toHaveLength(1);
      expect(result.current.exchangeRates?.rates[0]?.code).toBe('USD');
      expect(result.current.exchangeRates?.rates[0]?.rate).toBe(23.285);
    });
  });

  it('should handle fetch error', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCurrencyRates());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(
        'Failed to connect to CNB API. Please check your internet connection.'
      );
      expect(result.current.exchangeRates).toBeNull();
    });
  });

  it('should handle refetch', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve(`27 Sep 2024
USA|dollar|1|USD|23.285`),
    } as any);

    const { result } = renderHook(() => useCurrencyRates());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.isRefreshing).toBe(true);
    });
  });
});
