import { typedSupabase, isSupabaseConfigured, type Database } from '../lib/supabase';
import { MOCK_BRANDS, MOCK_SIGNALS } from '../constants/mockData';
import { talkwalkerService } from './talkwalker';
import type { 
  EnhancedBrandDetails, 
  EnhancedSignal, 
  BrandId, 
  SignalId,
  CreateBrandForm,
  CreateSignalForm,
  UpdateSignalForm,
  BrandGoal,
  CreateBrandGoalForm,
  UpdateBrandGoalForm,
  BrandCompetitor,
  CreateBrandCompetitorForm,
  UpdateBrandCompetitorForm,
  ISODateString
} from '../types/enhanced';
import { createBrandId, createISODateString } from '../utils/typeUtils';

// Type-safe database row types
type BrandRow = Database['public']['Tables']['brands']['Row'];
type SignalRow = Database['public']['Tables']['signals']['Row'];

// Brand service functions
export const brandService = {
  // Get all brands
  async getAllBrands(): Promise<EnhancedBrandDetails[]> {
    if (!isSupabaseConfigured) {
      console.log('Using mock data for brands');
      return MOCK_BRANDS;
    }

    const { data, error } = await typedSupabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch brands: ${error.message}`);
    }

    return data.map(transformBrandFromDB);
  },

  // Get brand by ID
  async getBrandById(id: BrandId): Promise<EnhancedBrandDetails | null> {
    if (!isSupabaseConfigured) {
      console.log('Using mock data for brand by ID:', id);
      // Convert BrandId to string for comparison with mock data
      const brandIdStr = id.toString();
      return MOCK_BRANDS.find(brand => brand.id.toString() === brandIdStr) || null;
    }

    const { data, error } = await typedSupabase
      .from('brands')
      .select('*')
      .eq('id', Number(id as unknown as string))
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Brand not found
      }
      throw new Error(`Failed to fetch brand: ${error.message}`);
    }

    return transformBrandFromDB(data);
  },

  // Create new brand
  async createBrand(brandData: CreateBrandForm): Promise<EnhancedBrandDetails> {
    const brandToInsert: Database['public']['Tables']['brands']['Insert'] = {
      name: brandData.name,
      description: brandData.description || null,
      website: brandData.website || null,
      industry: brandData.industry || null,
      location: null,
      employees: brandData.employeeCount ? brandData.employeeCount.toString() : null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await typedSupabase
      .from('brands')
      .insert(brandToInsert)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create brand: ${error.message}`);
    }

    return transformBrandFromDB(data);
  },

  // Update brand
  async updateBrand(id: BrandId, updates: Partial<CreateBrandForm>): Promise<EnhancedBrandDetails> {
    const updateData: Database['public']['Tables']['brands']['Update'] = {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.website !== undefined && { website: updates.website }),
      ...(updates.industry !== undefined && { industry: updates.industry }),
      ...(updates.employeeCount !== undefined && { employees: updates.employeeCount?.toString() ?? null }),
    };

    const { data, error } = await typedSupabase
      .from('brands')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update brand: ${error.message}`);
    }

    return transformBrandFromDB(data);
  },

  // Delete brand
  async deleteBrand(id: BrandId): Promise<void> {
    const { error } = await typedSupabase
      .from('brands')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete brand: ${error.message}`);
    }
  },
};

