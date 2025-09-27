# Component Contracts

## 1. CurrencyList Component

### Purpose
Displays a searchable, sortable list of available currency exchange rates.

### Props
```typescript
interface CurrencyListProps {
  rates: CurrencyRate[];
  isLoading: boolean;
  error: string | null;
  onCurrencySelect?: (currencyCode: string) => void;
  selectedCurrency?: string;
}
```

### Required Props
- `rates`: Array of currency rate objects to display
- `isLoading`: Boolean indicating if data is loading
- `error`: Error message or null if no error

### Optional Props
- `onCurrencySelect`: Callback when currency is selected
- `selectedCurrency`: Currently selected currency code

### Behavior
- **Loading State**: Shows loading spinner when `isLoading` is true
- **Error State**: Shows error message when `error` is not null
- **Empty State**: Shows message when no rates available
- **Search**: Allows filtering by country name or currency code
- **Sort**: Allows sorting by code, country, or rate
- **Selection**: Highlights selected currency if provided

### UI Contract
```
┌─────────────────────────────────────────┐
│ 💰 Exchange Rates                        │
├─────────────────────────────────────────┤
│ 🔍 Search currencies...                 │
├─────────────────────────────────────────┤
│ [📊] Sort by: Code ▼                    │
├─────────────────────────────────────────┤
│ 🇺🇸 USD - US Dollar        23.285 CZK    │
│ 🇪🇺 EUR - Euro             25.285 CZK    │
│ 🇬🇧 GBP - British Pound    30.285 CZK    │
│ 🇦🇺 AUD - Australian Dollar 15.391 CZK   │
├─────────────────────────────────────────┤
│ Last updated: Sep 27, 2024 14:30       │
└─────────────────────────────────────────┘
```

### Events
- `onCurrencySelect(currencyCode)`: Triggered when user clicks on a currency
- `onSearchChange(query)`: Triggered when search query changes
- `onSortChange(sortBy, sortOrder)`: Triggered when sort criteria changes

## 2. ConversionForm Component

### Purpose
Provides form for CZK amount input and currency selection for conversion.

### Props
```typescript
interface ConversionFormProps {
  availableCurrencies: CurrencyRate[];
  onConvert: (request: ConversionRequest) => void;
  isLoading?: boolean;
  initialAmount?: string;
  initialCurrency?: string;
}
```

### Required Props
- `availableCurrencies`: Array of available currencies for selection
- `onConvert`: Callback when conversion is requested

### Optional Props
- `isLoading`: Boolean indicating if conversion is in progress
- `initialAmount`: Pre-filled CZK amount
- `initialCurrency`: Pre-selected currency code

### Behavior
- **Input Validation**: Validates CZK amount is positive number
- **Real-time Conversion**: Can trigger conversion on amount change
- **Currency Selection**: Dropdown with currency codes and country names
- **Error Display**: Shows validation errors for invalid inputs
- **Submit**: Can be triggered by button click or form submission

### UI Contract
```
┌─────────────────────────────────────────┐
│ 💱 Currency Converter                    │
├─────────────────────────────────────────┤
│ Amount in CZK:                          │
│ [ 1000.00    ]                          │
│                                         │
│ Convert to:                             │
│ [ USD - US Dollar          ▼ ]          │
│                                         │
│ [ Convert to USD ]                       │
└─────────────────────────────────────────┘
```

### Events
- `onConvert({ amountCZK, targetCurrency })`: Triggered when user requests conversion
- `onAmountChange(amount)`: Triggered when amount input changes
- `onCurrencyChange(currency)`: Triggered when currency selection changes

## 3. ConversionResult Component

### Purpose
Displays the result of a currency conversion calculation.

### Props
```typescript
interface ConversionResultProps {
  result: ConversionResult | null;
  isLoading?: boolean;
  error?: string | null;
}
```

### Required Props
- `result`: Conversion result object or null if no result

### Optional Props
- `isLoading`: Boolean indicating if conversion is in progress
- `error`: Error message if conversion failed

