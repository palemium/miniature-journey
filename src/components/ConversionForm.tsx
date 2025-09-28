import styled from 'styled-components'
import { ErrorMessage } from './ErrorMessage'
import { formatExchangeRate, formatCurrency } from '@/utils/conversionCalculator'
import { ExchangeRates, ConversionErrors } from '@/types'

interface ConversionFormProps {
  amount: string
  selectedCurrency: string
  conversionErrors: ConversionErrors
  exchangeRates: ExchangeRates | null
  onAmountChange: (amount: string) => void
  onCurrencyChange: (currency: string) => void
  isLoading?: boolean
  className?: string
}

const FormContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
`

const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 2px solid ${({ hasError }) => (hasError ? '#dc3545' : '#dee2e6')};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? '#dc3545' : '#007bff')};
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #6c757d;
  }
`

const Select = styled.select<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 2px solid ${({ hasError }) => (hasError ? '#dc3545' : '#dee2e6')};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? '#dc3545' : '#007bff')};
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`

const ErrorMessageStyled = styled(ErrorMessage)`
  margin-bottom: 1rem;
`


const HelpText = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
`

const CurrencyDisplay = styled.div`
  font-size: 0.875rem;
  color: #28a745;
  font-weight: 500;
  margin-top: 0.25rem;
`

const ConversionResult = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  font-size: 0.875rem;
`

const ConversionAmount = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #28a745;
  margin-bottom: 0.75rem;
`

const ExchangeRateText = styled.div`
  color: #6c757d;
  margin-bottom: 0.5rem;
`

const DateInfo = styled.div`
  color: #6c757d;
  font-size: 0.8125rem;
`

export function ConversionForm({
  amount,
  selectedCurrency,
  conversionErrors,
  exchangeRates,
  onAmountChange,
  onCurrencyChange,
  isLoading = false,
  className
}: ConversionFormProps) {
  if (!exchangeRates) {
    return (
      <FormContainer className={className}>
        <Title>Currency Converter</Title>
        <div style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
          Loading exchange rates...
        </div>
      </FormContainer>
    )
  }

  const selectedRate = exchangeRates.rates.find(
    rate => rate.code === selectedCurrency
  )

  const amountNum = parseFloat(amount)
  const isValidConversion = !isNaN(amountNum) && amountNum > 0 && selectedRate && !conversionErrors.amount && !conversionErrors.currency

  let convertedAmount = 0
  if (isValidConversion) {
    convertedAmount = amountNum / (selectedRate.rate / selectedRate.amount)
  }

  return (
    <FormContainer className={className}>
      <Title>Currency Converter</Title>

      {conversionErrors.conversion && (
        <ErrorMessageStyled
          message={conversionErrors.conversion}
          type="error"
        />
      )}

      <FormGrid>
        <FormGroup>
          <Label htmlFor="amount">
            Amount (CZK)
          </Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Enter amount in CZK"
            min="0"
            step="1"
            max="1000000"
            hasError={!!conversionErrors.amount}
            disabled={isLoading}
            aria-invalid={!!conversionErrors.amount}
            aria-describedby={conversionErrors.amount ? 'amount-error' : undefined}
          />
          {conversionErrors.amount && (
            <div id="amount-error" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {conversionErrors.amount}
            </div>
          )}
          <HelpText>Enter amount to convert from Czech Koruna</HelpText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="currency">
            To Currency
          </Label>
          <Select
            id="currency"
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            hasError={!!conversionErrors.currency}
            disabled={isLoading}
            aria-invalid={!!conversionErrors.currency}
            aria-describedby={conversionErrors.currency ? 'currency-error' : undefined}
          >
            <option value="">Select currency</option>
            {exchangeRates.rates.map((rate) => (
              <option key={rate.id} value={rate.code}>
                {rate.code} - {rate.currency}
              </option>
            ))}
          </Select>
          {conversionErrors.currency && (
            <div id="currency-error" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {conversionErrors.currency}
            </div>
          )}
          {selectedRate && (
            <CurrencyDisplay>
              {formatExchangeRate(selectedRate.rate, 'CZK', selectedRate.code, selectedRate.amount)}
            </CurrencyDisplay>
          )}
        </FormGroup>
      </FormGrid>

      {isValidConversion && (
        <ConversionResult>
          <ConversionAmount>
            {formatCurrency(amountNum, 'CZK')} = {formatCurrency(convertedAmount, selectedRate.code)}
          </ConversionAmount>
          <ExchangeRateText>
            Exchange rate: 1 {selectedRate.code} = {(selectedRate.rate / selectedRate.amount).toFixed(3)} CZK
          </ExchangeRateText>
          <DateInfo>
            Rate date: {new Date(exchangeRates.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </DateInfo>
        </ConversionResult>
      )}
    </FormContainer>
  )
}