// Signal service functions - now backed by Supabase `signals` table when configured
export const signalService = {
  // Get all signals
  async getAllSignals(): Promise<EnhancedSignal[]> {
    if (!isSupabaseConfigured) {
      console.log('Using mock data for signals');
      return MOCK_SIGNALS;
    }

    const { data, error } = await typedSupabase
      .from('signals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch signals: ${error.message}`);
    }

    return (data || []).map(transformSignalFromDB);
  },

  // Get signal by ID
  async getSignalById(id: SignalId): Promise<EnhancedSignal | null> {
    if (!isSupabaseConfigured) {
      console.log('Using mock data for signal by ID:', id);
      const signalIdStr = id.toString();
      return MOCK_SIGNALS.find(signal => signal.id.toString() === signalIdStr) || null;
    }

    const { data, error } = await typedSupabase
      .from('signals')
      .select('*')
      .eq('id', Number(id as unknown as string))
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') return null;
      throw new Error(`Failed to fetch signal: ${error.message}`);
    }

    return transformSignalFromDB(data);
  },

  // Get signals by brand ID
  async getSignalsByBrandId(brandId: BrandId): Promise<EnhancedSignal[]> {
    if (!isSupabaseConfigured) {
      console.log('Using mock data for signals by brand ID:', brandId);
      const brandIdStr = brandId.toString();
      return MOCK_SIGNALS.filter(signal => signal.brandId?.toString() === brandIdStr);
    }

    const { data, error } = await typedSupabase
      .from('signals')
      .select('*')
      .eq('brand_id', Number(brandId as unknown as string))
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch brand signals: ${error.message}`);
    }

    return (data || []).map(transformSignalFromDB);
  },

  // Create signal
  async createSignal(data: CreateSignalForm): Promise<EnhancedSignal> {
    const placeholderInsights = `This is a placeholder for AI insights about "${data.name}". Detailed analysis will appear here.`;
    const placeholderRecommendations = [
      'Placeholder recommendation 1 – generated text will go here.',
      'Placeholder recommendation 2 – generated text will go here.',
      'Placeholder recommendation 3 – generated text will go here.'
    ];

    if (!isSupabaseConfigured) {
      console.log('Using mock data for signal creation:', data);
      const newSignal: EnhancedSignal = {
        id: `signal-${Date.now()}` as SignalId,
        name: data.name,
        prompt: data.prompt,
        type: data.type || 'Analytics',
        status: 'active',
        createdAt: new Date().toISOString() as ISODateString,
        updatedAt: new Date().toISOString() as ISODateString,
        tags: data.tags || [],
        brandId: data.brandId,
        metadata: {
          copilotType: data.copilotType,
          copilotId: data.copilotId,
        },
        aiInsights: {
          content: placeholderInsights,
        },
        aiRecommendations: placeholderRecommendations,
      };
      MOCK_SIGNALS.push(newSignal);
      return newSignal;
    }

    const insertPayload: Database['public']['Tables']['signals']['Insert'] = {
      name: data.name,
      prompt: data.prompt,
      brand_id: Number(data.brandId as unknown as string),
      copilot_id: data.copilotId || null,
      insights: placeholderInsights,
      recommendations: JSON.stringify(placeholderRecommendations),
      updated_at: new Date().toISOString(),
    };

    const { data: inserted, error } = await typedSupabase
      .from('signals')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create signal: ${error.message}`);
    }

    return transformSignalFromDB(inserted);
  },

  // Create signal with AI insights from Talkwalker
  async createSignalWithAI(
    data: CreateSignalForm,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void
  ): Promise<EnhancedSignal> {
    onProgress?.('Initializing signal creation...');

    // If no copilot is selected, fall back to regular signal creation
    if (!data.copilotId) {
      onProgress?.('No copilot selected, creating signal with placeholder insights...');
      return this.createSignal(data);
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
      
      // Use the raw AI response as insights
      const insights = {
        content: aiContent,
        recommendations: this.extractRecommendations(aiContent),
      };
      
      onProgress?.('Saving signal with AI insights...');

      // Create the signal with real AI insights
      if (!isSupabaseConfigured) {
        console.log('Using mock data for signal creation with AI:', data);
        const newSignal: EnhancedSignal = {
          id: `signal-${Date.now()}` as SignalId,
          name: data.name,
          prompt: data.prompt,
          type: data.type || 'Analytics',
          status: 'active',
          createdAt: new Date().toISOString() as ISODateString,
          updatedAt: new Date().toISOString() as ISODateString,
          tags: data.tags || [],
          brandId: data.brandId,
          metadata: {
            copilotType: data.copilotType,
            copilotId: data.copilotId,
            talkwalkerRequestId: chatResponse.request_id,
          },
          aiInsights: {
            content: insights.content,
          },
          aiRecommendations: insights.recommendations,
        };
        MOCK_SIGNALS.push(newSignal);
        return newSignal;
      }

      const insertPayload: Database['public']['Tables']['signals']['Insert'] = {
        name: data.name,
        prompt: data.prompt,
        brand_id: Number(data.brandId as unknown as string),
        copilot_id: data.copilotId || null,
        insights: insights.content,
        recommendations: JSON.stringify(insights.recommendations),
        updated_at: new Date().toISOString(),
      };

      const { data: inserted, error } = await typedSupabase
        .from('signals')
        .insert(insertPayload)
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to create signal: ${error.message}`);
      }

      onProgress?.('Signal created successfully!');
      return transformSignalFromDB(inserted);

    } catch (error) {
      console.error('Failed to create signal with AI insights:', error);
      onProgress?.('AI insights failed, creating signal with placeholder data...');
      
      // Fall back to regular signal creation if AI fails
      return this.createSignal(data);
    }
  },

  // Helper function to extract recommendations from AI response
  extractRecommendations(aiContent: string): string[] {
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
  },

  // Refresh AI insights for an existing signal
  async refreshSignalInsights(
    signalId: SignalId,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void
  ): Promise<EnhancedSignal> {
    onProgress?.('Loading signal details...');

    // Get the existing signal
    const existingSignal = await this.getSignalById(signalId);
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
      if (!isSupabaseConfigured) {
        console.log('Using mock data for signal insights refresh:', signalId);
        
        // Find and update the signal in mock data
        const signalIndex = MOCK_SIGNALS.findIndex(s => s.id === signalId);
        if (signalIndex !== -1) {
          MOCK_SIGNALS[signalIndex] = {
            ...MOCK_SIGNALS[signalIndex],
            aiInsights: {
              content: insights.content,
            },
            aiRecommendations: insights.recommendations,
            metadata: {
              ...MOCK_SIGNALS[signalIndex].metadata,
              talkwalkerRequestId: chatResponse.request_id,
              lastRefreshed: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString() as ISODateString,
          };
          return MOCK_SIGNALS[signalIndex];
        }
        throw new Error('Signal not found in mock data');
      }

      // Update in Supabase
      const updatePayload: Database['public']['Tables']['signals']['Update'] = {
        insights: insights.content,
        recommendations: JSON.stringify(insights.recommendations),
        updated_at: new Date().toISOString(),
      };

      const { data: updated, error } = await typedSupabase
        .from('signals')
        .update(updatePayload)
        .eq('id', Number(signalId as unknown as string))
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to update signal insights: ${error.message}`);
      }

      onProgress?.('AI insights refreshed successfully!');
      return transformSignalFromDB(updated);

    } catch (error) {
      console.error('Failed to refresh signal insights:', error);
      onProgress?.('Failed to refresh insights. Please try again.');
      throw error;
    }
  },

  // Update signal
  async updateSignal(_id: SignalId, _updates: UpdateSignalForm): Promise<EnhancedSignal> {
    if (!isSupabaseConfigured) {
      throw new Error('Signal updates not supported in mock mode');
    }

    const id = Number(_id as unknown as string);
    const updateData: Database['public']['Tables']['signals']['Update'] = {
      name: _updates.name,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await typedSupabase
      .from('signals')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update signal: ${error.message}`);
    }

    return transformSignalFromDB(data);
  },

  // Delete signal
  async deleteSignal(_id: SignalId): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Signal deletion not supported in mock mode');
    }

    const id = Number(_id as unknown as string);
    const { error } = await typedSupabase
      .from('signals')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete signal: ${error.message}`);
    }
  },
};

