# Czech National Bank Currency Exchange App

## Project Overview

React-based web application that displays current Czech National Bank exchange rates and provides CZK to foreign currency conversion functionality.

## Technology Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Styled Components
- **Data Fetching**: React Query
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite
- **Language**: TypeScript 5.0+

## Key Features

1. **Exchange Rates Display**: Fetches and displays daily rates from CNB API
2. **Currency Conversion**: Real-time CZK to foreign currency conversion
3. **Search & Filter**: Find currencies by country or code
4. **Error Handling**: Graceful handling of API and network errors
5. **Responsive Design**: Works on mobile and desktop

## Project Structure

```
src/
├── components/     # React components (CurrencyList, ConversionForm, etc.)
├── hooks/         # Custom hooks (useCurrencyRates, useCurrencyConversion)
├── services/      # API services (cnbApi.ts)
├── types/         # TypeScript interfaces (currency.ts)
├── utils/         # Utility functions (parsers.ts)
├── App.tsx        # Main application component
└── index.tsx      # Application entry point
```

## Constitutional Requirements

1. **Test-First Development**: All code must have comprehensive test coverage
2. **Code Quality**: Follow TypeScript best practices and SOLID principles
3. **Performance**: UI interactions <100ms, API responses <200ms

## CNB API Integration

- **Endpoint**: `https://www.cnb.cz/.../daily.txt`
- **Format**: Pipe-delimited text with daily exchange rates
- **Parsing**: Custom parser for text format
- **Caching**: 24-hour cache with React Query

## Development Commands

- `npm run dev` - Start development server
- `npm test` - Run all tests
- `npm run build` - Build for production
- `npm run test:coverage` - Run tests with coverage

## Testing Strategy

- **Unit Tests**: Individual components and utilities
- **Integration Tests**: API integration and component interactions
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Load and response time testing
