# Czech National Bank Currency Converter

A modern, responsive web application for converting Czech Koruna (CZK) to foreign currencies using real-time exchange rates from the Czech National Bank (CNB).

## Features

- **Real-time Exchange Rates**: Fetches current exchange rates directly from CNB API
- **Currency Conversion**: Convert CZK to multiple foreign currencies
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **TypeScript**: Full type safety throughout the application
- **Testing**: Comprehensive test suite with Vitest and React Testing Library

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Styled Components
- **State Management**: React Query for data fetching and caching
- **Build Tool**: Vite
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint with Prettier
- **API**: Czech National Bank (CNB) Exchange Rates API

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd miniature-journey
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

## Development

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests in watch mode
- `npm run test:ci` - Run tests once (CI mode)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # React components
│   ├── Button.tsx
│   ├── ConversionForm.tsx
│   ├── ConversionResult.tsx
│   ├── CurrencyConverter.tsx
│   ├── CurrencyList.tsx
│   └── ErrorMessage.tsx
├── hooks/              # Custom React hooks
│   └── useCurrencyConversion.ts
├── services/           # API services
│   └── cnbApi.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── conversionCalculator.ts
│   └── validation.ts
├── theme.ts            # Styled Components theme
├── queryClient.ts      # React Query configuration
└── App.tsx             # Main App component

tests/
└── setup.ts            # Test setup and mocks
```

## API Integration

The application uses the Czech National Bank's exchange rates API:
- **Endpoint**: `https://api.cnb.cz/cnbapi/exrates/daily`
- **Rate Limit**: Free public API with reasonable usage limits
- **Data**: Daily exchange rates against CZK
- **Caching**: Exchange rates are cached for 10 minutes to reduce API calls

## Testing

The project includes a comprehensive test setup:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Structure

- **Unit Tests**: Individual component and utility function tests
- **Integration Tests**: Component interaction and API integration tests
- **Mocking**: Comprehensive mocking for CNB API and browser APIs
- **Setup**: Global test configuration in `tests/setup.ts`

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# Optional: API base URL (defaults to CNB public API)
VITE_CNB_API_URL=https://api.cnb.cz/cnbapi/exrates/daily

# Optional: Cache duration in milliseconds (defaults to 10 minutes)
VITE_CACHE_DURATION=600000
```

## Code Quality

### Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix
```

### Formatting

```bash
# Format all files
npm run format
```

### Type Checking

```bash
# Run TypeScript type checking
npm run type-check
```

## Build and Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

### Static Deployment

The application can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Any static web server

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint && npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Exchange rates provided by the [Czech National Bank](https://www.cnb.cz/)
- Built with modern web technologies and best practices
- Follows Test-Driven Development (TDD) principles

## Support

For issues and questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- Review the project documentation
- Contact the development team