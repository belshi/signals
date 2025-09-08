import { configService } from '../config/ConfigurationService';
import { enhancedFetch } from './RequestInterceptor';

export interface OpenAIRecommendationRequest {
  insights: string;
  brandDetails: {
    name: string;
    industry: string;
    description: string;
  };
  brandGoals: Array<{
    name: string;
  }>;
}

export class OpenAIService {
  private readonly baseUrl = 'https://api.openai.com/v1';
  private readonly model = 'gpt-3.5-turbo';

  /**
   * Generate recommendations based on insights, brand details, and goals
   */
  async generateRecommendations(
    request: OpenAIRecommendationRequest
  ): Promise<string[]> {
    if (!configService.openai.isConfigured) {
      throw new Error('OpenAI not configured. Cannot generate recommendations.');
    }

    const prompt = this.createRecommendationPrompt(request);
    
    const response = await enhancedFetch<any>(
      `${this.baseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${configService.openai.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a marketing strategy expert. Generate actionable recommendations based on insights, brand context, and goals.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      },
      'OpenAI Recommendations'
    );

    if (!response.choices || !response.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const content = response.choices[0].message.content;
    return this.parseRecommendations(content);
  }

  /**
   * Create a prompt for generating recommendations
   */
  private createRecommendationPrompt(request: OpenAIRecommendationRequest): string {
    const goalsText = request.brandGoals.length > 0 
      ? request.brandGoals.map(goal => `- ${goal.name}`).join('\n')
      : 'No specific goals defined';

    return `Based on the following insights, brand details, and goals, generate 3-5 actionable marketing recommendations.

BRAND DETAILS:
- Name: ${request.brandDetails.name}
- Industry: ${request.brandDetails.industry}
- Description: ${request.brandDetails.description}

BRAND GOALS:
${goalsText}

INSIGHTS:
${request.insights}

Please provide 3-5 specific, actionable recommendations that align with the brand's goals and leverage the insights provided. Each recommendation should be concise and actionable.`;
  }

  /**
   * Parse recommendations from OpenAI response
   */
  private parseRecommendations(content: string): string[] {
    const lines = content.split('\n').filter(line => line.trim());
    const recommendations: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      // Look for numbered or bulleted recommendations
      if (trimmed.match(/^\d+\./) || trimmed.match(/^[-•*]/)) {
        const cleanRec = trimmed.replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, '').trim();
        if (cleanRec) {
          recommendations.push(cleanRec);
        }
      }
    }

    // If no structured recommendations found, split by sentences
    if (recommendations.length === 0) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
      recommendations.push(...sentences.slice(0, 5).map(s => s.trim()));
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  }
}

export const openAIService = new OpenAIService();
