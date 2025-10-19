import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchExchangeRates } from '@/services/cnbApi';

describe('CNB API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and parse exchange rates successfully', async () => {
    const mockResponse = `27 Sep 2024
USA|dollar|1|USD|23.285
EMU|euro|1|EUR|25.285`;

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await fetchExchangeRates();

    expect(result).toEqual({
      date: new Date('2024-09-27'),
      rates: expect.arrayContaining([
        expect.objectContaining({
          id: 'USD',
          code: 'USD',
          rate: 23.285,
        }),
        expect.objectContaining({
          id: 'EUR',
          code: 'EUR',
          rate: 25.285,
        }),
      ]),
      fetchedAt: expect.any(Date),
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/proxy');
  });

  it('should handle network errors', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchExchangeRates()).rejects.toThrow('Network error');
  });

  it('should handle HTTP errors', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response);

    await expect(fetchExchangeRates()).rejects.toThrow(
      'HTTP error! status: 404'
    );
  });

  it('should handle malformed response', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('invalid response format'),
    } as Response);

    await expect(fetchExchangeRates()).rejects.toThrow();
  });
});
