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
          model: 'gpt-4o-mini',
          temperature: 0.4,
          max_tokens: 1500,
          messages: [
            {
              role: 'system',
              content: 'From the user prompt, generate recommendations directly for each insight provided. For every listed insight, produce 5–7 comprehensive, actionable recommendations that are aligned with the brand\'s strategic goals. Output must follow the schema.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'insights_recommendations',
              strict: true,
              schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  insights: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        insight: { type: 'string' },
                        recommendations: {
                          type: 'array',
                          minItems: 5,
                          maxItems: 7,
                          items: { type: 'string' }
                        }
                      },
                      required: ['insight', 'recommendations']
                    }
                  }
                },
                required: ['insights']
              }
            }
          }
        }),
      },
      'OpenAI Recommendations'
    );

    if (!response.choices || !response.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const content = response.choices[0].message.content;
    return this.parseStructuredRecommendations(content);
  }

  /**
   * Create a prompt for generating recommendations
   */
  private createRecommendationPrompt(request: OpenAIRecommendationRequest): string {
    const goalsText = request.brandGoals.length > 0 
      ? request.brandGoals.map((goal, index) => `${index + 1}. ${goal.name}`).join('\n')
      : 'No specific goals defined';

    return `Locale hint: en

User prompt:
Brand: ${request.brandDetails.name}
Industry: ${request.brandDetails.industry}
Description: ${request.brandDetails.description}

Brand Goals:
${goalsText}

Talkwalker Insights (Key Issues Identified from Social Media & Sentiment Analysis):
${request.insights}

Task: For each insight, generate 5–7 clear, actionable recommendations that both mitigate the specific risk and support the brand's performance marketing goals.`;
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
   * Parse structured recommendations from JSON response
   */
  private parseStructuredRecommendations(content: string): string[] {
    try {
      const parsed = JSON.parse(content);
      
      if (!parsed.insights || !Array.isArray(parsed.insights)) {
        throw new Error('Invalid response structure');
      }

      const allRecommendations: string[] = [];
      
      for (const insightData of parsed.insights) {
        if (insightData.recommendations && Array.isArray(insightData.recommendations)) {
          allRecommendations.push(...insightData.recommendations);
        }
      }

      return allRecommendations.filter(rec => rec && rec.trim().length > 10);
    } catch (error) {
      console.error('Failed to parse structured recommendations:', error);
      // Fallback to simple parsing
      return this.parseRecommendations(content);
    }
  }

  /**
   * Clean recommendation text by removing excessive markdown while preserving basic formatting
   */
  private cleanRecommendationText(text: string): string {
    return text
      .trim()
      // Remove excessive markdown formatting but preserve basic ones
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
      .replace(/#{1,6}\s*/g, '') // Remove headers
      .replace(/^\s*[-•*]\s*/gm, '') // Remove bullet points
      .replace(/^\s*\d+\.\s*/gm, '') // Remove numbered list markers
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export const openAIService = new OpenAIService();
