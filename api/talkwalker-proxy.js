// Vercel serverless function to proxy Talkwalker API requests
// This avoids CORS issues by making the request server-side

import {
  validateTalkwalkerConfig,
  getTalkwalkerBaseUrls,
  makeTalkwalkerRequest,
  handleProxyError,
  handleProxySuccess,
  validateRequestMethod,
  getRequestTiming,
  logRequest
} from './utils/talkwalkerProxyUtils.js';

export default async function handler(req, res) {
  const startTime = Date.now();
  
  // Validate request method
  const methodError = validateRequestMethod(req, res);
  if (methodError) return methodError;

  // Validate Talkwalker configuration
  const configValidation = validateTalkwalkerConfig();
  if (!configValidation.success) {
    return res.status(configValidation.status).json({
      error: configValidation.error,
      message: configValidation.message
    });
  }

  try {
    const { config } = configValidation;
    
    // Prepare the request payload
    const payload = {
      origin: config.origin,
      context: [config.workspaceId],
      accountId: config.accountId,
      userEmail: config.userEmail,
    };

    // Get base URLs
    const baseUrls = getTalkwalkerBaseUrls(config.baseUrl);

    // Make the request
    const result = await makeTalkwalkerRequest(
      baseUrls,
      '/api/v3/yeti/list',
      config.accessToken,
      payload
    );

    const timing = getRequestTiming(startTime);

    if (result.success) {
      logRequest('Talkwalker List Proxy', timing, true);
      return handleProxySuccess(res, result.data);
    } else {
      logRequest('Talkwalker List Proxy', timing, false, result.error);
      return handleProxyError(res, new Error(result.error), 'Talkwalker List API request');
    }

  } catch (error) {
    const timing = getRequestTiming(startTime);
    logRequest('Talkwalker List Proxy', timing, false, error);
    return handleProxyError(res, error, 'Talkwalker List Proxy');
  }
}
