import styled from 'styled-components';
import { CurrencyRate } from '@/types';

interface CurrencyListProps {
  rates: CurrencyRate[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

const ListContainer = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
`;

const CurrencyCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;
    border-color: #adb5bd;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const CurrencyCode = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 0.25rem;
`;

const CurrencyName = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

const Country = styled.div`
  font-size: 0.75rem;
  color: #868e96;
  margin-bottom: 0.75rem;
`;

const ExchangeRate = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #28a745;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #6c757d;
`;

const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin 1s linear infinite;
  margin-right: 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
`;

export function CurrencyList({
  rates,
  isLoading = false,
  error,
  onRetry,
  className,
}: CurrencyListProps) {
  if (isLoading) {
    return (
      <ListContainer className={className}>
        <Title>Available Currencies</Title>
        <LoadingContainer>
          <Spinner />
          Loading currency rates...
        </LoadingContainer>
      </ListContainer>
    );
  }

  if (error) {
    return (
      <ListContainer className={className}>
        <Title>Available Currencies</Title>
        <EmptyState>
          <div>{error}</div>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          )}
        </EmptyState>
      </ListContainer>
    );
  }

  if (!rates || rates.length === 0) {
    return (
      <ListContainer className={className}>
        <Title>Available Currencies</Title>
        <EmptyState>No currency rates available</EmptyState>
      </ListContainer>
    );
  }

  return (
    <ListContainer className={className}>
      <Title>Available Currencies</Title>
      <Grid>
        {rates.map(rate => (
          <CurrencyCard key={rate.id}>
            <CurrencyCode>{rate.code}</CurrencyCode>
            <CurrencyName>{rate.currency}</CurrencyName>
            <Country>{rate.country}</Country>
            <ExchangeRate>
              {rate.amount} {rate.code} = {rate.rate.toFixed(3)} CZK
            </ExchangeRate>
          </CurrencyCard>
        ))}
      </Grid>
    </ListContainer>
  );
}
