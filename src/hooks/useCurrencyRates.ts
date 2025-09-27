import { useState, useEffect, useCallback } from 'react'
import { ExchangeRates } from '@/types'
import { fetchExchangeRates, getCnbApiErrorMessage } from '@/services/cnbApi'
import { validateExchangeRates } from '@/utils/validation'

interface UseCurrencyRatesOptions {
  autoFetch?: boolean
  refreshInterval?: number
  maxRetries?: number
}

interface UseCurrencyRatesReturn {
  exchangeRates: ExchangeRates | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  isRefreshing: boolean
  lastFetchTime: Date | null
}

export function useCurrencyRates(
  options: UseCurrencyRatesOptions = {}
): UseCurrencyRatesReturn {
  const {
    autoFetch = true,
    refreshInterval,
    maxRetries = 3
  } = options

  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchRates = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const rates = await fetchExchangeRates()

      const validation = validateExchangeRates(rates)
      if (!validation.isValid) {
        throw new Error(`Invalid exchange rates data: ${validation.errors.join(', ')}`)
      }

      setExchangeRates(rates)
      setLastFetchTime(new Date())
      setRetryCount(0)
    } catch (err) {
      const errorMessage = getCnbApiErrorMessage(err)
      setError(errorMessage)

      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          fetchRates(isRefresh)
        }, delay)
        return
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [maxRetries, retryCount])

  const refetch = useCallback(async () => {
    setRetryCount(0)
    await fetchRates(true)
  }, [fetchRates])

  useEffect(() => {
    if (autoFetch && !exchangeRates && !error) {
      fetchRates()
    }
  }, [autoFetch, exchangeRates, error, fetchRates])

  useEffect(() => {
    if (refreshInterval && autoFetch) {
      const interval = setInterval(() => {
        refetch()
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [refreshInterval, autoFetch, refetch])

  return {
    exchangeRates,
    isLoading,
    error,
    refetch,
    isRefreshing,
    lastFetchTime
  }
}

export type { UseCurrencyRatesReturn, UseCurrencyRatesOptions }