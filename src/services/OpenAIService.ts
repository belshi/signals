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
  originalPrompt?: string;
  signal?: AbortSignal;
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
    
    // Validate prompt length and content
    if (prompt.length > 4000) {
      console.warn('Prompt is very long:', prompt.length, 'characters');
    }
    
    console.log('Generated prompt:', prompt);
    
    const requestPayload = {
      model: 'gpt-4o-mini',
      temperature: 0.3, // Reduced for more consistent output
      max_tokens: 1800, // Increased for longer, more detailed recommendations
      messages: [
        {
          role: 'system',
          content: 'You are a strategic marketing consultant. Generate highly specific, detailed recommendations based on the brand context, goals, and insights provided. Each recommendation should be comprehensive (4-6 sentences), very specific about tactics and implementation, and avoid generic advice. Include specific details about target audiences, content types, platforms, and expected outcomes. Output structured JSON format.'
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
                minItems: 1,
                maxItems: 10,
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    insight: { type: 'string' },
                    recommendations: {
                      type: 'array',
                      minItems: 1,
                      maxItems: 5,
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          title: { type: 'string' },
                          detailedRecommendation: { type: 'string' },
                          relationWithGoals: { type: 'string' }
                        },
                        required: ['title', 'detailedRecommendation', 'relationWithGoals']
                      }
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
    };

    console.log('OpenAI Request Payload:', JSON.stringify(requestPayload, null, 2));
    
    const response = await enhancedFetch<any>(
      `${this.baseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${configService.openai.apiKey}`,
        },
        signal: request.signal,
        body: JSON.stringify(requestPayload),
      },
      'OpenAI Recommendations'
    );

    if (!response.choices || !response.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    return this.parseStructuredRecommendations(response.choices[0].message.content);
  }

  /**
   * Create a prompt for generating recommendations
   * Includes brand details, goals, Talkwalker insights, and original user prompt for directional context
   */
  private createRecommendationPrompt(request: OpenAIRecommendationRequest): string {
    const goalsText = request.brandGoals.length > 0 
      ? request.brandGoals.map((goal, index) => `${index + 1}. ${goal.name}`).join('\n')
      : '1. General brand growth\n2. Reputation management\n3. Customer engagement';

    const originalPromptSection = request.originalPrompt 
      ? `\n\nUSER'S ORIGINAL REQUEST: "${request.originalPrompt}"\nThis is the user's specific question or concern that should guide the focus and direction of your recommendations.`
      : '';

    return `You are a strategic marketing consultant. Your task is to generate recommendations that directly address the user's specific request while advancing the brand's strategic goals.

BRAND CONTEXT:
- Company: ${request.brandDetails.name}
- Industry: ${request.brandDetails.industry}
- Description: ${request.brandDetails.description}

STRATEGIC BRAND GOALS:
${goalsText}${originalPromptSection}

SOCIAL MEDIA INSIGHTS (from Talkwalker analysis):
${request.insights}

CRITICAL REQUIREMENTS:
1. Each recommendation MUST directly support one or more of the brand goals listed above
2. Each recommendation MUST address the user's original request/question
3. Base recommendations on the specific insights and brand context provided

For each insight, generate 2-3 recommendations with the following structure:

**RECOMMENDATION STRUCTURE:**
- **title**: A clear, action-oriented title
- **detailedRecommendation**: A comprehensive explanation (4-6 sentences) of what should be done, including specific tactics, approaches, and implementation details. Be very specific about the actions to take, target audiences, content types, platforms, and expected outcomes. Avoid generic advice.
- **relationWithGoals**: Explain how these recommendations will help with the brand goals

Each recommendation should be highly specific, detailed, and directly connected to the brand's goals and the insights provided. Avoid generic statements and provide concrete, actionable guidance.`;
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
      console.log('Raw OpenAI response:', content);
      
      const parsed = JSON.parse(content);
      console.log('Parsed response:', parsed);
      
      if (!parsed.insights || !Array.isArray(parsed.insights)) {
        throw new Error('Invalid response structure');
      }

      const allRecommendations: string[] = [];
      
      for (const insightData of parsed.insights) {
        if (insightData.recommendations && Array.isArray(insightData.recommendations)) {
          for (const rec of insightData.recommendations) {
            if (rec && typeof rec === 'object' && rec.title && rec.detailedRecommendation) {
              // Format with simplified structure
              const relationWithGoals = rec.relationWithGoals ? `\n\n**How This Supports Your Goals:** ${rec.relationWithGoals}` : '';
              
              const formattedRec = `**${rec.title}**\n\n${rec.detailedRecommendation}${relationWithGoals}`;
              allRecommendations.push(formattedRec);
            } else if (typeof rec === 'string' && rec.trim().length > 10) {
              // Fallback for old format
              allRecommendations.push(rec);
            }
          }
        }
      }

      console.log('Formatted recommendations:', allRecommendations);
      return allRecommendations.filter(rec => rec && rec.trim().length > 10);
    } catch (error) {
      console.error('Failed to parse structured recommendations:', error);
      console.log('Raw content that failed to parse:', content);
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
