import { typedSupabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_BRANDS, MOCK_SIGNALS } from '../constants/mockData';
import type { 
  EnhancedBrandDetails, 
  EnhancedSignal, 
  BrandId, 
  SignalId,
  CreateBrandForm,
  UpdateSignalForm,
  BrandGoal,
  CreateBrandGoalForm,
  UpdateBrandGoalForm
} from '../types/enhanced';
import { createBrandId, createSignalId, createISODateString } from '../utils/typeUtils';

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
      .eq('id', id)
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
    const brandToInsert = {
      name: brandData.name,
      description: brandData.description || null,
      website: brandData.website || null,
      industry: brandData.industry || null,
      location: null, // Not in your schema, but we'll handle it
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
    const updateData = {
      ...(updates.name && { name: updates.name }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.website !== undefined && { website: updates.website }),
      ...(updates.industry !== undefined && { industry: updates.industry }),
      ...(updates.employeeCount !== undefined && { employees: updates.employeeCount.toString() }),
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

// Signal service functions
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
      // If the signals table doesn't exist, return empty array instead of throwing
      if (error.message.includes('Could not find the table') || error.message.includes('relation "public.signals" does not exist')) {
        console.warn('Signals table not found, returning empty array. Create the signals table to enable signal functionality.');
        return [];
      }
      throw new Error(`Failed to fetch signals: ${error.message}`);
    }

    return data.map(transformSignalFromDB);
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
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Signal not found
      }
      // If the signals table doesn't exist, return null
      if (error.message.includes('Could not find the table') || error.message.includes('relation "public.signals" does not exist')) {
        console.warn('Signals table not found, returning null.');
        return null;
      }
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
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false });

    if (error) {
      // If the signals table doesn't exist, return empty array
      if (error.message.includes('Could not find the table') || error.message.includes('relation "public.signals" does not exist')) {
        console.warn('Signals table not found, returning empty array.');
        return [];
      }
      throw new Error(`Failed to fetch signals for brand: ${error.message}`);
    }

    return data.map(transformSignalFromDB);
  },

  // Update signal
  async updateSignal(id: SignalId, updates: UpdateSignalForm): Promise<EnhancedSignal> {
    const updateData = {
      ...(updates.name && { name: updates.name }),
      ...(updates.type && { type: updates.type }),
      ...(updates.status && { status: updates.status }),
      ...(updates.tags && { tags: updates.tags }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await typedSupabase
      .from('signals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // If the signals table doesn't exist, throw a more helpful error
      if (error.message.includes('Could not find the table') || error.message.includes('relation "public.signals" does not exist')) {
        throw new Error('Signals table not found. Please create the signals table to enable signal functionality.');
      }
      throw new Error(`Failed to update signal: ${error.message}`);
    }

    return transformSignalFromDB(data);
  },

  // Delete signal
  async deleteSignal(id: SignalId): Promise<void> {
    const { error } = await typedSupabase
      .from('signals')
      .delete()
      .eq('id', id);

    if (error) {
      // If the signals table doesn't exist, throw a more helpful error
      if (error.message.includes('Could not find the table') || error.message.includes('relation "public.signals" does not exist')) {
        throw new Error('Signals table not found. Please create the signals table to enable signal functionality.');
      }
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
        goal: goalData.goal,
        brand_id: goalData.brand_id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create brand goal: ${error.message}`);
    }

    return data;
  },

  // Update goal
  async updateGoal(id: number, updates: UpdateBrandGoalForm): Promise<BrandGoal> {
    if (!isSupabaseConfigured) {
      throw new Error('Cannot update brand goal: Supabase not configured');
    }

    const updateData = {
      ...(updates.goal && { goal: updates.goal }),
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

    return data;
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

// Transform functions to convert database rows to our application types
function transformBrandFromDB(dbBrand: any): EnhancedBrandDetails {
  return {
    id: createBrandId(dbBrand.id),
    name: dbBrand.name || '',
    description: dbBrand.description || '',
    website: dbBrand.website || '',
    industry: dbBrand.industry || '',
    logo: '', // Not in your schema
    employeeCount: dbBrand.employees ? parseInt(dbBrand.employees) || 0 : 0,
    revenue: 0, // Not in your schema
    socialMedia: {
      twitter: '',
      linkedin: '',
      facebook: '',
    }, // Not in your schema
    createdAt: createISODateString(dbBrand.created_at),
    updatedAt: createISODateString(dbBrand.created_at), // Use created_at since no updated_at
  };
}

function transformSignalFromDB(dbSignal: any): EnhancedSignal {
  return {
    id: createSignalId(dbSignal.id),
    name: dbSignal.name,
    prompt: dbSignal.prompt,
    type: dbSignal.type,
    status: dbSignal.status,
    tags: dbSignal.tags || [],
    brandId: createBrandId(dbSignal.brand_id),
    triggeredAt: dbSignal.triggered_at ? createISODateString(dbSignal.triggered_at) : undefined,
    aiInsights: dbSignal.ai_insights || {
      socialListening: '',
      consumerInsights: '',
    },
    aiRecommendations: dbSignal.ai_recommendations || [],
    csvData: dbSignal.csv_data || '',
    metadata: dbSignal.metadata || {},
    createdAt: createISODateString(dbSignal.created_at),
    updatedAt: createISODateString(dbSignal.updated_at),
  };
}
