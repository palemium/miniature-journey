import { useState, useEffect, useCallback, useMemo } from 'react';
import { ExchangeRates, ConversionResult, ConversionErrors } from '@/types';
import { calculateCurrencyConversion } from '@/utils/conversionCalculator';
import { validateConversionInput } from '@/utils/validation';
import { sanitizeAmount, sanitizeCurrencyCode } from '@/utils/validation';

interface UseCurrencyConversionOptions {
  autoCalculate?: boolean;
  debounceMs?: number;
}

export function useCurrencyConversion(
  exchangeRates: ExchangeRates | null,
  options: UseCurrencyConversionOptions = {}
) {
  const { autoCalculate = true, debounceMs = 300 } = options;

  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [conversionResult, setConversionResult] =
    useState<ConversionResult | null>(null);
  const [errors, setErrors] = useState<ConversionErrors>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const validateAndCalculate = useCallback(() => {
    if (!exchangeRates) {
      setConversionResult(null);
      setErrors({});
      return;
    }

    const sanitizedAmount = sanitizeAmount(amount);
    const sanitizedCurrency = sanitizeCurrencyCode(selectedCurrency);

    const validation = validateConversionInput(
      sanitizedAmount,
      sanitizedCurrency,
      exchangeRates
    );

    if (!validation.isValid) {
      setConversionResult(null);
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    try {
      setIsCalculating(true);

      const amountNum = parseFloat(sanitizedAmount);
      const result = calculateCurrencyConversion({
        amount: amountNum,
        fromCurrency: 'CZK',
        toCurrency: sanitizedCurrency,
        exchangeRates,
      });

      setConversionResult(result);
    } catch (error) {
      setConversionResult(null);
      setErrors({
        conversion:
          error instanceof Error ? error.message : 'Conversion failed',
      });
    } finally {
      setIsCalculating(false);
    }
  }, [amount, selectedCurrency, exchangeRates]);

  const debouncedCalculate = useMemo(() => {
    let timeoutId: number;

    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (autoCalculate) {
          validateAndCalculate();
        }
      }, debounceMs);
    };
  }, [validateAndCalculate, autoCalculate, debounceMs]);

  useEffect(() => {
    if (autoCalculate) {
      debouncedCalculate();
    }
  }, [
    amount,
    selectedCurrency,
    exchangeRates,
    autoCalculate,
    debouncedCalculate,
  ]);

  useEffect(() => {
    if (!exchangeRates) {
      setConversionResult(null);
      setErrors({});
      setAmount('');
      setSelectedCurrency('');
    } else {
      // Set default values when exchange rates are loaded
      if (!amount && !selectedCurrency) {
        setAmount('100');
        // Find USD currency or fallback to first available currency
        const usdCurrency = exchangeRates.rates.find(
          rate => rate.code === 'USD'
        );
        setSelectedCurrency(
          usdCurrency?.code || exchangeRates.rates[0]?.code || ''
        );
      }
    }
  }, [exchangeRates, amount, selectedCurrency]);

  const setAmountHandler = useCallback((newAmount: string) => {
    setAmount(newAmount);
  }, []);

  const setCurrencyHandler = useCallback((newCurrency: string) => {
    setSelectedCurrency(newCurrency);
  }, []);

  const calculateNow = useCallback(() => {
    validateAndCalculate();
  }, [validateAndCalculate]);

  const resetConversion = useCallback(() => {
    setAmount('');
    setSelectedCurrency('');
    setConversionResult(null);
    setErrors({});
  }, []);

  return {
    amount,
    setAmount: setAmountHandler,
    selectedCurrency,
    setCurrency: setCurrencyHandler,
    conversionResult,
    errors,
    isCalculating,
    calculateNow,
    resetConversion,
  };
}

export type { UseCurrencyConversionOptions };
