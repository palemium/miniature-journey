// Czech National Bank (CNB) Exchange Rates API Proxy for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests for CNB API
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are supported for CNB Exchange Rates API'
    });
  }

  try {
    // CNB Exchange Rates API endpoint from project environment
    const CNB_API_URL = 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt';

    console.log(`Proxying CNB exchange rates request`);

    // Make the request to CNB API with proper headers
    const response = await fetch(CNB_API_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'CNB-Exchange-Rates-Proxy/1.0',
        'Accept': 'text/plain;charset=UTF-8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`CNB API returned status: ${response.status}`);
    }

    // Get the text response from CNB API
    const textData = await response.text();

    // Validate response data
    if (!textData || textData.trim() === '') {
      throw new Error('Empty response from CNB API');
    }

    // Set appropriate content type and headers
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('X-CNB-API-Proxy', 'true');
    res.setHeader('X-Fetched-At', new Date().toISOString());

    // Forward the CNB API response
    res.status(200).send(textData);

  } catch (error) {
    console.error('CNB API proxy error:', error);

    // Return appropriate error response
    res.status(500).json({
      error: 'Failed to fetch CNB exchange rates',
      message: error.message,
      timestamp: new Date().toISOString(),
      suggestion: 'Please try again later or check CNB API status'
    });
  }
}