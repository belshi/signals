import { config } from '../config/environment';

export interface TalkwalkerCopilot {
  id: string;
  name: string;
  description?: string;
  welcome_message?: string;
  starter_questions?: string[];
  avatar_image_id?: string;
}

interface TalkwalkerListResponse {
  status_code: string;
  status_message: string;
  yeti_answer?: {
    custom_yetis?: TalkwalkerCopilot[];
  };
}

// Chat API types
export interface TalkwalkerChatRequest {
  origin: string;
  context: string[];
  account_id: string;
  yeti_id: string;
  email: string;
  message: {
    user_id: string;
    username: string;
    timestamp: number;
    text: string;
    role: 'USER';
  };
}

export interface TalkwalkerChatResponse {
  status_code: string;
  status_message: string;
  request: string;
  request_id: string;
  yeti_answer: {
    reply: {
      avatar_url: string;
      username: string;
      content: string;
    };
  };
}

export const talkwalkerService = {
  async listCopilots(signal?: AbortSignal): Promise<TalkwalkerCopilot[]> {
    // Check if we're in a browser environment and should use the proxy
    const isBrowser = typeof window !== 'undefined';
    const shouldUseProxy = isBrowser && (config.app.isProduction || window.location.hostname !== 'localhost');

    if (shouldUseProxy) {
      // Use Vercel API proxy to avoid CORS issues
      try {
        const response = await fetch('/api/talkwalker-proxy', {
          method: 'POST',
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = (await response.json()) as TalkwalkerListResponse;
          if (data.status_code === '0') {
            return data.yeti_answer?.custom_yetis ?? [];
          } else {
            throw new Error(`Talkwalker error: ${data.status_message || 'Unknown error'}`);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Proxy request failed: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error('Talkwalker proxy request failed:', err);
        throw err;
      }
    }

    // Fallback to direct API calls (for development or when proxy is not available)
    if (!config.talkwalker.baseUrl || !config.talkwalker.accessToken) {
      console.warn('Talkwalker not configured. Skipping copilot fetch.');
      return [];
    }

    const bases = [
      config.talkwalker.baseUrl.replace(/\/$/, ''),
      config.talkwalker.baseUrl.includes('api.talkwalker.com') ? 'https://app.talkwalker.com' : undefined,
    ].filter(Boolean) as string[];

    let lastError: Error | null = null;
    for (const base of bases) {
      const url = `${base}/api/v3/yeti/list?access_token=${encodeURIComponent(config.talkwalker.accessToken)}`;

      try {
        const payload = {
          origin: String(config.talkwalker.origin || ''),
          context: [String(config.talkwalker.workspaceId || '')],
          accountId: String(config.talkwalker.accountId || ''),
          userEmail: String(config.talkwalker.userEmail || ''),
        };

        const postResp = await fetch(url, {
          method: 'POST',
          signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (postResp.ok) {
          const data = (await postResp.json()) as TalkwalkerListResponse;
          if (data.status_code === '0') {
            return data.yeti_answer?.custom_yetis ?? [];
          } else {
            lastError = new Error(`Talkwalker error: ${data.status_message || 'Unknown error'}`);
          }
        } else {
          const errorText = await postResp.text().catch(() => '');
          lastError = new Error(`Talkwalker list failed: ${postResp.status} ${postResp.statusText}${errorText ? ` - ${errorText}` : ''}`);
        }
      } catch (err) {
        lastError = err as Error;
      }
    }

    throw lastError ?? new Error('Talkwalker list failed: Unknown error');
  },

  async chatWithCopilot(
    copilotId: string,
    message: string,
    brandDetails: { name: string; industry: string; description: string },
    signal?: AbortSignal
  ): Promise<TalkwalkerChatResponse> {
    // Check if we're in a browser environment and should use the proxy
    const isBrowser = typeof window !== 'undefined';
    const shouldUseProxy = isBrowser && (config.app.isProduction || window.location.hostname !== 'localhost');

    // Create a comprehensive prompt that includes brand context
    const contextualMessage = `Brand: ${brandDetails.name}
Industry: ${brandDetails.industry}
Description: ${brandDetails.description}

User Request: ${message}

Please provide detailed insights and analysis based on the brand context and user request.`;

    const chatRequest: TalkwalkerChatRequest = {
      origin: String(config.talkwalker.origin || 'slack'),
      context: [String(config.talkwalker.workspaceId || '')],
      account_id: String(config.talkwalker.accountId || ''),
      yeti_id: copilotId,
      email: String(config.talkwalker.userEmail || ''),
      message: {
        user_id: 'U074V17S75L', // This could be made configurable
        username: 'Signal User',
        timestamp: Math.floor(Date.now() / 1000),
        text: contextualMessage,
        role: 'USER',
      },
    };

    if (shouldUseProxy) {
      // Use Vercel API proxy to avoid CORS issues
      try {
        const response = await fetch('/api/talkwalker-chat-proxy', {
          method: 'POST',
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chatRequest),
        });

        if (response.ok) {
          const data = (await response.json()) as TalkwalkerChatResponse;
          if (data.status_code === '0') {
            return data;
          } else {
            throw new Error(`Talkwalker chat error: ${data.status_message || 'Unknown error'}`);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Chat proxy request failed: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error('Talkwalker chat proxy request failed:', err);
        throw err;
      }
    }

    // Fallback to direct API calls (for development or when proxy is not available)
    if (!config.talkwalker.baseUrl || !config.talkwalker.accessToken) {
      throw new Error('Talkwalker not configured. Cannot send chat request.');
    }

    const bases = [
      config.talkwalker.baseUrl.replace(/\/$/, ''),
      config.talkwalker.baseUrl.includes('api.talkwalker.com') ? 'https://app.talkwalker.com' : undefined,
    ].filter(Boolean) as string[];

    let lastError: Error | null = null;
    for (const base of bases) {
      const url = `${base}/api/v3/yeti/chat?access_token=${encodeURIComponent(config.talkwalker.accessToken)}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(chatRequest),
        });

        if (response.ok) {
          const data = (await response.json()) as TalkwalkerChatResponse;
          if (data.status_code === '0') {
            return data;
          } else {
            lastError = new Error(`Talkwalker chat error: ${data.status_message || 'Unknown error'}`);
          }
        } else {
          const errorText = await response.text().catch(() => '');
          lastError = new Error(`Talkwalker chat failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
        }
      } catch (err) {
        lastError = err as Error;
      }
    }

    throw lastError ?? new Error('Talkwalker chat failed: Unknown error');
  },
};


