import { describe, it, expect } from 'vitest'

describe('Currency Conversion Calculation Contract', () => {
  it('should calculate CZK to foreign currency correctly', () => {
    const request = {
      amountCZK: 1000,
      targetCurrency: 'USD',
      timestamp: new Date()
    }

    const rate = {
      id: 'USD',
      country: 'USA',
      currency: 'dollar',
      amount: 1,
      code: 'USD',
      rate: 23.285,
      lastUpdated: new Date()
    }

    const result = calculateCurrencyConversion(request, rate)

    expect(result).toEqual({
      originalAmount: 1000,
      originalCurrency: 'CZK',
      targetAmount: expect.closeTo(42.94, 0.01),
      targetCurrency: 'USD',
      exchangeRate: 23.285,
      conversionDate: expect.any(Date),
      timestamp: expect.any(Date)
    })
  })

  it('should handle currencies with amounts other than 1', () => {
    const request = {
      amountCZK: 1000,
      targetCurrency: 'HUF',
      timestamp: new Date()
    }

    const rate = {
      id: 'HUF',
      country: 'Hungary',
      currency: 'forint',
      amount: 100,
      code: 'HUF',
      rate: 6.399,
      lastUpdated: new Date()
    }

    const result = calculateCurrencyConversion(request, rate)

    // Calculation: (1000 / 6.399) * 100 = 15626.44
    expect(result.targetAmount).toBeCloseTo(15626.44, 0.01)
    expect(result.exchangeRate).toBe(6.399)
  })

  it('should handle zero amount', () => {
    const request = {
      amountCZK: 0,
      targetCurrency: 'USD',
      timestamp: new Date()
    }

    const rate = {
      id: 'USD',
      country: 'USA',
      currency: 'dollar',
      amount: 1,
      code: 'USD',
      rate: 23.285,
      lastUpdated: new Date()
    }

    const result = calculateCurrencyConversion(request, rate)

    expect(result.targetAmount).toBe(0)
  })

  it('should handle very small amounts', () => {
    const request = {
      amountCZK: 0.01,
      targetCurrency: 'USD',
      timestamp: new Date()
    }

    const rate = {
      id: 'USD',
      country: 'USA',
      currency: 'dollar',
      amount: 1,
      code: 'USD',
      rate: 23.285,
      lastUpdated: new Date()
    }

    const result = calculateCurrencyConversion(request, rate)

    expect(result.targetAmount).toBeCloseTo(0.000429, 0.000001)
  })

  it('should validate input parameters', () => {
    const invalidRequest = {
      amountCZK: -100,
      targetCurrency: 'USD',
      timestamp: new Date()
    }

    const rate = {
      id: 'USD',
      country: 'USA',
      currency: 'dollar',
      amount: 1,
      code: 'USD',
      rate: 23.285,
      lastUpdated: new Date()
    }

    expect(() => calculateCurrencyConversion(invalidRequest, rate)).toThrow('Invalid amount')
  })
})