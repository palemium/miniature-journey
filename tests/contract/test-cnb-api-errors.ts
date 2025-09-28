import { describe, it, expect } from 'vitest';
import { parseCnbTextResponse } from '@/utils';

describe('CNB API Error Handling Contract', () => {
  it('should handle empty response', () => {
    const emptyResponse = '';

    expect(() => parseCnbTextResponse(emptyResponse)).toThrow(
      'Invalid response format: insufficient lines'
    );
  });

  it('should handle malformed response - wrong number of columns', () => {
    const malformedResponse = `27 Sep 2024
USA|dollar|1|USD
EMU|euro|1|EUR|25.285`;

    expect(() => parseCnbTextResponse(malformedResponse)).toThrow(
      'Invalid rate format'
    );
  });

  it('should handle invalid date format', () => {
    const invalidDateResponse = `Invalid Date
USA|dollar|1|USD|23.285`;

    expect(() => parseCnbTextResponse(invalidDateResponse)).toThrow(
      'Invalid date format'
    );
  });

  it('should handle invalid rate format', () => {
    const invalidRateResponse = `27 Sep 2024
USA|dollar|1|USD|invalid_rate`;

    expect(() => parseCnbTextResponse(invalidRateResponse)).toThrow(
      'Invalid numeric values'
    );
  });

  it('should handle invalid amount format', () => {
    const invalidAmountResponse = `27 Sep 2024
USA|dollar|invalid_amount|USD|23.285`;

    expect(() => parseCnbTextResponse(invalidAmountResponse)).toThrow(
      'Invalid numeric values'
    );
  });
});
