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

export const talkwalkerService = {
  async listCopilots(signal?: AbortSignal): Promise<TalkwalkerCopilot[]> {
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
};


