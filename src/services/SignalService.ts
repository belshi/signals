import { BrandedBaseService } from './BaseService';
import { withServiceErrorHandling } from './ServiceDecorator';
import { configService } from '../config/ConfigurationService';
import { talkwalkerService } from './talkwalker';
import { openAIService } from './OpenAIService';
import { brandGoalsService } from './database';
import { enhancedFetch } from './RequestInterceptor';
import type { 
  EnhancedSignal, 
  SignalId, 
  CreateSignalForm,
  UpdateSignalForm,
  BrandId
} from '../types/enhanced';
import type { Database } from '../lib/supabase';
import { createISODateString } from '../utils/typeUtils';

/**
 * Type definitions for database operations
 */
type SignalRow = Database['public']['Tables']['signals']['Row'];
type SignalInsert = Database['public']['Tables']['signals']['Insert'];
type SignalUpdate = Database['public']['Tables']['signals']['Update'];

/**
 * Signal service that extends the base service with signal-specific functionality.
 * This service handles all signal-related database operations with consistent
 * error handling and type safety.
 */
class SignalServiceClass extends BrandedBaseService<EnhancedSignal, CreateSignalForm, UpdateSignalForm, SignalId> {
  protected tableName = 'signals' as const;

  /**
   * Transform database row to application type
   */
  protected transformFromDB = (db: SignalRow): EnhancedSignal => {
    return {
      id: (`${db.id}`) as SignalId,
      name: db.name || '',
      prompt: db.prompt || '',
      type: 'Analytics',
      status: 'active',
      createdAt: createISODateString(db.created_at),
      updatedAt: createISODateString(db.updated_at || db.created_at),
      brandId: db.brand_id != null ? (db.brand_id.toString() as unknown as BrandId) : undefined,
      metadata: db.copilot_id ? {
        copilotId: db.copilot_id,
      } : undefined,
      aiInsights: db.insights ? {
        content: db.insights,
      } : undefined,
      aiRecommendations: (() => {
        if (!db.recommendations) return undefined;
        try { 
          return JSON.parse(db.recommendations); 
        } catch { 
          return [db.recommendations]; 
        }
      })(),
    };
  };

  /**
   * Transform application form data to database insert format
   */
  private transformToInsert(data: CreateSignalForm): SignalInsert {
    const placeholderInsights = `This is a placeholder for AI insights about "${data.name}". Detailed analysis will appear here.`;
    const placeholderRecommendations = [
      'Placeholder recommendation 1 – generated text will go here.',
      'Placeholder recommendation 2 – generated text will go here.',
      'Placeholder recommendation 3 – generated text will go here.'
    ];

    return {
      name: data.name,
      prompt: data.prompt,
      brand_id: Number(data.brandId as unknown as string),
      copilot_id: data.copilotId || null,
      insights: placeholderInsights,
      recommendations: JSON.stringify(placeholderRecommendations),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Transform application update data to database update format
   */
  private transformToUpdate(updates: UpdateSignalForm): SignalUpdate {
    const updateData: SignalUpdate = {};
    
    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }
    if (updates.type !== undefined) {
      // Note: type is not stored in database, it's derived in transformFromDB
      // This could be extended to store type in a future schema update
    }
    if (updates.status !== undefined) {
      // Note: status is not stored in database, it's derived in transformFromDB
      // This could be extended to store status in a future schema update
    }

    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    return updateData;
  }

  /**
   * Create a new signal with proper data transformation
   */
  async create(data: CreateSignalForm): Promise<EnhancedSignal> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot create signal: Supabase not configured');
    }

