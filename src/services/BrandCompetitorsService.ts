import { BaseService } from './BaseService';
import { withServiceErrorHandling } from './ServiceDecorator';
import { configService } from '../config/ConfigurationService';
import type { 
  BrandCompetitor,
  CreateBrandCompetitorForm,
  UpdateBrandCompetitorForm,
  BrandId
} from '../types/enhanced';
import type { Database } from '../lib/supabase';

/**
 * Type definitions for database operations
 */
type BrandCompetitorRow = Database['public']['Tables']['brand_competitors']['Row'];
type BrandCompetitorInsert = Database['public']['Tables']['brand_competitors']['Insert'];
type BrandCompetitorUpdate = Database['public']['Tables']['brand_competitors']['Update'];

/**
 * Brand Competitors service that extends the base service with brand competitor-specific functionality.
 * This service handles all brand competitor-related database operations with consistent
 * error handling and type safety.
 */
class BrandCompetitorsServiceClass extends BaseService<BrandCompetitor, CreateBrandCompetitorForm, UpdateBrandCompetitorForm> {
  protected tableName = 'brand_competitors' as const;

  /**
   * Transform database row to application type
   */
  protected transformFromDB = (dbCompetitor: BrandCompetitorRow): BrandCompetitor => {
    return {
      id: dbCompetitor.id,
      name: dbCompetitor.name || '',
      brand_id: (dbCompetitor.brand_id?.toString() as unknown as BrandId) || ('' as unknown as BrandId),
      created_at: dbCompetitor.created_at,
    };
  };

  /**
   * Transform application form data to database insert format
   */
  private transformToInsert(competitorData: CreateBrandCompetitorForm): BrandCompetitorInsert {
    return {
      name: competitorData.name,
      brand_id: Number(competitorData.brand_id as unknown as string),
    };
  }

  /**
   * Transform application update data to database update format
   */
  private transformToUpdate(updates: UpdateBrandCompetitorForm): BrandCompetitorUpdate {
    const updateData: BrandCompetitorUpdate = {};
    
    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }

