import { describe, it, expect } from 'vitest'
import { calculateCurrencyConversion } from '@/utils/conversionCalculator'
import type { ExchangeRates } from '@/types'

describe('Currency Conversion Calculation Contract', () => {
  it('should calculate CZK to foreign currency correctly', () => {
    const request = {
      amount: 1000,
      fromCurrency: 'CZK',
      toCurrency: 'USD',
      exchangeRates: {
        date: new Date('2024-09-27'),
        rates: [{
          id: 'USD',
          country: 'USA',
          currency: 'dollar',
          amount: 1,
          code: 'USD',
          rate: 23.285,
          lastUpdated: new Date()
        }],
        fetchedAt: new Date()
      } as ExchangeRates
    }

    const result = calculateCurrencyConversion(request)

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
      amount: 1000,
      fromCurrency: 'CZK',
      toCurrency: 'HUF',
      exchangeRates: {
        date: new Date('2024-09-27'),
        rates: [{
          id: 'HUF',
          country: 'Hungary',
          currency: 'forint',
          amount: 100,
          code: 'HUF',
          rate: 6.399,
          lastUpdated: new Date()
        }],
        fetchedAt: new Date()
      } as ExchangeRates
    }

    const result = calculateCurrencyConversion(request)

    // Calculation: (1000 / 6.399) * 100 = 15626.44
    expect(result.targetAmount).toBeCloseTo(15626.44, 0.01)
    expect(result.exchangeRate).toBe(6.399)
  })

  it('should handle JPY (100 units) conversion correctly', () => {
    const request = {
      amount: 1000,
      fromCurrency: 'CZK',
      toCurrency: 'JPY',
      exchangeRates: {
        date: new Date('2024-09-27'),
        rates: [{
          id: 'JPY',
          country: 'Japan',
          currency: 'yen',
          amount: 100,
          code: 'JPY',
          rate: 13.919,
          lastUpdated: new Date()
        }],
        fetchedAt: new Date()
      } as ExchangeRates
    }

    const result = calculateCurrencyConversion(request)

    // Calculation: (1000 / 13.919) * 100 = 7183.5
    expect(result.targetAmount).toBeCloseTo(7183.5, 0.1)
    expect(result.exchangeRate).toBe(13.919)
  })

  it('should handle ISK (100 units) conversion correctly', () => {
    const request = {
      amount: 500,
      fromCurrency: 'CZK',
      toCurrency: 'ISK',
      exchangeRates: {
        date: new Date('2024-09-27'),
        rates: [{
          id: 'ISK',
          country: 'Iceland',
          currency: 'krona',
          amount: 100,
          code: 'ISK',
          rate: 17.134,
          lastUpdated: new Date()
        }],
        fetchedAt: new Date()
      } as ExchangeRates
    }

    const result = calculateCurrencyConversion(request)

    // Calculation: (500 / 17.134) * 100 = 2918.5
    expect(result.targetAmount).toBeCloseTo(2918.5, 0.1)
    expect(result.exchangeRate).toBe(17.134)
  })

  it('should handle INR (100 units) conversion correctly', () => {
    const request = {
      amount: 2000,
      fromCurrency: 'CZK',
      toCurrency: 'INR',
      exchangeRates: {
        date: new Date('2024-09-27'),
        rates: [{
          id: 'INR',
          country: 'India',
          currency: 'rupee',
          amount: 100,
          code: 'INR',
          rate: 23.490,
          lastUpdated: new Date()
        }],
        fetchedAt: new Date()
      } as ExchangeRates
    }

    const result = calculateCurrencyConversion(request)

    // Calculation: (2000 / 23.490) * 100 = 8514.26
    expect(result.targetAmount).toBeCloseTo(8514.26, 0.01)
    expect(result.exchangeRate).toBe(23.490)
  })

  it('should handle reverse conversion from multi-unit currency to CZK', () => {
    const request = {
      amount: 1000,
      fromCurrency: 'JPY',
      toCurrency: 'CZK',
      exchangeRates: {
        date: new Date('2024-09-27'),
        rates: [{
          id: 'JPY',
          country: 'Japan',
          currency: 'yen',
          amount: 100,
          code: 'JPY',
          rate: 13.919,
          lastUpdated: new Date()
        }],
        fetchedAt: new Date()
      } as ExchangeRates
    }

    const result = calculateCurrencyConversion(request)

    // Calculation: (1000 * 13.919) / 100 = 139.19
    expect(result.targetAmount).toBeCloseTo(139.19, 0.01)
    expect(result.exchangeRate).toBe(13.919)
  })

  it('should handle zero amount', () => {
    const request = {
      amount: 0,
      fromCurrency: 'CZK',
      toCurrency: 'USD',
      exchangeRates: {
        date: new Date('2024-09-27'),
        rates: [{
          id: 'USD',
          country: 'USA',
          currency: 'dollar',
          amount: 1,
          code: 'USD',
          rate: 23.285,
          lastUpdated: new Date()
        }],
        fetchedAt: new Date()
      } as ExchangeRates
    }

    const result = calculateCurrencyConversion(request)

    expect(result.targetAmount).toBe(0)
  })

  it('should handle very small amounts', () => {
    const request = {
      amount: 0.01,
      fromCurrency: 'CZK',
      toCurrency: 'USD',
      exchangeRates: {
        date: new Date('2024-09-27'),
        rates: [{
          id: 'USD',
          country: 'USA',
          currency: 'dollar',
          amount: 1,
          code: 'USD',
          rate: 23.285,
          lastUpdated: new Date()
        }],
        fetchedAt: new Date()
      } as ExchangeRates
    }

    const result = calculateCurrencyConversion(request)

    expect(result.targetAmount).toBeCloseTo(0.000429, 0.000001)
  })

  it('should validate input parameters', () => {
    const invalidRequest = {
      amount: -100,
      fromCurrency: 'CZK',
      toCurrency: 'USD',
      exchangeRates: {
        date: new Date('2024-09-27'),
        rates: [{
          id: 'USD',
          country: 'USA',
          currency: 'dollar',
          amount: 1,
          code: 'USD',
          rate: 23.285,
          lastUpdated: new Date()
        }],
        fetchedAt: new Date()
      } as ExchangeRates
    }

    expect(() => calculateCurrencyConversion(invalidRequest)).toThrow('Amount must be positive')
  })
})