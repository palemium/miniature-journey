import { describe, it, expect } from 'vitest';
import { parseCnbTextResponse } from '@/utils';

describe('CNB API Text Parsing Contract', () => {
  it('should parse valid CNB API text response correctly', () => {
    // This test will fail until we implement the parser
    const mockCnbResponse = `27 Sep 2024
Australia|dollar|1|AUD|15.391
Brazil|real|1|BRL|4.128
Canada|dollar|1|CAD|16.713`;

    // This function doesn't exist yet - test will fail
    const result = parseCnbTextResponse(mockCnbResponse);

    expect(result).toEqual({
      date: new Date('2024-09-27'),
      rates: [
        {
          id: 'AUD',
          country: 'Australia',
          currency: 'dollar',
          amount: 1,
          code: 'AUD',
          rate: 15.391,
          lastUpdated: expect.any(Date),
        },
        {
          id: 'BRL',
          country: 'Brazil',
          currency: 'real',
          amount: 1,
          code: 'BRL',
          rate: 4.128,
          lastUpdated: expect.any(Date),
        },
        {
          id: 'CAD',
          country: 'Canada',
          currency: 'dollar',
          amount: 1,
          code: 'CAD',
          rate: 16.713,
          lastUpdated: expect.any(Date),
        },
      ],
    });
  });

  it('should handle currencies with amounts other than 1', () => {
    const mockResponse = `27 Sep 2024
Hungary|forint|100|HUF|6.399
Japan|yen|100|JPY|15.391`;

    const result = parseCnbTextResponse(mockResponse);

    expect(result.rates).toEqual([
      {
        id: 'HUF',
        country: 'Hungary',
        currency: 'forint',
        amount: 100,
        code: 'HUF',
        rate: 6.399,
        lastUpdated: expect.any(Date),
      },
      {
        id: 'JPY',
        country: 'Japan',
        currency: 'yen',
        amount: 100,
        code: 'JPY',
        rate: 15.391,
        lastUpdated: expect.any(Date),
      },
    ]);
  });

  it('should skip header line and empty lines', () => {
    const mockResponse = `27 Sep 2024

USA|dollar|1|USD|23.285

EMU|euro|1|EUR|25.285`;

    const result = parseCnbTextResponse(mockResponse);

    expect(result.rates).toHaveLength(2);
    expect(result.rates[0].code).toBe('USD');
    expect(result.rates[1].code).toBe('EUR');
  });
});