    const insertData = this.transformToInsert(data);
    return super.create(insertData as any);
  }

  /**
   * Update a signal with proper data transformation
   */
  async update(id: SignalId, updates: UpdateSignalForm): Promise<EnhancedSignal> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot update signal: Supabase not configured');
    }

    const updateData = this.transformToUpdate(updates);
    return super.update(id, updateData as any);
  }

  /**
   * Get all signals with fallback for unconfigured Supabase
   */
  async getAll(): Promise<EnhancedSignal[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty signals array');
      return [];
    }

    return super.getAll();
  }

  /**
   * Get signal by ID with fallback for unconfigured Supabase
   */
  async getById(id: SignalId): Promise<EnhancedSignal | null> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, cannot fetch signal by ID:', id);
      return null;
    }

    return super.getById(id);
  }

  /**
   * Delete signal with configuration check
   */
  async delete(id: SignalId): Promise<void> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot delete signal: Supabase not configured');
    }

    return super.delete(id);
  }

  /**
   * Get signals by brand ID
   */
  async getByBrandId(brandId: BrandId): Promise<EnhancedSignal[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty signals array for brand ID:', brandId);
      return [];
    }

    return this.getByField('brand_id', Number(brandId as unknown as string));
  }

  /**
   * Create signal with AI insights from Talkwalker
   */
  async createWithAI(
    data: CreateSignalForm,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void,
    signal?: AbortSignal
  ): Promise<EnhancedSignal> {
    onProgress?.('Initializing signal creation...');

    // If no copilot is selected, fall back to regular signal creation
    if (!data.copilotId) {
      onProgress?.('No copilot selected, creating signal with placeholder insights...');
      return this.create(data);
    }

    try {
      onProgress?.('Getting AI insights from Talkwalker...');
      
      // Call Talkwalker chat API to get insights
      const chatResponse = await talkwalkerService.chatWithCopilot(
        data.copilotId,
        data.prompt,
        brandDetails
      );

      onProgress?.('Processing AI response...');

      // Extract insights from the chat response
      const aiContent = chatResponse.yeti_answer?.reply?.content || '';
      
      // Generate recommendations using OpenAI
      const recommendations = await this.generateOpenAIRecommendations(
        aiContent,
        brandDetails,
        data.brandId,
        data.prompt,
        signal
      );
      
      const insights = {
        content: aiContent,
        recommendations,
      };
      
      onProgress?.('Saving signal with AI insights...');

      // Create the signal with real AI insights
      if (!configService.isSupabaseConfigured) {
        throw new Error('Cannot create signal with AI: Supabase not configured');
      }

      const insertPayload: SignalInsert = {
        name: data.name,
        prompt: data.prompt,
        brand_id: Number(data.brandId as unknown as string),
        copilot_id: data.copilotId || null,
        insights: insights.content,
        recommendations: JSON.stringify(insights.recommendations),
        updated_at: new Date().toISOString(),
      };

      const { data: inserted, error } = await this.client
        .from(this.tableName)
        .insert(insertPayload)
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to create signal: ${error.message}`);
      }

      onProgress?.('Signal created successfully!');
      return this.transformFromDB(inserted);

    } catch (error) {
      console.error('Failed to create signal with AI insights:', error);
      onProgress?.('AI insights failed, creating signal with placeholder data...');
      
      // Fall back to regular signal creation if AI fails
      return this.create(data);
    }
  }

  /**
   * Refresh AI recommendations for an existing signal (OpenAI only)
   */
  async refreshRecommendations(
    signalId: SignalId,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void,
    signal?: AbortSignal
  ): Promise<EnhancedSignal> {
    onProgress?.('Loading signal details...');

    // Get the existing signal
    const existingSignal = await this.getById(signalId);
    if (!existingSignal) {
      throw new Error('Signal not found');
    }

    // Check if signal has AI insights to base recommendations on
    if (!existingSignal.aiInsights?.content) {
      throw new Error('Signal does not have AI insights. Cannot generate recommendations without insights.');
    }

    try {
      onProgress?.('Generating new AI recommendations...');
      
      // Generate new recommendations using OpenAI based on existing insights
      const recommendations = await this.generateOpenAIRecommendations(
        existingSignal.aiInsights.content,
        brandDetails,
        existingSignal.brandId || 'unknown' as BrandId,
        existingSignal.prompt,
        signal
      );
      
      onProgress?.('Updating signal with new recommendations...');

      // Update the signal with new recommendations
      if (!configService.isSupabaseConfigured) {
        throw new Error('Cannot refresh recommendations: Supabase not configured');
      }

      // Update in Supabase
      const updatePayload: SignalUpdate = {
        recommendations: JSON.stringify(recommendations),
        updated_at: new Date().toISOString(),
      };

      const { data: updated, error } = await this.client
        .from(this.tableName)
        .update(updatePayload)
        .eq('id', Number(signalId as unknown as string))
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to update signal recommendations: ${error.message}`);
      }

      onProgress?.('AI recommendations refreshed successfully!');
      return this.transformFromDB(updated);

    } catch (error) {
      console.error('Failed to refresh signal recommendations:', error);
      onProgress?.('Failed to refresh recommendations. Please try again.');
      throw error;
    }
  }

  /**
   * Refresh AI insights for an existing signal
   */
  async refreshInsights(
    signalId: SignalId,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void,
    signal?: AbortSignal
  ): Promise<EnhancedSignal> {
    onProgress?.('Loading signal details...');

    // Get the existing signal
    const existingSignal = await this.getById(signalId);
    if (!existingSignal) {
      throw new Error('Signal not found');
    }

    // Check if signal has a copilot ID
    if (!existingSignal.metadata?.copilotId) {
      throw new Error('Signal does not have a copilot assigned. Cannot refresh AI insights.');
    }

    try {
      onProgress?.('Getting fresh AI insights from Talkwalker...');
      
      // Call Talkwalker chat API to get new insights
      const chatResponse = await talkwalkerService.chatWithCopilot(
        existingSignal.metadata.copilotId as string,
        existingSignal.prompt,
        brandDetails
      );

      onProgress?.('Processing new AI response...');

      // Extract insights from the chat response
      const aiContent = chatResponse.yeti_answer?.reply?.content || '';
      
      // Generate recommendations using OpenAI
      const recommendations = await this.generateOpenAIRecommendations(
        aiContent,
        brandDetails,
        existingSignal.brandId || 'unknown' as BrandId,
        existingSignal.prompt,
        signal
      );
      
      const insights = {
        content: aiContent,
        recommendations,
      };
      
      onProgress?.('Updating signal with new insights...');

      // Update the signal with new AI insights
      if (!configService.isSupabaseConfigured) {
        throw new Error('Cannot refresh signal insights: Supabase not configured');
      }

      // Update in Supabase
      const updatePayload: SignalUpdate = {
        insights: insights.content,
        recommendations: JSON.stringify(insights.recommendations),
        updated_at: new Date().toISOString(),
      };

      const { data: updated, error } = await this.client
        .from(this.tableName)
        .update(updatePayload)
        .eq('id', Number(signalId as unknown as string))
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to update signal insights: ${error.message}`);
      }

      onProgress?.('AI insights refreshed successfully!');
      return this.transformFromDB(updated);

    } catch (error) {
      console.error('Failed to refresh signal insights:', error);
      onProgress?.('Failed to refresh insights. Please try again.');
      throw error;
    }
  }

  /**
   * Search signals by name or prompt
   */
  async search(query: string): Promise<EnhancedSignal[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty signals array for search');
      return [];
    }

    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .or(`name.ilike.%${query}%,prompt.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search signals: ${error.message}`);
    }

    return (data || []).map(this.transformFromDB);
  }

  /**
   * Get signals by copilot ID
   */
  async getByCopilotId(copilotId: string): Promise<EnhancedSignal[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty signals array for copilot ID:', copilotId);
      return [];
    }

    return this.getByField('copilot_id', copilotId);
  }

  /**
   * Generate recommendations using OpenAI
   */
  private async generateOpenAIRecommendations(
    insights: string,
    brandDetails: { name: string; industry: string; description: string },
    brandId: BrandId,
    originalPrompt?: string,
    signal?: AbortSignal
  ): Promise<string[]> {
    try {
      // Get brand goals
      const brandGoals = await brandGoalsService.getGoalsByBrandId(brandId);
      
      const request = {
        insights,
        brandDetails,
        brandGoals: brandGoals.map(goal => ({ name: goal.name })),
        originalPrompt,
        signal,
      };

      return await openAIService.generateRecommendations(request);
    } catch (error) {
      console.error('Failed to generate OpenAI recommendations:', error);
      
      // If it's a 400 error, try with a simpler request format
      if (error instanceof Error && error.message.includes('HTTP 400')) {
        console.log('Retrying with simplified request format...');
        try {
          return await this.generateRecommendationsFallback({
            insights,
            brandDetails,
            brandGoals: await brandGoalsService.getGoalsByBrandId(brandId).then(goals => goals.map(goal => ({ name: goal.name }))),
            originalPrompt,
            signal,
          });
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      
      // Final fallback to goal-oriented recommendations
      return [
        '**Monitor Brand Sentiment**: Implement regular social media monitoring to track brand perception and identify opportunities to strengthen brand reputation and customer relationships.',
        '**Competitive Intelligence**: Analyze competitor strategies and market positioning to identify gaps and opportunities that align with your brand goals.',
        '**Customer Behavior Analysis**: Track and analyze consumer behavior patterns to better understand your audience and optimize marketing strategies for goal achievement.',
      ];
    }
  }

  /**
   * Fallback method for generating recommendations with simpler format
   */
  private async generateRecommendationsFallback(request: any): Promise<string[]> {
    const prompt = this.createSimpleRecommendationPrompt(request);
    
    const response = await enhancedFetch<any>(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${configService.openai.apiKey}`,
        },
        signal: request.signal,
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.3,
          max_tokens: 1400,
          messages: [
            {
              role: 'system',
              content: 'You are a strategic marketing consultant. Generate highly specific, detailed recommendations based on the brand context, goals, and insights provided. Each recommendation should be comprehensive (4-6 sentences), very specific about tactics and implementation, and avoid generic advice. Include specific details about target audiences, content types, platforms, and expected outcomes. Return as a numbered list.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        }),
      },
      'OpenAI Recommendations Fallback'
    );

    if (!response.choices || !response.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI fallback');
    }

    return this.parseSimpleRecommendations(response.choices[0].message.content);
  }

  /**
   * Create a simple prompt for fallback recommendations
   */
  private createSimpleRecommendationPrompt(request: any): string {
    const goalsText = request.brandGoals.length > 0 
      ? request.brandGoals.map((goal: any, index: number) => `${index + 1}. ${goal.name}`).join('\n')
      : '1. General brand growth\n2. Reputation management\n3. Customer engagement';

    const originalPromptSection = request.originalPrompt 
      ? `\n\nUSER'S REQUEST: "${request.originalPrompt}"\nThis should guide your recommendations.`
      : '';

    return `You are a strategic marketing consultant. Generate recommendations that directly support brand goals and address the user's request.

BRAND: ${request.brandDetails.name} (${request.brandDetails.industry})
BRAND GOALS:
${goalsText}${originalPromptSection}

INSIGHTS: ${request.insights}

Generate 3-5 focused recommendations that include:

**RECOMMENDATION STRUCTURE:**
1. **Title**: A clear, action-oriented title
2. **Detailed Recommendation**: A comprehensive explanation (4-6 sentences) of what should be done, including specific tactics, approaches, and implementation details. Be very specific about the actions to take, target audiences, content types, platforms, and expected outcomes. Avoid generic advice.
3. **How This Supports Your Goals**: Explain how these recommendations will help with the brand goals

Format as numbered list with clear titles and detailed explanations. Each recommendation should be highly specific, detailed, and directly connected to the brand's goals and the insights provided. Avoid generic statements and provide concrete, actionable guidance.`;
  }

  /**
   * Parse simple recommendations from text response
   */
  private parseSimpleRecommendations(content: string): string[] {
    const lines = content.split('\n').filter(line => line.trim());
    const recommendations: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Look for numbered recommendations (1., 2., etc.)
      if (trimmed.match(/^\d+\./)) {
        const cleanRec = trimmed.replace(/^\d+\.\s*/, '').trim();
        if (cleanRec && cleanRec.length > 10) {
          recommendations.push(`**${cleanRec}**`);
        }
      }
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Get signal statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byBrand: Record<string, number>;
    byCopilot: Record<string, number>;
    withAIInsights: number;
  }> {
    if (!configService.isSupabaseConfigured) {
      return {
        total: 0,
        byBrand: {},
        byCopilot: {},
        withAIInsights: 0,
      };
    }

    const [total, signals] = await Promise.all([
      this.count(),
      this.getAll()
    ]);

    const byBrand = signals.reduce((acc, signal) => {
      const brandId = signal.brandId || 'Unknown';
      acc[brandId] = (acc[brandId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCopilot = signals.reduce((acc, signal) => {
      const copilotId = signal.metadata?.copilotId || 'None';
      acc[copilotId as string] = (acc[copilotId as string] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const withAIInsights = signals.filter(signal => signal.aiInsights?.content).length;

    return {
      total,
      byBrand,
      byCopilot,
      withAIInsights,
    };
  }
}

/**
 * Export the service with error handling applied
 */
export const SignalService = withServiceErrorHandling(
  SignalServiceClass,
  'SignalService',
  {
    logErrors: true,
    includeContext: true,
  }
);

/**
 * Create and export a singleton instance
 */
export const signalService = new SignalService();
