import { typedSupabase } from '../lib/supabase';
import type { 
  EnhancedBrandDetails, 
  EnhancedSignal, 
  BrandId, 
  SignalId,
  CreateBrandForm,
  UpdateSignalForm 
} from '../types/enhanced';
import { createBrandId, createSignalId, createISODateString } from '../utils/typeUtils';

// Brand service functions
export const brandService = {
  // Get all brands
  async getAllBrands(): Promise<EnhancedBrandDetails[]> {
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
      ...(updates.prompt && { prompt: updates.prompt }),
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

// Transform functions to convert database rows to our application types
function transformBrandFromDB(dbBrand: any): EnhancedBrandDetails {
  return {
    id: createBrandId(dbBrand.id),
    name: dbBrand.name || '',
    description: dbBrand.description || '',
    website: dbBrand.website || '',
    industry: dbBrand.industry || '',
    logo: '', // Not in your schema
    foundedYear: 0, // Not in your schema
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
    triggeredAt: dbSignal.triggered_at ? createISODateString(dbSignal.triggered_at) : null,
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