    return updateData;
  }

  /**
   * Create a new brand competitor with proper data transformation
   */
  async create(competitorData: CreateBrandCompetitorForm): Promise<BrandCompetitor> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot create brand competitor: Supabase not configured');
    }

    const insertData = this.transformToInsert(competitorData);
    return super.create(insertData as any);
  }

  /**
   * Update a brand competitor with proper data transformation
   */
  async update(id: number, updates: UpdateBrandCompetitorForm): Promise<BrandCompetitor> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot update brand competitor: Supabase not configured');
    }

    const updateData = this.transformToUpdate(updates);
    return super.update(id, updateData as any);
  }

  /**
   * Get all brand competitors with fallback for unconfigured Supabase
   */
  async getAll(): Promise<BrandCompetitor[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty brand competitors array');
      return [];
    }

    try {
      return super.getAll();
    } catch (error) {
      // If the brand_competitors table doesn't exist, return empty array
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_competitors" does not exist'))) {
        console.warn('Brand competitors table not found, returning empty array.');
        return [];
      }
      throw error;
    }
  }

  /**
   * Get brand competitor by ID with fallback for unconfigured Supabase
   */
  async getById(id: number): Promise<BrandCompetitor | null> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, cannot fetch brand competitor by ID:', id);
      return null;
    }

    try {
      return super.getById(id);
    } catch (error) {
      // If the brand_competitors table doesn't exist, return null
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_competitors" does not exist'))) {
        console.warn('Brand competitors table not found, returning null.');
        return null;
      }
      throw error;
    }
  }

  /**
   * Delete brand competitor with configuration check
   */
  async delete(id: number): Promise<void> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot delete brand competitor: Supabase not configured');
    }

    try {
      return super.delete(id);
    } catch (error) {
      // If the brand_competitors table doesn't exist, throw a more specific error
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_competitors" does not exist'))) {
        throw new Error('Brand competitors table not found. Cannot delete brand competitor.');
      }
      throw error;
    }
  }

  /**
   * Get all competitors for a specific brand
   */
  async getByBrandId(brandId: BrandId): Promise<BrandCompetitor[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty brand competitors array for brand ID:', brandId);
      return [];
    }

    try {
      return this.getByField('brand_id', brandId);
    } catch (error) {
      // If the brand_competitors table doesn't exist, return empty array
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_competitors" does not exist'))) {
        console.warn('Brand competitors table not found, returning empty array.');
        return [];
      }
      throw error;
    }
  }

  /**
   * Get competitors by name (search functionality)
   */
  async getByName(name: string): Promise<BrandCompetitor[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty brand competitors array for name:', name);
      return [];
    }

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .ilike('name', `%${name}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search brand competitors by name: ${error.message}`);
      }

      return (data || []).map(this.transformFromDB);
    } catch (error) {
      // If the brand_competitors table doesn't exist, return empty array
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_competitors" does not exist'))) {
        console.warn('Brand competitors table not found, returning empty array.');
        return [];
      }
      throw error;
    }
  }

  /**
   * Check if a competitor name already exists for a brand
   */
  async existsForBrand(brandId: BrandId, competitorName: string): Promise<boolean> {
    if (!configService.isSupabaseConfigured) {
      return false;
    }

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('id')
        .eq('brand_id', brandId)
        .ilike('name', competitorName)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false; // Competitor not found
        }
        throw new Error(`Failed to check competitor existence: ${error.message}`);
      }

      return !!data;
    } catch (error) {
      // If the brand_competitors table doesn't exist, return false
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_competitors" does not exist'))) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get brand competitor statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byBrand: Record<string, number>;
    averageCompetitorsPerBrand: number;
    mostCommonCompetitors: Array<{ name: string; count: number }>;
  }> {
    if (!configService.isSupabaseConfigured) {
      return {
        total: 0,
        byBrand: {},
        averageCompetitorsPerBrand: 0,
        mostCommonCompetitors: [],
      };
    }

    try {
      const [total, competitors] = await Promise.all([
        this.count(),
        this.getAll()
      ]);

      const byBrand = competitors.reduce((acc, competitor) => {
        const brandId = competitor.brand_id || 'Unknown';
        acc[brandId] = (acc[brandId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const uniqueBrands = Object.keys(byBrand).length;
      const averageCompetitorsPerBrand = uniqueBrands > 0 ? total / uniqueBrands : 0;

      // Find most common competitor names
      const competitorNameCounts = competitors.reduce((acc, competitor) => {
        const name = competitor.name.toLowerCase();
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonCompetitors = Object.entries(competitorNameCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        total,
        byBrand,
        averageCompetitorsPerBrand: Math.round(averageCompetitorsPerBrand * 100) / 100,
        mostCommonCompetitors,
      };
    } catch (error) {
      // If the brand_competitors table doesn't exist, return empty statistics
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_competitors" does not exist'))) {
        console.warn('Brand competitors table not found, returning empty statistics.');
        return {
          total: 0,
          byBrand: {},
          averageCompetitorsPerBrand: 0,
          mostCommonCompetitors: [],
        };
      }
      throw error;
    }
  }

  /**
   * Check if a brand has any competitors
   */
  async hasCompetitors(brandId: BrandId): Promise<boolean> {
    if (!configService.isSupabaseConfigured) {
      return false;
    }

    try {
      const count = await this.countByField('brand_id', brandId);
      return count > 0;
    } catch (error) {
      // If the brand_competitors table doesn't exist, return false
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_competitors" does not exist'))) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get the most recent competitors for a brand
   */
  async getRecentCompetitors(brandId: BrandId, limit: number = 5): Promise<BrandCompetitor[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty recent competitors array');
      return [];
    }

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch recent brand competitors: ${error.message}`);
      }

      return (data || []).map(this.transformFromDB);
    } catch (error) {
      // If the brand_competitors table doesn't exist, return empty array
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_competitors" does not exist'))) {
        console.warn('Brand competitors table not found, returning empty array.');
        return [];
      }
      throw error;
    }
  }

  /**
   * Get unique competitor names across all brands
   */
  async getUniqueCompetitorNames(): Promise<string[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty competitor names array');
      return [];
    }

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('name')
        .not('name', 'is', null);

      if (error) {
        throw new Error(`Failed to fetch unique competitor names: ${error.message}`);
      }

      const uniqueNames = [...new Set((data || []).map((item: any) => item.name).filter(Boolean))];
      return uniqueNames.sort() as string[];
    } catch (error) {
      // If the brand_competitors table doesn't exist, return empty array
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_competitors" does not exist'))) {
        console.warn('Brand competitors table not found, returning empty array.');
        return [];
      }
      throw error;
    }
  }
}

/**
 * Export the service with error handling applied
 */
export const BrandCompetitorsService = withServiceErrorHandling(
  BrandCompetitorsServiceClass,
  'BrandCompetitorsService',
  {
    logErrors: true,
    includeContext: true,
  }
);

/**
 * Create and export a singleton instance
 */
export const brandCompetitorsService = new BrandCompetitorsService();
