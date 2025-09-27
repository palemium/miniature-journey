# CNB API Contract

## External API: Czech National Bank Exchange Rates

### Endpoint
```
GET https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt
```

### Request Parameters
- **Method**: GET
- **Headers**: None required
- **Query Parameters**: None required
- **Authentication**: None required (public API)

### Response Format
**Content-Type**: text/plain;charset=UTF-8
**Status Codes**:
- `200 OK`: Success - returns exchange rates data
- `4xx`: Client error
- `5xx`: Server error

### Response Schema (Text Format)
```
Date | Country | Currency | Amount | Code | Rate
{date} | {country} | {currency} | {amount} | {code} | {rate}
{date} | {country} | {currency} | {amount} | {code} | {rate}
...
```

### Field Specifications
| Field | Type | Description | Example | Validation |
|-------|------|-------------|---------|------------|
| Date | String | Date of exchange rates | "27 Sep 2024" | Valid date format |
| Country | String | Country name | "Australia" | Non-empty string |
| Currency | String | Currency name | "dollar" | Non-empty string |
| Amount | Number | Units of foreign currency | 1 | Positive integer |
| Code | String | ISO 4217 currency code | "AUD" | 3 uppercase letters |
| Rate | Number | Exchange rate (foreign per CZK) | 15.391 | Positive decimal |

### Example Response
```
Date | Country | Currency | Amount | Code | Rate
27 Sep 2024 | Australia | dollar | 1 | AUD | 15.391
27 Sep 2024 | Brazil | real | 1 | BRL | 4.128
27 Sep 2024 | Canada | dollar | 1 | CAD | 16.713
27 Sep 2024 | China | renminbi | 1 | CNY | 3.072
27 Sep 2024 | Denmark | krone | 1 | DKK | 3.229
27 Sep 2024 | EMU | euro | 1 | EUR | 25.285
27 Sep 2024 | Hong Kong | dollar | 1 | HKD | 3.077
27 Sep 2024 | Hungary | forint | 100 | HUF | 6.399
27 Sep 2024 | Japan | yen | 100 | JPY | 15.391
27 Sep 2024 | Norway | krone | 1 | NOK | 2.133
27 Sep 2024 | Poland | zloty | 1 | PLN | 5.879
27 Sep 2024 | Romania | leu | 1 | RON | 5.088
27 Sep 2024 | Sweden | krona | 1 | SEK | 2.193
27 Sep 2024 | Switzerland | franc | 1 | CHF | 26.713
27 Sep 2024 | Turkey | lira | 1 | TRY | 0.745
27 Sep 2024 | United Kingdom | pound | 1 | GBP | 30.285
27 Sep 2024 | USA | dollar | 1 | USD | 23.285
```

### Expected Behavior
- **Success**: Returns 200 status with pipe-delimited text data
- **Rate Limiting**: No official rate limiting documented
- **Availability**: Updated daily, typically available by 14:30 CET
- **Data Freshness**: Contains current day's exchange rates

### Error Scenarios
| Scenario | Expected Response | Application Behavior |
|----------|------------------|---------------------|
| Network connectivity lost | Connection timeout | Show "Network error" message |
| API server down | 5xx status code | Show "Service unavailable" message |
| Invalid URL | 404 Not Found | Show "Configuration error" message |
| malformed response | Invalid text format | Show "Data parsing error" message |
| Weekend/holiday | Previous day's data | Use available data with date notice |

### Performance Requirements
- **Response Time**: < 2 seconds for successful responses
- **Data Size**: Typically 5-10KB of text data
- **Cache Strategy**: Cache for 24 hours, respect cache headers

### Security Considerations
- **HTTPS**: Required (API served over HTTPS)
- **Data Sensitivity**: Public data, no sensitive information
- **CORS**: Should allow cross-origin requests from web applications

### Testing Strategy
- **Mock responses**: Test with various data scenarios
- **Error handling**: Test all error scenarios
- **Data validation**: Test parsing with malformed data
- **Network conditions**: Test timeout and offline scenarios

### Integration Notes
- **Base Currency**: All rates are expressed as foreign currency per 1 CZK
- **Amount Field**: Some currencies use amounts other than 1 (e.g., HUF = 100)
- **Date Format**: Uses "DD Mon YYYY" format (e.g., "27 Sep 2024")
- **Encoding**: UTF-8 character encoding
- **Line Endings**: Unix-style (\n) line endings