### Behavior
- **Loading State**: Shows loading spinner when `isLoading` is true
- **Error State**: Shows error message when `error` is provided
- **Result Display**: Shows formatted conversion result when available
- **Formatting**: Uses proper currency formatting and locale

### UI Contract
```
┌─────────────────────────────────────────┐
│ 💰 Conversion Result                     │
├─────────────────────────────────────────┤
│ 1,000.00 CZK = 42.94 USD                 │
│                                         │
│ Exchange rate: 1 USD = 23.285 CZK       │
│ Rate date: Sep 27, 2024                  │
├─────────────────────────────────────────┤
│ [ 🔄 Convert again ]                     │
└─────────────────────────────────────────┘
```

### Events
- `onConvertAgain()`: Triggered when user clicks convert again button

## 4. ErrorMessage Component

### Purpose
Displays error messages in a consistent, user-friendly format.

### Props
```typescript
interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  showRetry?: boolean;
  onRetry?: () => void;
}
```

### Required Props
- `message`: Error message to display

### Optional Props
- `type`: Type of message (default: 'error')
- `onDismiss`: Callback when message is dismissed
- `showRetry`: Whether to show retry button
- `onRetry`: Callback when retry is clicked

### Behavior
- **Display**: Shows message with appropriate styling based on type
- **Dismiss**: Allows user to dismiss the message
- **Retry**: Shows retry button when appropriate
- **Auto-dismiss**: Can automatically dismiss after timeout

### UI Contract
```
┌─────────────────────────────────────────┐
│ ⚠️  Network Error                       │
│ Unable to fetch exchange rates.         │
│ Please check your internet connection. │
│                                         │
│ [ Retry ] [ Dismiss ]                   │
└─────────────────────────────────────────┘
```

### Events
- `onDismiss()`: Triggered when user dismisses message
- `onRetry()`: Triggered when user clicks retry button

## 5. LoadingSpinner Component

### Purpose
Displays loading indicator during async operations.

### Props
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  overlay?: boolean;
}
```

### Optional Props
- `size`: Size of spinner (default: 'medium')
- `message': Optional loading message
- `overlay`: Whether to show as overlay

### Behavior
- **Animation**: Shows spinning animation
- **Message**: Displays loading message if provided
- **Overlay**: Can overlay content when `overlay` is true

### UI Contract
```
┌─────────────────────────────────────────┐
│          ⚪ ⚪ ⚪                         │
│       Loading exchange rates...         │
└─────────────────────────────────────────┘
```

## 6. App Component

### Purpose
Main application component that orchestrates all other components.

### Props
```typescript
interface AppProps {
  // No props - main application component
}
```

### Behavior
- **Data Fetching**: Manages fetching of exchange rates on app start
- **State Management**: Coordinates state between components
- **Error Handling**: Centralized error handling and display
- **Layout**: Arranges components in application layout

### UI Contract
```
┌─────────────────────────────────────────┐
│ 💰 Czech National Bank Exchange Rates   │
├─────────────────────────────────────────┤
│                                         │
│ [ Currency List Component ]              │
│                                         │
│ [ Conversion Form Component ]            │
│                                         │
│ [ Conversion Result Component ]          │
│                                         │
│ [ Error Message Component (if needed) ]  │
└─────────────────────────────────────────┘
```

## State Management Contract

### Global Application State
```typescript
interface GlobalState {
  exchangeRates: ExchangeRateData | null;
  isLoading: boolean;
  error: string | null;
  conversionResult: ConversionResult | null;
}
```

### Component Communication
- **Parent-Child**: Props drilling for configuration
- **Child-Parent**: Callback functions for events
- **Cross-Component**: Context or state management library if needed

### Data Flow
1. App component fetches exchange rates
2. Rates passed to CurrencyList component
3. User interactions trigger callbacks
4. Conversion requests processed and results displayed
5. Errors propagated and displayed appropriately