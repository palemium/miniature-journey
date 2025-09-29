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

  // Create date using UTC to avoid iOS Safari date parsing issues
  const monthMap: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
    led: 0,
    úno: 1,
    bře: 2,
    dub: 3,
    kvě: 4,
    čvn: 5,
    čvc: 6,
    srp: 7,
    zář: 8,
    říj: 9,
    lis: 10,
    pro: 11,
  };

  const monthNum = monthMap[month.substring(0, 3)];
  if (monthNum === undefined) {
    throw new Error(`Invalid month format: ${month}`);
  }

  const date = new Date(Date.UTC(parseInt(year), monthNum, parseInt(day)));

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
