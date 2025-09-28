import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConversionForm } from '@/components/ConversionForm';
import type { ExchangeRates } from '@/types';

describe('ConversionForm Component', () => {
  const mockExchangeRates: ExchangeRates = {
    date: new Date('2024-09-27'),
    rates: [
      {
        id: 'USD',
        country: 'USA',
        currency: 'dollar',
        amount: 1,
        code: 'USD',
        rate: 23.285,
        lastUpdated: new Date(),
      },
      {
        id: 'EUR',
        country: 'EMU',
        currency: 'euro',
        amount: 1,
        code: 'EUR',
        rate: 25.285,
        lastUpdated: new Date(),
      },
      {
        id: 'JPY',
        country: 'Japan',
        currency: 'yen',
        amount: 100,
        code: 'JPY',
        rate: 13.919,
        lastUpdated: new Date(),
      },
      {
        id: 'ISK',
        country: 'Iceland',
        currency: 'krona',
        amount: 100,
        code: 'ISK',
        rate: 17.134,
        lastUpdated: new Date(),
      },
    ],
    fetchedAt: new Date(),
  };

  it('should render form with amount input and currency dropdown', () => {
    render(
      <ConversionForm
        amount=""
        selectedCurrency=""
        conversionErrors={{}}
        exchangeRates={mockExchangeRates}
        onAmountChange={vi.fn()}
        onCurrencyChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Amount (CZK)')).toBeInTheDocument();
    expect(screen.getByLabelText('To Currency')).toBeInTheDocument();
    expect(screen.getByText('Currency Converter')).toBeInTheDocument();
  });

  it('should validate amount input', async () => {
    const onAmountChange = vi.fn();
    const onCurrencyChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <ConversionForm
        amount="-100"
        selectedCurrency="USD"
        conversionErrors={{ amount: 'Amount must be positive' }}
        exchangeRates={mockExchangeRates}
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('Amount must be positive')).toBeInTheDocument();
  });

  it('should handle loading state correctly', () => {
    render(
      <ConversionForm
        amount=""
        selectedCurrency=""
        conversionErrors={{}}
        exchangeRates={mockExchangeRates}
        onAmountChange={vi.fn()}
        onCurrencyChange={vi.fn()}
        isLoading={true}
      />
    );

    expect(screen.getByLabelText('Amount (CZK)')).toBeDisabled();
    expect(screen.getByLabelText('To Currency')).toBeDisabled();
  });

  it('should display correct exchange rate for 1-unit currencies', () => {
    const onAmountChange = vi.fn();
    const onCurrencyChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <ConversionForm
        amount="1000"
        selectedCurrency="USD"
        conversionErrors={{}}
        exchangeRates={mockExchangeRates}
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('1 USD = 23.285 CZK')).toBeInTheDocument();
  });

  it('should display correct exchange rate for multi-unit currencies', () => {
    const onAmountChange = vi.fn();
    const onCurrencyChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <ConversionForm
        amount="1000"
        selectedCurrency="JPY"
        conversionErrors={{}}
        exchangeRates={mockExchangeRates}
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('100 JPY = 13.919 CZK')).toBeInTheDocument();
  });

  it('should display correct exchange rate for ISK (100 units)', () => {
    const onAmountChange = vi.fn();
    const onCurrencyChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <ConversionForm
        amount="500"
        selectedCurrency="ISK"
        conversionErrors={{}}
        exchangeRates={mockExchangeRates}
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('100 ISK = 17.134 CZK')).toBeInTheDocument();
  });

  it('should not show exchange rate when no currency is selected', () => {
    const onAmountChange = vi.fn();
    const onCurrencyChange = vi.fn();

    render(
      <ConversionForm
        amount="1000"
        selectedCurrency=""
        conversionErrors={{}}
        exchangeRates={mockExchangeRates}
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
      />
    );

    // Should not show conversion result or exchange rate info
    expect(screen.queryByText(/Exchange rate:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Rate date:/)).not.toBeInTheDocument();
  });
});
