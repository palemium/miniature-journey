import { CurrencyRate, ExchangeRates, ConversionResult } from '@/types';

export interface ConversionInput {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  exchangeRates: ExchangeRates;
}

export interface ConversionCalculationError {
  type:
    | 'invalid_amount'
    | 'currency_not_found'
    | 'invalid_rate'
    | 'calculation_error';
  message: string;
}

export function calculateCurrencyConversion(
  input: ConversionInput
): ConversionResult {
  const { amount, fromCurrency, toCurrency, exchangeRates } = input;

  if (amount < 0) {
    throw new Error('Amount must be positive');
  }

  if (fromCurrency === 'CZK') {
    const targetRate = findRateByCode(exchangeRates.rates, toCurrency);
    if (!targetRate) {
      throw new Error(`Currency code '${toCurrency}' not found`);
    }

    if (targetRate.rate <= 0) {
      throw new Error(
        `Invalid exchange rate for ${toCurrency}: ${targetRate.rate}`
      );
    }

    const targetAmount = (amount / targetRate.rate) * targetRate.amount;

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      targetAmount: Number(targetAmount.toFixed(2)),
      targetCurrency: toCurrency,
      exchangeRate: targetRate.rate,
      currencyAmount: targetRate.amount,
      conversionDate: exchangeRates.date,
      timestamp: new Date(),
    };
  }

  if (toCurrency === 'CZK') {
    const sourceRate = findRateByCode(exchangeRates.rates, fromCurrency);
    if (!sourceRate) {
      throw new Error(`Currency code '${fromCurrency}' not found`);
    }

    if (sourceRate.rate <= 0) {
      throw new Error(
        `Invalid exchange rate for ${fromCurrency}: ${sourceRate.rate}`
      );
    }

    const targetAmount = (amount * sourceRate.rate) / sourceRate.amount;

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      targetAmount: Number(targetAmount.toFixed(2)),
      targetCurrency: toCurrency,
      exchangeRate: sourceRate.rate,
      currencyAmount: sourceRate.amount,
      conversionDate: exchangeRates.date,
      timestamp: new Date(),
    };
  }

  throw new Error('Only conversions to/from CZK are supported');
}

export function findRateByCode(
  rates: CurrencyRate[],
  currencyCode: string
): CurrencyRate | null {
  return rates.find(rate => rate.code === currencyCode) || null;
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: currency === 'CZK' ? 2 : 4,
    }).format(amount);
  } catch {
    // Fallback to currency code if Intl doesn't support the currency
    return `${new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: currency === 'CZK' ? 2 : 4,
    }).format(amount)} ${currency}`;
  }
}

export function formatExchangeRate(
  rate: number,
  fromCurrency: string,
  toCurrency: string,
  amount: number = 1
): string {
  if (fromCurrency === 'CZK') {
    return `${amount} ${toCurrency} = ${rate.toFixed(3)} CZK`;
  }
  return `${amount} ${fromCurrency} = ${rate.toFixed(3)} CZK`;
}
