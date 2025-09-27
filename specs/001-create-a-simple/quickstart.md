# Quickstart Guide: Czech National Bank Currency Exchange App

## Overview
This guide will help you set up and run the Czech National Bank Currency Exchange App, a React-based web application that displays current exchange rates and provides currency conversion functionality.

## Prerequisites

### System Requirements
- Node.js 18+
- npm 9+ or yarn 1.22+
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)

### Development Tools
- Git
- Code editor (VS Code recommended)
- Terminal/bash shell

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd miniature-journey
git checkout 001-create-a-simple
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Verify Setup
```bash
npm run --version
npm test --version
```

## Development

### Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will open automatically at `http://localhost:5173`

### Development Features
- Hot Module Replacement (HMR)
- TypeScript error checking
- React Developer Tools integration
- Styled Components debugging

## Testing

### Run All Tests
```bash
npm test
# or
yarn test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
# or
yarn test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
# or
yarn test:coverage
```

### Test Categories
- **Unit Tests**: Individual component and utility function tests
- **Integration Tests**: Component interaction and API integration tests
- **Contract Tests**: API response validation and data parsing tests

## Building for Production

### Build Application
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

### Production Output
- `dist/` directory contains optimized build files
- Static files ready for deployment
- Source maps for debugging

## Application Features

### 1. Exchange Rates Display
- Automatically fetches latest rates from Czech National Bank
- Displays 30+ currencies with their exchange rates
- Search and filter functionality
- Sort by code, country, or rate

### 2. Currency Conversion
- Convert CZK to any available currency
- Real-time conversion as you type
- Accurate calculations using official CNB rates
- Clear result display with exchange rate information

### 3. User Experience
- Responsive design for mobile and desktop
- Loading states and error handling
- Accessible interface with keyboard navigation
- Professional styling with country flags

## API Integration

### Czech National Bank API
- **Endpoint**: Daily exchange rates from CNB
- **Format**: Text-based response with pipe-delimited data
- **Updates**: Daily, typically by 14:30 CET
- **Reliability**: Official government source

### Data Processing
- Automatic parsing of text format
- Type-safe data structures
- Error handling for malformed responses
- Caching for performance optimization

## Code Structure

### Source Organization
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

### Test Organization
```
tests/
├── components/         # Component tests
├── hooks/             # Hook tests
├── services/          # Service tests
└── utils/             # Utility function tests
```

## Development Workflow

### 1. Feature Development
1. Create feature branch from `main`
2. Write tests first (TDD approach)
3. Implement functionality to make tests pass
4. Verify all tests pass
5. Submit pull request

### 2. Testing Requirements
- Minimum 80% test coverage
- All unit tests must pass
- Integration tests for user workflows
- Accessibility tests for UI components

### 3. Code Quality
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for code formatting
- Pre-commit hooks for validation

## Configuration Files

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

### Key Dependencies
- **React 18+**: UI framework with TypeScript support
- **Vite**: Build tool and development server
- **Styled Components**: CSS-in-JS styling solution
- **React Query**: Data fetching and caching
- **Vitest**: Testing framework
- **Testing Library**: React testing utilities

## Troubleshooting

### Common Issues

#### Network Errors
- Check internet connection
- Verify CNB API accessibility
- Check for CORS issues in development

#### Build Errors
- Ensure Node.js version compatibility
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript configuration

#### Test Failures
- Update dependencies: `npm update`
- Clear test cache: `npm test --clearCache`
- Check test environment configuration

### Getting Help

1. Check console for error messages
2. Review browser developer tools
3. Check network tab for API responses
4. Verify all dependencies are properly installed

## Deployment

### Static Deployment
The application can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

### Deployment Steps
1. Run `npm run build` to create production build
2. Upload `dist/` directory to hosting service
3. Configure routing if necessary (SPA-friendly)
4. Set up custom domain if desired

### Environment Variables
No environment variables required for basic functionality. For production:
- `VITE_CNB_API_URL`: Custom CNB API endpoint (optional)

## Performance Considerations

### Optimization Features
- Lazy loading of components
- Code splitting for large bundles
- Image optimization for flags
- Efficient data caching

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- API response time: < 200ms
- UI interactions: < 100ms

## Accessibility

### Features
- Screen reader support with ARIA labels
- Keyboard navigation throughout
- High contrast mode support
- Focus management for modals

### Testing
- Automated accessibility testing
- Manual testing with screen readers
- Keyboard-only navigation testing
- Color contrast validation

## Contributing

### Development Standards
- Follow TypeScript best practices
- Write tests for all new features
- Update documentation for changes
- Use semantic commit messages

### Submitting Changes
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request
5. Address review feedback

## License

This project follows the repository's license terms.