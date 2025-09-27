import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion'

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
      }
    ],
    fetchedAt: new Date()
  }

  it('should calculate conversion when amount and currency are provided', () => {
    const { result } = renderHook(() => useCurrencyConversion(mockExchangeRates))

    act(() => {
      result.current.setAmount('1000')
      result.current.setCurrency('USD')
    })

    expect(result.current.conversionResult).toEqual({
      originalAmount: 1000,
      originalCurrency: 'CZK',
      targetAmount: expect.closeTo(42.94, 0.01),
      targetCurrency: 'USD',
      exchangeRate: 23.285,
      conversionDate: mockExchangeRates.date,
      timestamp: expect.any(Date)
    })
  })

  it('should validate amount input', () => {
    const { result } = renderHook(() => useCurrencyConversion(mockExchangeRates))

    act(() => {
      result.current.setAmount('-100')
    })

    expect(result.current.errors.amount).toBe('Amount must be positive')
    expect(result.current.conversionResult).toBeNull()
  })

  it('should handle missing exchange rate data', () => {
    const { result } = renderHook(() => useCurrencyConversion(mockExchangeRates))

    act(() => {
      result.current.setAmount('1000')
      result.current.setCurrency('INVALID')
    })

    expect(result.current.errors.currency).toBe('Currency not found')
    expect(result.current.conversionResult).toBeNull()
  })

  it('should reset conversion when exchange rates change', () => {
    const { result, rerender } = renderHook(
      ({ exchangeRates }) => useCurrencyConversion(exchangeRates),
      { initialProps: { exchangeRates: mockExchangeRates } }
    )

    act(() => {
      result.current.setAmount('1000')
      result.current.setCurrency('USD')
    })

    expect(result.current.conversionResult).not.toBeNull()

    rerender({ exchangeRates: null })

    expect(result.current.conversionResult).toBeNull()
    expect(result.current.amount).toBe('')
    expect(result.current.selectedCurrency).toBe('')
  })
})