// Brand Goals service functions
export const brandGoalsService = {
  // Get all goals for a brand
  async getGoalsByBrandId(brandId: BrandId): Promise<BrandGoal[]> {
    if (!isSupabaseConfigured) {
      console.log('Using mock data for brand goals by brand ID:', brandId);
      // Return empty array for mock data since we don't have mock goals yet
      return [];
    }

    const { data, error } = await typedSupabase
      .from('brand_goals')
      .select('*')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false });

    if (error) {
      // If the brand_goals table doesn't exist, return empty array
      if (error.message.includes('Could not find the table') || error.message.includes('relation "public.brand_goals" does not exist')) {
        console.warn('Brand goals table not found, returning empty array.');
        return [];
      }
      throw new Error(`Failed to fetch brand goals: ${error.message}`);
    }

    return data || [];
  },

  // Create new goal
  async createGoal(goalData: CreateBrandGoalForm): Promise<BrandGoal> {
    if (!isSupabaseConfigured) {
      throw new Error('Cannot create brand goal: Supabase not configured');
    }

    const { data, error } = await typedSupabase
      .from('brand_goals')
      .insert({
        name: goalData.name,
        brand_id: goalData.brand_id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create brand goal: ${error.message}`);
    }

    return data as BrandGoal;
  },

  // Update goal
  async updateGoal(id: number, updates: UpdateBrandGoalForm): Promise<BrandGoal> {
    if (!isSupabaseConfigured) {
      throw new Error('Cannot update brand goal: Supabase not configured');
    }

    const updateData = {
      ...(updates.name && { name: updates.name }),
    };

    const { data, error } = await typedSupabase
      .from('brand_goals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update brand goal: ${error.message}`);
    }

    return data as BrandGoal;
  },

  // Delete goal
  async deleteGoal(id: number): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Cannot delete brand goal: Supabase not configured');
    }

    const { error } = await typedSupabase
      .from('brand_goals')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete brand goal: ${error.message}`);
    }
  },
};

// Brand Competitors service functions
export const brandCompetitorsService = {
  // Get all competitors for a brand
  async getCompetitorsByBrandId(brandId: BrandId): Promise<BrandCompetitor[]> {
    if (!isSupabaseConfigured) {
      console.log('Using mock data for brand competitors by brand ID:', brandId);
      // Return empty array for mock data since we don't have mock competitors yet
      return [];
    }

    const { data, error } = await typedSupabase
      .from('brand_competitors')
      .select('*')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false });

    if (error) {
      // If the brand_competitors table doesn't exist, return empty array
      if (error.message.includes('Could not find the table') || error.message.includes('relation "public.brand_competitors" does not exist')) {
        console.warn('Brand competitors table not found, returning empty array.');
        return [];
      }
      throw new Error(`Failed to fetch brand competitors: ${error.message}`);
    }

    return data || [];
  },

  // Create new competitor
  async createCompetitor(competitorData: CreateBrandCompetitorForm): Promise<BrandCompetitor> {
    if (!isSupabaseConfigured) {
      throw new Error('Cannot create brand competitor: Supabase not configured');
    }

    const { data, error } = await typedSupabase
      .from('brand_competitors')
      .insert({
        name: competitorData.name,
        brand_id: competitorData.brand_id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create brand competitor: ${error.message}`);
    }

    return data as BrandCompetitor;
  },

  // Update competitor
  async updateCompetitor(id: number, updates: UpdateBrandCompetitorForm): Promise<BrandCompetitor> {
    if (!isSupabaseConfigured) {
      throw new Error('Cannot update brand competitor: Supabase not configured');
    }

    const updateData = {
      ...(updates.name && { name: updates.name }),
    };

    const { data, error } = await typedSupabase
      .from('brand_competitors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update brand competitor: ${error.message}`);
    }

    return data as BrandCompetitor;
  },

  // Delete competitor
  async deleteCompetitor(id: number): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Cannot delete brand competitor: Supabase not configured');
    }

    const { error } = await typedSupabase
      .from('brand_competitors')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete brand competitor: ${error.message}`);
    }
  },
};

// Transform functions to convert database rows to our application types
function transformBrandFromDB(dbBrand: BrandRow): EnhancedBrandDetails {
  return {
    id: createBrandId(dbBrand.id),
    name: dbBrand.name || '',
    description: dbBrand.description || '',
    website: dbBrand.website || '',
    industry: dbBrand.industry || '',
    employeeCount: dbBrand.employees ? parseInt(dbBrand.employees) || 0 : 0,
    createdAt: createISODateString(dbBrand.created_at),
    updatedAt: createISODateString(dbBrand.created_at),
  };
}

// Transform DB signal row to EnhancedSignal used in UI
function transformSignalFromDB(db: SignalRow): EnhancedSignal {
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
      try { return JSON.parse(db.recommendations); } catch { return [db.recommendations]; }
    })(),
  };
}

