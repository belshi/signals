/**
 * Shared utilities for Talkwalker proxy functions
 */

/**
 * Validate Talkwalker configuration
 */
export function validateTalkwalkerConfig() {
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
    return {
      error: 'Talkwalker not configured',
      message: 'Missing VITE_TALKWALKER_BASE_URL or VITE_TALKWALKER_ACCESS_TOKEN',
      status: 400
    };
  }

  // Check required body fields
  const missingFields = [];
  if (!VITE_TALKWALKER_ORIGIN) missingFields.push('VITE_TALKWALKER_ORIGIN');
  if (!VITE_TALKWALKER_WORKSPACE_ID) missingFields.push('VITE_TALKWALKER_WORKSPACE_ID');
  if (!VITE_TALKWALKER_ACCOUNT_ID) missingFields.push('VITE_TALKWALKER_ACCOUNT_ID');
  if (!VITE_TALKWALKER_USER_EMAIL) missingFields.push('VITE_TALKWALKER_USER_EMAIL');

  if (missingFields.length > 0) {
    return {
      error: 'Missing Talkwalker configuration',
      message: `Missing required fields: ${missingFields.join(', ')}`,
      status: 400
    };
  }

  return {
    success: true,
    config: {
      baseUrl: VITE_TALKWALKER_BASE_URL,
      accessToken: VITE_TALKWALKER_ACCESS_TOKEN,
      origin: VITE_TALKWALKER_ORIGIN,
      workspaceId: VITE_TALKWALKER_WORKSPACE_ID,
      accountId: VITE_TALKWALKER_ACCOUNT_ID,
      userEmail: VITE_TALKWALKER_USER_EMAIL,
    }
  };
}

/**
 * Get base URLs for Talkwalker API
 */
export function getTalkwalkerBaseUrls(baseUrl) {
  return [
    baseUrl.replace(/\/$/, ''),
    baseUrl.includes('api.talkwalker.com') ? 'https://app.talkwalker.com' : undefined,
  ].filter(Boolean);
}

/**
 * Make Talkwalker API request with fallback
 */
export async function makeTalkwalkerRequest(baseUrls, endpoint, accessToken, payload) {
  let lastError = null;
  let lastResponse = null;

  for (const base of baseUrls) {
    const url = `${base}${endpoint}?access_token=${encodeURIComponent(accessToken)}`;

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
        return { success: true, data };
      } else {
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        lastResponse = response;
      }
    } catch (err) {
      lastError = err;
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Unknown error',
    details: lastResponse ? {
      status: lastResponse.status,
      statusText: lastResponse.statusText
    } : null
  };
}

/**
 * Handle proxy error response
 */
export function handleProxyError(res, error, operation = 'Talkwalker API request') {
  console.error(`${operation} error:`, error);
  
  return res.status(500).json({
    error: `${operation} failed`,
    message: error.message || 'Unknown error',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Handle proxy success response
 */
export function handleProxySuccess(res, data) {
  return res.status(200).json(data);
}

/**
 * Validate request method
 */
export function validateRequestMethod(req, res, allowedMethods = ['POST']) {
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: 'Method not allowed',
      message: `Only ${allowedMethods.join(', ')} requests are supported`,
      allowedMethods
    });
  }
  return null;
}

/**
 * Get request timing information
 */
export function getRequestTiming(startTime) {
  const endTime = Date.now();
  return {
    startTime,
    endTime,
    duration: endTime - startTime
  };
}

/**
 * Log request information
 */
export function logRequest(operation, timing, success, error = null) {
  const logData = {
    operation,
    timing,
    success,
    timestamp: new Date().toISOString(),
  };

  if (error) {
    logData.error = error.message || error;
  }

  if (success) {
    console.log(`[${operation}] Success in ${timing.duration}ms`);
  } else {
    console.error(`[${operation}] Failed in ${timing.duration}ms:`, error);
  }
}
