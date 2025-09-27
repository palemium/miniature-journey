# Data Model: Czech National Bank Currency Exchange App

## Core Types

### CurrencyRate
Represents an individual currency exchange rate from the Czech National Bank.

```typescript
interface CurrencyRate {
  id: string;           // Unique identifier (currency code)
  country: string;      // Country name (e.g., "Australia")
  currency: string;     // Currency name (e.g., "dollar")
  amount: number;       // Units of foreign currency (e.g., 1)
  code: string;         // Currency code (e.g., "AUD")
  rate: number;         // Exchange rate (foreign currency per CZK)
  lastUpdated: Date;    // When this rate was last fetched
}
```

### ConversionRequest
Represents a user's request to convert CZK to a foreign currency.

```typescript
interface ConversionRequest {
  amountCZK: number;    // Amount in Czech Koruna to convert
  targetCurrency: string; // Target currency code (e.g., "USD")
  timestamp: Date;      // When the request was made
}
```

### ConversionResult
Represents the result of a currency conversion calculation.

```typescript
interface ConversionResult {
  originalAmount: number;   // Original CZK amount
  originalCurrency: string; // Always "CZK"
  targetAmount: number;     // Converted amount in target currency
  targetCurrency: string;   // Target currency code
  exchangeRate: number;    // Rate used for conversion
  conversionDate: Date;     // Date of exchange rates used
  timestamp: Date;          // When conversion was calculated
}
```

### ExchangeRateData
Represents the complete set of exchange rates from CNB.

```typescript
interface ExchangeRateData {
  date: Date;              // Date of exchange rates
  rates: CurrencyRate[];    // Array of all currency rates
  fetchedAt: Date;         // When data was fetched from API
}
```

## API Response Format

### CNB Text API Response
The Czech National Bank API returns data in pipe-delimited text format:

```
Date | Country | Currency | Amount | Code | Rate
27 Sep 2024 | Australia | dollar | 1 | AUD | 15.391
27 Sep 2024 | Brazil | real | 1 | BRL | 4.128
27 Sep 2024 | Canada | dollar | 1 | CAD | 16.713
27 Sep 2024 | China | renminbi | 1 | CNY | 3.072
...
```

### Parsed Data Structure
After parsing the CNB response, we get structured data:

```typescript
{
  date: new Date('2024-09-27'),
  rates: [
    {
      id: 'AUD',
      country: 'Australia',
      currency: 'dollar',
      amount: 1,
      code: 'AUD',
      rate: 15.391,
      lastUpdated: new Date()
    },
    {
      id: 'BRL',
      country: 'Brazil',
      currency: 'real',
      amount: 1,
      code: 'BRL',
      rate: 4.128,
      lastUpdated: new Date()
    }
    // ... more currencies
  ],
  fetchedAt: new Date()
}
```

## Data Validation Rules

### CurrencyRate Validation
- `id` must be a valid ISO 4217 currency code (3 letters)
- `country` must be non-empty string
- `currency` must be non-empty string
- `amount` must be positive number
- `code` must match `id` and be valid ISO 4217 code
- `rate` must be positive number
- `lastUpdated` must be valid Date object

### ConversionRequest Validation
- `amountCZK` must be positive number (minimum 0.01)
- `targetCurrency` must be valid ISO 4217 currency code
- `timestamp` must be valid Date object

### ConversionResult Validation
- `originalAmount` must match request amount
- `originalCurrency` must be "CZK"
- `targetAmount` must be calculated correctly
- `targetCurrency` must match request
- `exchangeRate` must be valid rate from available data
- `conversionDate` must be date of exchange rates used

## Business Logic Rules

### Currency Conversion Calculation
```
targetAmount = (amountCZK / exchangeRate) * amount
```

Where:
- `amountCZK` is the CZK amount to convert
- `exchangeRate` is the CNB rate (foreign currency per CZK)
- `amount` is the units of foreign currency from CNB data

Example: Convert 100 CZK to AUD
- CNB rate: 1 AUD = 15.391 CZK
- Calculation: (100 / 15.391) × 1 = 6.496 AUD

### Data Freshness
- Exchange rates are updated daily by CNB
- Application should check for new rates on app start
- Cached rates should be considered stale after 24 hours
- User should be informed when using stale rates

### Available Currencies
- All currencies returned by CNB API are available for conversion
- CZK is always the base currency (not available for conversion target)
- Filter out invalid or test currencies if present in API response

## Error States

### API Errors
- Network connectivity issues
- API server errors (5xx, 4xx)
- Invalid response format
- Rate limiting

### Data Validation Errors
- Malformed CNB response
- Missing required fields
- Invalid numeric values
- Invalid currency codes

### Conversion Errors
- Invalid CZK amount (negative, zero, too large)
- Invalid target currency
- Missing exchange rate data
- Stale exchange rate data

## State Management

### Application State
```typescript
interface AppState {
  exchangeRates: ExchangeRateData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}
```

### UI Component State
```typescript
interface CurrencyListState {
  searchQuery: string;
  sortBy: 'code' | 'country' | 'rate';
  sortOrder: 'asc' | 'desc';
}

interface ConversionFormState {
  amountCZK: string;
  selectedCurrency: string;
  conversionResult: ConversionResult | null;
  formErrors: {
    amount?: string;
    currency?: string;
  };
}
```

## Data Relationships

### One-to-Many Relationships
- One `ExchangeRateData` contains many `CurrencyRate` objects
- One `CurrencyRate` can be used for many `ConversionRequest` objects
- One `ConversionRequest` produces one `ConversionResult`

### Data Flow
1. App starts → Fetch `ExchangeRateData` from CNB API
2. User inputs `ConversionRequest` → Calculate `ConversionResult`
3. Display `ConversionResult` to user
4. Repeat step 2-3 for new conversions

## Performance Considerations

### Data Size
- CNB API typically returns ~30-50 currencies
- Each rate record is ~100-200 bytes
- Total response size is typically 5-10KB

### Memory Usage
- Exchange rates cached in memory
- No persistent storage required
- State managed through React hooks

### Caching Strategy
- Cache exchange rates for 24 hours
- Background refresh when app becomes active
- Stale data handling with user notification