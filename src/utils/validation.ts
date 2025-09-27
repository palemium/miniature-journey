import { CurrencyRate, ExchangeRates } from '@/types'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface CurrencyValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateExchangeRates(exchangeRates: ExchangeRates | null): ValidationResult {
  if (!exchangeRates) {
    return {
      isValid: false,
      errors: ['No exchange rates data available']
    }
  }

  const errors: string[] = []

  if (!exchangeRates.date || isNaN(exchangeRates.date.getTime())) {
    errors.push('Invalid exchange rates date')
  }

  if (!exchangeRates.fetchedAt || isNaN(exchangeRates.fetchedAt.getTime())) {
    errors.push('Invalid fetch timestamp')
  }

  if (!Array.isArray(exchangeRates.rates) || exchangeRates.rates.length === 0) {
    errors.push('No currency rates available')
  }

  exchangeRates.rates.forEach((rate, index) => {
    const rateErrors = validateCurrencyRate(rate)
    if (rateErrors.length > 0) {
      errors.push(`Rate ${index + 1} (${rate.code || 'unknown'}): ${rateErrors.join(', ')}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateCurrencyRate(rate: CurrencyRate): string[] {
  const errors: string[] = []

  if (!rate.id || typeof rate.id !== 'string' || rate.id.trim() === '') {
    errors.push('Currency ID is required')
  }

  if (!rate.country || typeof rate.country !== 'string' || rate.country.trim() === '') {
    errors.push('Country is required')
  }

  if (!rate.currency || typeof rate.currency !== 'string' || rate.currency.trim() === '') {
    errors.push('Currency name is required')
  }

  if (typeof rate.amount !== 'number' || isNaN(rate.amount) || rate.amount <= 0) {
    errors.push('Amount must be a positive number')
  }

  if (!rate.code || typeof rate.code !== 'string' || rate.code.trim() === '') {
    errors.push('Currency code is required')
  }

  if (typeof rate.rate !== 'number' || isNaN(rate.rate) || rate.rate <= 0) {
    errors.push('Exchange rate must be a positive number')
  }

  if (rate.rate > 1000) {
    errors.push('Exchange rate seems unusually high')
  }

  if (rate.lastUpdated && (isNaN(rate.lastUpdated.getTime()) || rate.lastUpdated > new Date())) {
    errors.push('Invalid last updated timestamp')
  }

  return errors
}

export function validateCurrencyCode(currencyCode: string): boolean {
  if (!currencyCode || typeof currencyCode !== 'string') {
    return false
  }

  const cleanCode = currencyCode.trim().toUpperCase()

  if (cleanCode.length !== 3) {
    return false
  }

  if (!/^[A-Z]{3}$/.test(cleanCode)) {
    return false
  }

  return true
}

export function validateAmount(amount: string): ValidationResult {
  const errors: string[] = []

  if (!amount || amount.trim() === '') {
    errors.push('Amount is required')
    return { isValid: false, errors }
  }

  const cleanAmount = amount.trim()

  if (!/^\d*\.?\d+$/.test(cleanAmount) && !/^\d+$/.test(cleanAmount)) {
    errors.push('Amount must contain only numbers and at most one decimal point')
  }

  const amountNum = parseFloat(cleanAmount)

  if (isNaN(amountNum)) {
    errors.push('Amount must be a valid number')
  } else if (amountNum <= 0) {
    errors.push('Amount must be positive')
  } else if (amountNum > 1000000) {
    errors.push('Amount cannot exceed 1,000,000')
  } else if (cleanAmount.split('.')[1]?.length > 2) {
    errors.push('Amount cannot have more than 2 decimal places')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateConversionInput(
  amount: string,
  currencyCode: string,
  exchangeRates: ExchangeRates | null
): CurrencyValidationResult {
  const errors: Record<string, string> = {}

  const amountValidation = validateAmount(amount)
  if (!amountValidation.isValid) {
    errors.amount = amountValidation.errors[0]
  }

  if (!currencyCode || currencyCode.trim() === '') {
    errors.currency = 'Currency is required'
  } else if (!validateCurrencyCode(currencyCode)) {
    errors.currency = 'Invalid currency code format (must be 3 letters)'
  } else if (exchangeRates) {
    const currencyExists = exchangeRates.rates.some(
      rate => rate.code.toUpperCase() === currencyCode.trim().toUpperCase()
    )
    if (!currencyExists) {
      errors.currency = 'Currency not found in exchange rates'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function sanitizeCurrencyCode(currencyCode: string): string {
  if (!currencyCode) return ''
  return currencyCode.trim().toUpperCase()
}

export function sanitizeAmount(amount: string): string {
  if (!amount) return ''
  return amount.trim()
}

export function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime()) && date.getFullYear() >= 2000 && date.getFullYear() <= new Date().getFullYear() + 1
}