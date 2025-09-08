// Vercel serverless function to proxy Talkwalker Chat API requests
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
    
    // Get the chat request from the client
    const chatRequest = req.body;

    // Validate required fields
    if (!chatRequest.yeti_id || !chatRequest.message) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Missing required fields: yeti_id and message' 
      });
    }

    // Get base URLs
    const baseUrls = getTalkwalkerBaseUrls(config.baseUrl);

    // Make the request
    const result = await makeTalkwalkerRequest(
      baseUrls,
      '/api/v3/yeti/chat',
      config.accessToken,
      chatRequest
    );

    const timing = getRequestTiming(startTime);

    if (result.success) {
      logRequest('Talkwalker Chat Proxy', timing, true);
      return handleProxySuccess(res, result.data);
    } else {
      logRequest('Talkwalker Chat Proxy', timing, false, result.error);
      return handleProxyError(res, new Error(result.error), 'Talkwalker Chat API request');
    }

  } catch (error) {
    const timing = getRequestTiming(startTime);
    logRequest('Talkwalker Chat Proxy', timing, false, error);
    return handleProxyError(res, error, 'Talkwalker Chat Proxy');
  }
}
