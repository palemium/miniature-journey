import styled from 'styled-components'
import { Button } from './Button'
import { ErrorMessage } from './ErrorMessage'
import { CurrencyList } from './CurrencyList'
import { ConversionForm } from './ConversionForm'
import { ConversionResult } from './ConversionResult'
import { useCurrencyRates, useCurrencyConversion } from '@/hooks'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #6c757d;
  margin-bottom: 2rem;
`

const RefreshButton = styled(Button)`
  margin-bottom: 2rem;
`

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  min-width: 150px;
`

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`

const SideContent = styled.div`
  display: flex;
  flex-direction: column;
`

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const LoadingContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
`

function formatLastUpdated(date: Date | null): string {
  if (!date) return 'Never'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function CurrencyConverter() {
  const {
    exchangeRates,
    isLoading: isRatesLoading,
    error: ratesError,
    refetch,
    isRefreshing,
    lastFetchTime
  } = useCurrencyRates({
    autoFetch: true,
    refreshInterval: 5 * 60 * 1000 // 5 minutes
  })

  const {
    amount,
    setAmount,
    selectedCurrency,
    setCurrency,
    conversionResult,
    errors,
    isCalculating,
    calculateNow,
    resetConversion
  } = useCurrencyConversion(exchangeRates, {
    autoCalculate: true,
    debounceMs: 300
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateNow()
  }

  const handleConvertAgain = () => {
    resetConversion()
  }

  const dismissError = () => {
    refetch()
  }

  if (isRatesLoading && !exchangeRates) {
    return (
      <Container>
        <Header>
          <Title>Currency Converter</Title>
          <Subtitle>Convert Czech Koruna to foreign currencies</Subtitle>
        </Header>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6c757d' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💱</div>
          <div style={{ fontSize: '1.25rem' }}>Loading currency rates...</div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>Currency Converter</Title>
        <Subtitle>Convert Czech Koruna to foreign currencies using CNB exchange rates</Subtitle>

        <RefreshButton
          variant="secondary"
          onClick={refetch}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Rates'}
        </RefreshButton>
      </Header>

      {ratesError && (
        <ErrorMessage
          message={ratesError}
          type="error"
          showRetry={true}
          onRetry={refetch}
          onDismiss={dismissError}
        />
      )}

      {exchangeRates && (
        <StatsContainer>
          <StatItem>
            <StatValue>{exchangeRates.rates.length}</StatValue>
            <StatLabel>Currencies</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatLastUpdated(lastFetchTime)}</StatValue>
            <StatLabel>Last Updated</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{exchangeRates.date.toLocaleDateString()}</StatValue>
            <StatLabel>Rate Date</StatLabel>
          </StatItem>
        </StatsContainer>
      )}

      <ContentGrid>
        <MainContent>
          <ConversionForm
            amount={amount}
            selectedCurrency={selectedCurrency}
            conversionErrors={errors}
            exchangeRates={exchangeRates}
            onAmountChange={setAmount}
            onCurrencyChange={setCurrency}
            onSubmit={handleFormSubmit}
            isLoading={isCalculating}
          />

          {(conversionResult || isCalculating) && (
            <ConversionResult
              result={conversionResult}
              isLoading={isCalculating}
              error={errors.conversion}
              onConvertAgain={handleConvertAgain}
            />
          )}
        </MainContent>

        <SideContent>
          <CurrencyList
            rates={exchangeRates?.rates || []}
            isLoading={isRatesLoading}
            error={ratesError}
            onRetry={refetch}
          />
        </SideContent>
      </ContentGrid>

      {isRefreshing && (
        <LoadingOverlay>
          <LoadingContent>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
            <div>Refreshing rates...</div>
          </LoadingContent>
        </LoadingOverlay>
      )}
    </Container>
  )
}