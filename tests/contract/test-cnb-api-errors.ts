import { describe, it, expect } from 'vitest'

describe('CNB API Error Handling Contract', () => {
  it('should handle empty response', () => {
    const emptyResponse = ''

    expect(() => parseCnbTextResponse(emptyResponse)).toThrow('Empty response')
  })

  it('should handle malformed response - missing header', () => {
    const malformedResponse = `27 Sep 2024 | USA | dollar | 1 | USD | 23.285
27 Sep 2024 | EMU | euro | 1 | EUR | 25.285`

    expect(() => parseCnbTextResponse(malformedResponse)).toThrow('Invalid format')
  })

  it('should handle malformed response - wrong number of columns', () => {
    const malformedResponse = `Date | Country | Currency | Amount | Code | Rate
27 Sep 2024 | USA | dollar | 1 | USD
27 Sep 2024 | EMU | euro | 1 | EUR | 25.285`

    expect(() => parseCnbTextResponse(malformedResponse)).toThrow('Invalid column count')
  })

  it('should handle invalid date format', () => {
    const invalidDateResponse = `Date | Country | Currency | Amount | Code | Rate
Invalid Date | USA | dollar | 1 | USD | 23.285`

    expect(() => parseCnbTextResponse(invalidDateResponse)).toThrow('Invalid date')
  })

  it('should handle invalid rate format', () => {
    const invalidRateResponse = `Date | Country | Currency | Amount | Code | Rate
27 Sep 2024 | USA | dollar | 1 | USD | invalid_rate`

    expect(() => parseCnbTextResponse(invalidRateResponse)).toThrow('Invalid rate')
  })

  it('should handle invalid amount format', () => {
    const invalidAmountResponse = `Date | Country | Currency | Amount | Code | Rate
27 Sep 2024 | USA | dollar | invalid_amount | USD | 23.285`

    expect(() => parseCnbTextResponse(invalidAmountResponse)).toThrow('Invalid amount')
  })
})