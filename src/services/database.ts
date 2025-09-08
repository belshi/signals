import { typedSupabase, isSupabaseConfigured, type Database } from '../lib/supabase';
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
  UpdateBrandGoalForm,
  BrandCompetitor,
  CreateBrandCompetitorForm,
  UpdateBrandCompetitorForm
} from '../types/enhanced';
import { createBrandId, createISODateString } from '../utils/typeUtils';

// Type-safe database row types
type BrandRow = Database['public']['Tables']['brands']['Row'];

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

// Signal service functions - Note: No signals table in actual schema
// This service is kept for backward compatibility but will always return mock data
export const signalService = {
  // Get all signals
  async getAllSignals(): Promise<EnhancedSignal[]> {
    console.log('Using mock data for signals - no signals table in database schema');
    return MOCK_SIGNALS;
  },

  // Get signal by ID
  async getSignalById(id: SignalId): Promise<EnhancedSignal | null> {
    console.log('Using mock data for signal by ID:', id);
    const signalIdStr = id.toString();
    return MOCK_SIGNALS.find(signal => signal.id.toString() === signalIdStr) || null;
  },

  // Get signals by brand ID
  async getSignalsByBrandId(brandId: BrandId): Promise<EnhancedSignal[]> {
    console.log('Using mock data for signals by brand ID:', brandId);
    const brandIdStr = brandId.toString();
    return MOCK_SIGNALS.filter(signal => signal.brandId?.toString() === brandIdStr);
  },

  // Update signal
  async updateSignal(id: SignalId, updates: UpdateSignalForm): Promise<EnhancedSignal> {
    throw new Error('Signal updates not supported - no signals table in database schema');
  },

  // Delete signal
  async deleteSignal(id: SignalId): Promise<void> {
    throw new Error('Signal deletion not supported - no signals table in database schema');
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
    logo: '', // Not in actual schema
    employeeCount: dbBrand.employees ? parseInt(dbBrand.employees) || 0 : 0,
    revenue: 0, // Not in actual schema
    socialMedia: {
      twitter: '',
      linkedin: '',
      facebook: '',
    }, // Not in actual schema
    createdAt: createISODateString(dbBrand.created_at),
    updatedAt: createISODateString(dbBrand.created_at), // No updated_at in actual schema
  };
}

