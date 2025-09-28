export interface CurrencyRate {
  id: string;
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
  lastUpdated?: Date;
}

export interface ExchangeRates {
  date: Date;
  rates: CurrencyRate[];
  fetchedAt: Date;
}

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: string;
  targetAmount: number;
  targetCurrency: string;
  exchangeRate: number;
  currencyAmount: number; // The amount of foreign currency units the rate applies to
  conversionDate: Date;
  timestamp: Date;
}

export interface ConversionErrors {
  amount?: string;
  currency?: string;
  conversion?: string;
}

export interface CurrencyConversionState {
  amount: string;
  setAmount: (amount: string) => void;
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
  conversionResult: ConversionResult | null;
  errors: ConversionErrors;
}

export interface CurrencyRatesState {
  exchangeRates: ExchangeRates | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface CnbApiResponse {
  date: Date;
  rates: CurrencyRate[];
}
