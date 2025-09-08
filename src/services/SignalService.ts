import { BrandedBaseService } from './BaseService';
import { withServiceErrorHandling } from './ServiceDecorator';
import { configService } from '../config/ConfigurationService';
import { talkwalkerService } from './talkwalker';
import { openAIService } from './OpenAIService';
import { brandGoalsService } from './database';
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
    onProgress?: (message: string) => void
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
        data.brandId
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
   * Refresh AI insights for an existing signal
   */
  async refreshInsights(
    signalId: SignalId,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void
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
      
      // Use the raw AI response as insights
      const insights = {
        content: aiContent,
        recommendations: this.extractRecommendations(aiContent),
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
   * Helper function to extract recommendations from AI response
   */
  private extractRecommendations(aiContent: string): string[] {
    const lines = aiContent.split('\n').filter(line => line.trim());
    const recommendations: string[] = [];

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Look for recommendation patterns
      if (lowerLine.includes('recommend') || lowerLine.includes('suggest') || lowerLine.includes('action')) {
        // Extract individual recommendations
        if (line.includes('•') || line.includes('-') || line.includes('*')) {
          const cleanRec = line.replace(/^[•\-*]\s*/, '').trim();
          if (cleanRec) recommendations.push(cleanRec);
        }
      }
    }

    // If no specific recommendations found, provide generic ones
    if (recommendations.length === 0) {
      recommendations.push('Monitor social media sentiment regularly');
      recommendations.push('Analyze competitor strategies');
      recommendations.push('Track consumer behavior patterns');
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
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
    brandId: BrandId
  ): Promise<string[]> {
    try {
      // Get brand goals
      const brandGoals = await brandGoalsService.getGoalsByBrandId(brandId);
      
      const request = {
        insights,
        brandDetails,
        brandGoals: brandGoals.map(goal => ({ name: goal.name })),
      };

      return await openAIService.generateRecommendations(request);
    } catch (error) {
      console.error('Failed to generate OpenAI recommendations:', error);
      // Fallback to simple recommendations
      return [
        'Monitor social media sentiment regularly',
        'Analyze competitor strategies',
        'Track consumer behavior patterns',
      ];
    }
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
