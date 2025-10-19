import { ExchangeRates } from '@/types';
import { parseCnbTextResponse, createExchangeRates } from '@/utils/cnbParser';

const CNB_API_URL = '/api/proxy';

export interface CnbApiError {
  type: 'network' | 'http' | 'parse' | 'unknown';
  message: string;
  status?: number;
}

export class CnbApiService {
  private baseUrl: string;

  constructor(baseUrl: string = CNB_API_URL) {
    this.baseUrl = baseUrl;
  }

  async fetchExchangeRates(): Promise<ExchangeRates> {
    try {
      const response = await fetch(this.baseUrl);

      if (!response.ok) {
        throw {
          type: 'http',
          message: `HTTP error! status: ${response.status}`,
          status: response.status,
        } as CnbApiError;
      }

      const text = await response.text();

      if (!text || text.trim() === '') {
        throw {
          type: 'parse',
          message: 'Empty response from CNB API',
        } as CnbApiError;
      }

      try {
        const parsedData = parseCnbTextResponse(text);
        return createExchangeRates(parsedData);
      } catch (parseError) {
        throw {
          type: 'parse',
          message: `Failed to parse CNB response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`,
        } as CnbApiError;
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'type' in error) {
        throw error;
      }

      throw {
        type: 'network',
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown network error'}`,
      } as CnbApiError;
    }
  }

  async fetchExchangeRatesWithFallback(): Promise<ExchangeRates> {
    try {
      return await this.fetchExchangeRates();
    } catch (error) {
      if (this.isCnbApiError(error) && error.type === 'parse') {
        throw error;
      }
      throw error;
    }
  }

  private isCnbApiError(error: unknown): error is CnbApiError {
    return (
      error !== null &&
      typeof error === 'object' &&
      'type' in error &&
      'message' in error
    );
  }
}

export const cnbApiService = new CnbApiService();

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  return await cnbApiService.fetchExchangeRates();
}

export async function fetchExchangeRatesWithFallback(): Promise<ExchangeRates> {
  return await cnbApiService.fetchExchangeRatesWithFallback();
}

export function isCnbApiError(error: unknown): error is CnbApiError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'type' in error &&
    'message' in error
  );
}

export function getCnbApiErrorMessage(error: unknown): string {
  if (isCnbApiError(error)) {
    switch (error.type) {
      case 'network':
        return 'Failed to connect to CNB API. Please check your internet connection.';
      case 'http':
        if (error.status === 404) {
          return 'CNB API endpoint not found. Please try again later.';
        } else if (error.status === 403) {
          return 'Access to CNB API forbidden. Please try again later.';
        } else if (error.status === 429) {
          return 'Too many requests to CNB API. Please wait before trying again.';
        } else {
          return `CNB API request failed (HTTP ${error.status}). Please try again later.`;
        }
      case 'parse':
        return 'Failed to parse exchange rates data. The API response format may have changed.';
      default:
        return 'An unknown error occurred while fetching exchange rates.';
    }
  }

  return error instanceof Error ? error.message : 'An unknown error occurred';
}
