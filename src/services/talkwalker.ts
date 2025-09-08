import { EnhancedTalkwalkerService } from './BaseTalkwalkerService';

export interface TalkwalkerCopilot {
  id: string;
  name: string;
  description?: string;
  welcome_message?: string;
  starter_questions?: string[];
  avatar_image_id?: string;
}

// TalkwalkerListResponse interface is now handled by the BaseTalkwalkerService

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

// Create enhanced Talkwalker service instance
const enhancedTalkwalkerService = new EnhancedTalkwalkerService();

// Export the service with backward compatibility
export const talkwalkerService = {
  async listCopilots(signal?: AbortSignal): Promise<TalkwalkerCopilot[]> {
    return enhancedTalkwalkerService.listCopilots(signal);
  },

  async chatWithCopilot(
    copilotId: string,
    message: string,
    brandDetails: { name: string; industry: string; description: string },
    signal?: AbortSignal
  ): Promise<TalkwalkerChatResponse> {
    return enhancedTalkwalkerService.chatWithCopilot(copilotId, message, brandDetails, signal);
  },

  // Additional enhanced methods
  async getStats() {
    return enhancedTalkwalkerService.getStats();
  },

  async clearCache() {
    return enhancedTalkwalkerService.clearCache();
  },

  async testConnectivity() {
    return enhancedTalkwalkerService.testConnectivity();
  },
};


