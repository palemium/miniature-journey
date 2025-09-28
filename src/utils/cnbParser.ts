import { CurrencyRate, ExchangeRates } from '@/types';

export interface CnbParsedData {
  date: Date;
  rates: CurrencyRate[];
}

export function parseCnbTextResponse(text: string): CnbParsedData {
  const lines = text.trim().split('\n');

  if (lines.length < 2) {
    throw new Error('Invalid response format: insufficient lines');
  }

  // Extract date from first line (expected format: "27 Sep 2024")
  const dateLine = lines[0];
  const dateMatch = dateLine.match(/(\d{1,2}) (\w{3}) (\d{4})/);

  if (!dateMatch) {
    throw new Error('Invalid date format in response');
  }

  const [, day, month, year] = dateMatch;
  const date = new Date(`${year} ${month} ${day}`);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date in response');
  }

  const rates: CurrencyRate[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip header line if present
    if (
      line === 'Country|Currency|Amount|Code|Rate' ||
      line === 'země|měna|množství|kód|kurz'
    ) {
      continue;
    }

    const parts = line.split('|').map(part => part.trim());

    // Expected format: Country | Currency | Amount | Code | Rate
    if (parts.length !== 5) {
      throw new Error(`Invalid rate format on line ${i + 1}: ${line}`);
    }

    const [country, currency, amountStr, code, rateStr] = parts;

    const amount = parseFloat(amountStr);
    const rate = parseFloat(rateStr.replace(',', '.').replace(/\s/g, ''));

    if (isNaN(amount) || isNaN(rate)) {
      throw new Error(`Invalid numeric values on line ${i + 1}: ${line}`);
    }

    if (rate <= 0) {
      throw new Error(
        `Invalid exchange rate (must be positive) on line ${i + 1}: ${line}`
      );
    }

    rates.push({
      id: code,
      country,
      currency,
      amount,
      code,
      rate,
      lastUpdated: new Date(),
    });
  }

  if (rates.length === 0) {
    throw new Error('No valid exchange rates found in response');
  }

  return { date, rates };
}

export function createExchangeRates(parsedData: CnbParsedData): ExchangeRates {
  return {
    date: parsedData.date,
    rates: parsedData.rates,
    fetchedAt: new Date(),
  };
}

export function findCurrencyRate(
  rates: CurrencyRate[],
  currencyCode: string
): CurrencyRate | null {
  return rates.find(rate => rate.code === currencyCode) || null;
}
