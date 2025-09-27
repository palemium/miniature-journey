import { CurrencyRate, ExchangeRates, ConversionResult } from '@/types'

export interface ConversionInput {
  amount: number
  fromCurrency: string
  toCurrency: string
  exchangeRates: ExchangeRates
}

export interface ConversionCalculationError {
  type: 'invalid_amount' | 'currency_not_found' | 'invalid_rate' | 'calculation_error'
  message: string
}

export function calculateCurrencyConversion(input: ConversionInput): ConversionResult {
  const { amount, fromCurrency, toCurrency, exchangeRates } = input

  if (amount <= 0) {
    throw new Error('Amount must be positive')
  }

  if (fromCurrency === 'CZK') {
    const targetRate = findRateByCode(exchangeRates.rates, toCurrency)
    if (!targetRate) {
      throw new Error(`Currency code '${toCurrency}' not found`)
    }

    if (targetRate.rate <= 0) {
      throw new Error(`Invalid exchange rate for ${toCurrency}: ${targetRate.rate}`)
    }

    const targetAmount = amount / targetRate.rate

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      targetAmount: Number(targetAmount.toFixed(4)),
      targetCurrency: toCurrency,
      exchangeRate: targetRate.rate,
      conversionDate: exchangeRates.date,
      timestamp: new Date()
    }
  }

  if (toCurrency === 'CZK') {
    const sourceRate = findRateByCode(exchangeRates.rates, fromCurrency)
    if (!sourceRate) {
      throw new Error(`Currency code '${fromCurrency}' not found`)
    }

    if (sourceRate.rate <= 0) {
      throw new Error(`Invalid exchange rate for ${fromCurrency}: ${sourceRate.rate}`)
    }

    const targetAmount = amount * sourceRate.rate

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      targetAmount: Number(targetAmount.toFixed(2)),
      targetCurrency: toCurrency,
      exchangeRate: sourceRate.rate,
      conversionDate: exchangeRates.date,
      timestamp: new Date()
    }
  }

  throw new Error('Only conversions to/from CZK are supported')
}

export function findRateByCode(rates: CurrencyRate[], currencyCode: string): CurrencyRate | null {
  return rates.find(rate => rate.code === currencyCode) || null
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'CZK' ? 'CZK' : 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: currency === 'CZK' ? 2 : 4
  }).format(amount)
}

export function formatExchangeRate(rate: number, fromCurrency: string, toCurrency: string): string {
  if (fromCurrency === 'CZK') {
    return `1 ${toCurrency} = ${rate.toFixed(3)} CZK`
  }
  return `1 ${fromCurrency} = ${rate.toFixed(3)} CZK`
}

export function validateConversionInput(
  amount: string,
  currencyCode: string,
  exchangeRates: ExchangeRates | null
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!amount || amount.trim() === '') {
    errors.amount = 'Amount is required'
  } else {
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum)) {
      errors.amount = 'Amount must be a valid number'
    } else if (amountNum <= 0) {
      errors.amount = 'Amount must be positive'
    } else if (amountNum > 1000000) {
      errors.amount = 'Amount cannot exceed 1,000,000'
    }
  }

  if (!currencyCode || currencyCode.trim() === '') {
    errors.currency = 'Currency is required'
  } else if (exchangeRates && !findRateByCode(exchangeRates.rates, currencyCode)) {
    errors.currency = 'Currency not found'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}