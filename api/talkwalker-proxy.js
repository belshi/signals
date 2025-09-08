// Vercel serverless function to proxy Talkwalker API requests
// This avoids CORS issues by making the request server-side

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get Talkwalker configuration from environment variables
  const {
    VITE_TALKWALKER_BASE_URL,
    VITE_TALKWALKER_ACCESS_TOKEN,
    VITE_TALKWALKER_ORIGIN,
    VITE_TALKWALKER_WORKSPACE_ID,
    VITE_TALKWALKER_ACCOUNT_ID,
    VITE_TALKWALKER_USER_EMAIL,
  } = process.env;

  // Check if Talkwalker is configured
  if (!VITE_TALKWALKER_BASE_URL || !VITE_TALKWALKER_ACCESS_TOKEN) {
    return res.status(400).json({ 
      error: 'Talkwalker not configured',
      message: 'Missing VITE_TALKWALKER_BASE_URL or VITE_TALKWALKER_ACCESS_TOKEN'
    });
  }

  // Check required body fields
  const missingFields = [];
  if (!VITE_TALKWALKER_ORIGIN) missingFields.push('VITE_TALKWALKER_ORIGIN');
  if (!VITE_TALKWALKER_WORKSPACE_ID) missingFields.push('VITE_TALKWALKER_WORKSPACE_ID');
  if (!VITE_TALKWALKER_ACCOUNT_ID) missingFields.push('VITE_TALKWALKER_ACCOUNT_ID');
  if (!VITE_TALKWALKER_USER_EMAIL) missingFields.push('VITE_TALKWALKER_USER_EMAIL');

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: 'Missing Talkwalker configuration',
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  try {
    // Prepare the request payload
    const payload = {
      origin: VITE_TALKWALKER_ORIGIN,
      context: [VITE_TALKWALKER_WORKSPACE_ID],
      accountId: VITE_TALKWALKER_ACCOUNT_ID,
      userEmail: VITE_TALKWALKER_USER_EMAIL,
    };

    // Try multiple base URLs
    const bases = [
      VITE_TALKWALKER_BASE_URL.replace(/\/$/, ''),
      VITE_TALKWALKER_BASE_URL.includes('api.talkwalker.com') ? 'https://app.talkwalker.com' : undefined,
    ].filter(Boolean);

    let lastError = null;
    let lastResponse = null;

    for (const base of bases) {
      const url = `${base}/api/v3/yeti/list?access_token=${encodeURIComponent(VITE_TALKWALKER_ACCESS_TOKEN)}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          return res.status(200).json(data);
        } else {
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          lastResponse = response;
        }
      } catch (err) {
        lastError = err;
      }
    }

    // If all attempts failed, return the last error
    return res.status(500).json({ 
      error: 'Talkwalker API request failed',
      message: lastError?.message || 'Unknown error',
      details: lastResponse ? {
        status: lastResponse.status,
        statusText: lastResponse.statusText
      } : null
    });

  } catch (error) {
    console.error('Talkwalker proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
