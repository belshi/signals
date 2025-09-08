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
              content: 'You are a social listening and consumer insights expert. Generate one actionable recommendation for each insight provided, in plain text format. Use numbered lists (1., 2., 3., etc.) and avoid any markdown formatting.'
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

    return `You are a social listening and consumer insights expert. Based on the brand details, brand goals, and Talkwalker insights provided, please provide a recommendation for each of these insights.

BRAND DETAILS:
- Name: ${request.brandDetails.name}
- Industry: ${request.brandDetails.industry}
- Description: ${request.brandDetails.description}

BRAND GOALS:
${goalsText}

TALKWALKER INSIGHTS:
${request.insights}

INSTRUCTIONS:
- Provide one specific recommendation for each insight mentioned above
- Each recommendation should be 1-2 sentences maximum
- Use plain text only (no markdown, no formatting)
- Make each recommendation actionable and specific to the insight
- Align recommendations with the brand's goals and industry context
- Base your recommendations on social listening and consumer insights expertise

Format your response as a simple numbered list with one recommendation per insight:
1. Recommendation for first insight
2. Recommendation for second insight
3. Recommendation for third insight
(Continue for each insight provided)`;
  }

  /**
   * Parse recommendations from OpenAI response
   */
  private parseRecommendations(content: string): string[] {
    const lines = content.split('\n').filter(line => line.trim());
    const recommendations: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Look for numbered recommendations (1., 2., etc.)
      if (trimmed.match(/^\d+\./)) {
        const cleanRec = this.cleanRecommendationText(trimmed.replace(/^\d+\.\s*/, ''));
        if (cleanRec && cleanRec.length > 10) {
          recommendations.push(cleanRec);
        }
      }
      // Look for bulleted recommendations (-, •, *)
      else if (trimmed.match(/^[-•*]/)) {
        const cleanRec = this.cleanRecommendationText(trimmed.replace(/^[-•*]\s*/, ''));
        if (cleanRec && cleanRec.length > 10) {
          recommendations.push(cleanRec);
        }
      }
    }

    // If no structured recommendations found, try to extract from paragraphs
    if (recommendations.length === 0) {
      const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 20);
      for (const paragraph of paragraphs.slice(0, 5)) {
        const cleanRec = this.cleanRecommendationText(paragraph);
        if (cleanRec && cleanRec.length > 10) {
          recommendations.push(cleanRec);
        }
      }
    }

    // Fallback: split by sentences if still no recommendations
    if (recommendations.length === 0) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 15);
      recommendations.push(...sentences.slice(0, 5).map(s => this.cleanRecommendationText(s)));
    }

    return recommendations.slice(0, 5).filter(rec => rec && rec.length > 10);
  }

  /**
   * Clean recommendation text by removing markdown and formatting
   */
  private cleanRecommendationText(text: string): string {
    return text
      .trim()
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/`(.*?)`/g, '$1') // Code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
      .replace(/#{1,6}\s*/g, '') // Headers
      .replace(/^\s*[-•*]\s*/gm, '') // Bullet points
      .replace(/^\s*\d+\.\s*/gm, '') // Numbered lists
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export const openAIService = new OpenAIService();
