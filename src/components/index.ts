export { ErrorMessage } from './ErrorMessage';
export { Button } from './Button';
export { CurrencyList } from './CurrencyList';
export { ConversionForm } from './ConversionForm';
export { ConversionResult } from './ConversionResult';
export { CurrencyConverter } from './CurrencyConverter';

export interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  showRetry?: boolean;
  showDismiss?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
  $marginTop?: string;
}

export interface CurrencyListProps {
  rates: Array<{
    id: string;
    country: string;
    currency: string;
    amount: number;
    code: string;
    rate: number;
    lastUpdated?: Date;
  }>;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export interface ConversionFormProps {
  amount: string;
  selectedCurrency: string;
  conversionErrors: Record<string, string>;
  exchangeRates: {
    date: Date;
    rates: Array<{
      id: string;
      country: string;
      currency: string;
      amount: number;
      code: string;
      rate: number;
      lastUpdated?: Date;
    }>;
    fetchedAt: Date;
  } | null;
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  className?: string;
}

export interface ConversionResultProps {
  result: {
    originalAmount: number;
    originalCurrency: string;
    targetAmount: number;
    targetCurrency: string;
    exchangeRate: number;
    conversionDate: Date;
    timestamp: Date;
  } | null;
  isLoading?: boolean;
  error?: string | null;
  onConvertAgain?: () => void;
  className?: string;
}
