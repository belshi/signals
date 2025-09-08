// Vercel serverless function to proxy Talkwalker Chat API requests
// This avoids CORS issues by making the request server-side

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  // Get environment variables
  const {
    VITE_TALKWALKER_BASE_URL,
    VITE_TALKWALKER_ACCESS_TOKEN,
    VITE_TALKWALKER_ORIGIN,
    VITE_TALKWALKER_WORKSPACE_ID,
    VITE_TALKWALKER_ACCOUNT_ID,
    VITE_TALKWALKER_USER_EMAIL,
  } = process.env;

  // Validate required environment variables
  if (!VITE_TALKWALKER_BASE_URL || !VITE_TALKWALKER_ACCESS_TOKEN) {
    return res.status(500).json({ 
      error: 'Configuration error',
      message: 'Talkwalker configuration is missing. Please check environment variables.' 
    });
  }

  try {
    // Get the chat request from the client
    const chatRequest = req.body;

    // Validate required fields
    if (!chatRequest.yeti_id || !chatRequest.message) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Missing required fields: yeti_id and message' 
      });
    }

    // Try multiple base URLs
    const bases = [
      VITE_TALKWALKER_BASE_URL.replace(/\/$/, ''),
      VITE_TALKWALKER_BASE_URL.includes('api.talkwalker.com') ? 'https://app.talkwalker.com' : undefined,
    ].filter(Boolean);

    let lastError = null;
    let lastResponse = null;

    for (const base of bases) {
      const url = `${base}/api/v3/yeti/chat?access_token=${encodeURIComponent(VITE_TALKWALKER_ACCESS_TOKEN)}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(chatRequest),
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
      error: 'Talkwalker Chat API request failed',
      message: lastError?.message || 'Unknown error',
      details: lastResponse ? {
        status: lastResponse.status,
        statusText: lastResponse.statusText
      } : null
    });

  } catch (error) {
    console.error('Talkwalker chat proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
