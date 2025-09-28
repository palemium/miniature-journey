import styled from 'styled-components'
import { Button } from './Button'
import { formatCurrency, formatExchangeRate } from '@/utils/conversionCalculator'
import type { ConversionResult as ConversionResultType } from '@/types'

interface ConversionResultProps {
  result: ConversionResultType | null
  isLoading?: boolean
  error?: string | null
  onConvertAgain?: () => void
  className?: string
}

const ResultContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6c757d;
`

const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const fadeInAnimation = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const SuccessContainer = styled.div`
  ${fadeInAnimation}
  animation: fadeIn 0.5s ease-in;
`

const ConversionAmount = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #28a745;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const DetailItem = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
  font-weight: 500;
`

const DetailValue = styled.div`
  font-size: 1rem;
  color: #333;
  font-weight: 600;
`

const ExchangeRateInfo = styled.div`
  background-color: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`

const ExchangeRateText = styled.div`
  font-size: 0.875rem;
  color: #1565c0;
  font-weight: 500;
`

const DateInfo = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.5rem;
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;
  color: #dc3545;
`

const ActionButton = styled(Button)`
  min-width: 150px;
`

const Timestamp = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 1rem;
  font-style: italic;
`

function formatAmount(amount: number, currency: string): string {
  return formatCurrency(amount, currency)
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export function ConversionResult({
  result,
  isLoading = false,
  error,
  onConvertAgain,
  className
}: ConversionResultProps) {
  if (isLoading) {
    return (
      <ResultContainer className={className}>
        <LoadingContainer>
          <Spinner />
          <div>Converting...</div>
        </LoadingContainer>
      </ResultContainer>
    )
  }

  if (error) {
    return (
      <ResultContainer className={className}>
        <ErrorContainer>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Conversion Failed
          </div>
          <div>{error}</div>
          {onConvertAgain && (
            <ActionButton
              variant="primary"
              onClick={onConvertAgain}
              $marginTop="1.5rem"
            >
              Try Again
            </ActionButton>
          )}
        </ErrorContainer>
      </ResultContainer>
    )
  }

  if (!result) {
    return null
  }

  return (
    <ResultContainer className={className}>
      <SuccessContainer>
        <ConversionAmount>
          {formatAmount(result.originalAmount, result.originalCurrency)} ={' '}
          {formatAmount(result.targetAmount, result.targetCurrency)}
        </ConversionAmount>

        <ExchangeRateInfo>
          <ExchangeRateText>
            Exchange rate: {formatExchangeRate(result.exchangeRate, 'CZK', result.targetCurrency, result.currencyAmount)}
          </ExchangeRateText>
          <DateInfo>Rate date: {formatDate(result.conversionDate)}</DateInfo>
        </ExchangeRateInfo>

        <DetailsGrid>
          <DetailItem>
            <DetailLabel>Original Amount</DetailLabel>
            <DetailValue>{formatAmount(result.originalAmount, result.originalCurrency)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Converted Amount</DetailLabel>
            <DetailValue>{formatAmount(result.targetAmount, result.targetCurrency)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Exchange Rate</DetailLabel>
            <DetailValue>{formatExchangeRate(result.exchangeRate, 'CZK', result.targetCurrency, result.currencyAmount)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Rate Date</DetailLabel>
            <DetailValue>{formatDate(result.conversionDate)}</DetailValue>
          </DetailItem>
        </DetailsGrid>

        {onConvertAgain && (
          <ActionButton
            variant="primary"
            onClick={onConvertAgain}
          >
            Convert Again
          </ActionButton>
        )}

        <Timestamp>
          Converted on {formatDateTime(result.timestamp)}
        </Timestamp>
      </SuccessContainer>
    </ResultContainer>
  )
}