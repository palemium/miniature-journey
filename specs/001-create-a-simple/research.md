# Research: Czech National Bank Currency Exchange App

## Czech National Bank API Analysis

### Decision: Use CNB Daily Exchange Rates Text API
**Rationale**: The CNB provides a simple text format API that returns daily exchange rates in a structured format. This is perfect for our needs as it's lightweight, easy to parse, and provides official rates.

**API Details**:
- URL: https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt
- Format: Plain text with pipe-delimited values
- Content: Date | Country | Currency | Amount | Code | Rate

### Data Format Analysis
The API returns data in this format:
```
Date | Country | Currency | Amount | Code | Rate
27 Sep 2024 | Australia | dollar | 1 | AUD | 15.391
27 Sep 2024 | Brazil | real | 1 | BRL | 4.128
...
```

**Key Insights**:
- CZK is the base currency (rates are foreign currency per CZK)
- Each line contains: country name, currency name, amount, currency code, exchange rate
- The "Amount" field represents how many units of the foreign currency correspond to the rate
- For conversion: CZK × (1/rate) × amount = foreign currency amount

## Technology Stack Research

### React with TypeScript
**Decision**: React 18+ with TypeScript for type safety and modern React features
**Rationale**:
- Component-based architecture perfect for UI-driven app
- TypeScript provides compile-time type checking
- Large ecosystem and community support
- Hooks simplify state management logic

### Styled Components
**Decision**: Use Styled Components for styling
**Rationale**:
- CSS-in-JS approach keeps styles co-located with components
- Theme support for consistent design
- Dynamic styling capabilities
- No CSS class name conflicts

### React Query
**Decision**: Use React Query for data fetching and caching
**Rationale**:
- Automatic caching and background refetching
- Built-in loading and error states
- Optimistic updates support
- Devtools for debugging
- Handles stale-while-revalidate strategies

### Testing Strategy
**Decision**: Jest + React Testing Library + @testing-library/user-event
**Rationale**:
- Jest provides comprehensive testing framework
- React Testing Library focuses on testing behavior, not implementation
- User-event library simulates real user interactions
- Aligns with Constitution Principle I (Test-First Development)

## CNB Data Parsing Strategy

### Text Format Parsing
**Decision**: Custom parser for CNB text format
**Rationale**:
- Simple, predictable format
- No need for heavy CSV parsing libraries
- Direct parsing provides better performance
- Full control over error handling

### Parsing Algorithm
1. Split text by newlines
2. Skip header line
3. Split each line by pipe (|) character
4. Trim whitespace from each field
5. Validate data integrity
6. Convert to TypeScript interfaces

## Error Handling Strategy

### Network Errors
**Decision**: Graceful degradation with user-friendly messages
**Rationale**:
- Network issues are common in web applications
- Users should understand what's happening
- App should remain functional even when data is unavailable

### Data Validation
**Decision**: Validate all parsed data before use
**Rationale**:
- External API data format could change
- Malformed data could break the application
- Type safety requires valid data structures

## Performance Considerations

### Data Caching
**Decision**: Use React Query's built-in caching
**Rationale**:
- Exchange rates don't change frequently (daily updates)
- Reduces unnecessary API calls
- Improves perceived performance
- Provides offline capability

### Real-time Conversion
**Decision**: Calculate conversions on client-side
**Rationale**:
- No server-side processing required
- Instant feedback to users
- Reduces server load
- Works offline after initial data load

## Accessibility Considerations

### Screen Reader Support
**Decision**: Use semantic HTML and ARIA labels
**Rationale**:
- Constitution Principle III requires accessibility
- Financial applications need to be usable by everyone
- Legal requirements in many jurisdictions

### Keyboard Navigation
**Decision**: Ensure full keyboard accessibility
**Rationale**:
- Some users cannot use mouse
- Power users prefer keyboard navigation
- Mobile screen reader users rely on keyboard

## Internationalization

### Number Formatting
**Decision**: Use browser's Intl.NumberFormat API
**Rationale**:
- Automatic locale-specific formatting
- Built-in to all modern browsers
- No additional dependencies required
- Proper currency symbol placement

### Currency Display
**Decision**: Show currency codes and symbols where appropriate
**Rationale**:
- Users expect to see both codes and symbols
- Reduces confusion between similar currency names
- Standard financial application practice

## Security Considerations

### XSS Prevention
**Decision**: React's built-in XSS protection + proper content sanitization
**Rationale**:
- Financial applications are high-value targets
- User trust is paramount
- Regulatory compliance requirements

### HTTPS Enforcement
**Decision**: Use HTTPS for all API calls
**Rationale**:
- Protects data in transit
- Modern browser requirement
- Best practice for web applications

## Conclusion

The research confirms that a React-based single-page application using the specified technology stack is appropriate for this currency exchange application. The CNB API provides reliable data in a parsable format, and the chosen technologies align with all three constitutional principles while providing excellent user experience and maintainability.