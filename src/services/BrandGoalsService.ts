import { BaseService } from './BaseService';
import { withServiceErrorHandling } from './ServiceDecorator';
import { configService } from '../config/ConfigurationService';
import type { 
  BrandGoal,
  CreateBrandGoalForm,
  UpdateBrandGoalForm,
  BrandId
} from '../types/enhanced';
import type { Database } from '../lib/supabase';

/**
 * Type definitions for database operations
 */
type BrandGoalRow = Database['public']['Tables']['brand_goals']['Row'];
type BrandGoalInsert = Database['public']['Tables']['brand_goals']['Insert'];
type BrandGoalUpdate = Database['public']['Tables']['brand_goals']['Update'];

/**
 * Brand Goals service that extends the base service with brand goal-specific functionality.
 * This service handles all brand goal-related database operations with consistent
 * error handling and type safety.
 */
class BrandGoalsServiceClass extends BaseService<BrandGoal, CreateBrandGoalForm, UpdateBrandGoalForm> {
  protected tableName = 'brand_goals' as const;

  /**
   * Transform database row to application type
   */
  protected transformFromDB = (dbGoal: BrandGoalRow): BrandGoal => {
    return {
      id: dbGoal.id,
      name: dbGoal.name || '',
      brand_id: (dbGoal.brand_id?.toString() as unknown as BrandId) || ('' as unknown as BrandId),
      created_at: dbGoal.created_at,
    };
  };

  /**
   * Transform application form data to database insert format
   */
  private transformToInsert(goalData: CreateBrandGoalForm): BrandGoalInsert {
    return {
      name: goalData.name,
      brand_id: Number(goalData.brand_id as unknown as string),
    };
  }

  /**
   * Transform application update data to database update format
   */
  private transformToUpdate(updates: UpdateBrandGoalForm): BrandGoalUpdate {
    const updateData: BrandGoalUpdate = {};
    
    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }

    return updateData;
  }

  /**
   * Create a new brand goal with proper data transformation
   */
  async create(goalData: CreateBrandGoalForm): Promise<BrandGoal> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot create brand goal: Supabase not configured');
    }

    const insertData = this.transformToInsert(goalData);
    return super.create(insertData as any);
  }

  /**
   * Update a brand goal with proper data transformation
   */
  async update(id: number, updates: UpdateBrandGoalForm): Promise<BrandGoal> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot update brand goal: Supabase not configured');
    }

    const updateData = this.transformToUpdate(updates);
    return super.update(id, updateData as any);
  }

  /**
   * Get all brand goals with fallback for unconfigured Supabase
   */
  async getAll(): Promise<BrandGoal[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty brand goals array');
      return [];
    }

    try {
      return super.getAll();
    } catch (error) {
      // If the brand_goals table doesn't exist, return empty array
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_goals" does not exist'))) {
        console.warn('Brand goals table not found, returning empty array.');
        return [];
      }
      throw error;
    }
  }

  /**
   * Get brand goal by ID with fallback for unconfigured Supabase
   */
  async getById(id: number): Promise<BrandGoal | null> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, cannot fetch brand goal by ID:', id);
      return null;
    }

    try {
      return super.getById(id);
    } catch (error) {
      // If the brand_goals table doesn't exist, return null
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_goals" does not exist'))) {
        console.warn('Brand goals table not found, returning null.');
        return null;
      }
      throw error;
    }
  }

  /**
   * Delete brand goal with configuration check
   */
  async delete(id: number): Promise<void> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot delete brand goal: Supabase not configured');
    }

    try {
      return super.delete(id);
    } catch (error) {
      // If the brand_goals table doesn't exist, throw a more specific error
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_goals" does not exist'))) {
        throw new Error('Brand goals table not found. Cannot delete brand goal.');
      }
      throw error;
    }
  }

  /**
   * Get all goals for a specific brand
   */
  async getByBrandId(brandId: BrandId): Promise<BrandGoal[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty brand goals array for brand ID:', brandId);
      return [];
    }

    try {
      return this.getByField('brand_id', brandId);
    } catch (error) {
      // If the brand_goals table doesn't exist, return empty array
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_goals" does not exist'))) {
        console.warn('Brand goals table not found, returning empty array.');
        return [];
      }
      throw error;
    }
  }

  /**
   * Get goals by name (search functionality)
   */
  async getByName(name: string): Promise<BrandGoal[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty brand goals array for name:', name);
      return [];
    }

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .ilike('name', `%${name}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search brand goals by name: ${error.message}`);
      }

      return (data || []).map(this.transformFromDB);
    } catch (error) {
      // If the brand_goals table doesn't exist, return empty array
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_goals" does not exist'))) {
        console.warn('Brand goals table not found, returning empty array.');
        return [];
      }
      throw error;
    }
  }

  /**
   * Get brand goal statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byBrand: Record<string, number>;
    averageGoalsPerBrand: number;
  }> {
    if (!configService.isSupabaseConfigured) {
      return {
        total: 0,
        byBrand: {},
        averageGoalsPerBrand: 0,
      };
    }

    try {
      const [total, goals] = await Promise.all([
        this.count(),
        this.getAll()
      ]);

      const byBrand = goals.reduce((acc, goal) => {
        const brandId = goal.brand_id || 'Unknown';
        acc[brandId] = (acc[brandId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const uniqueBrands = Object.keys(byBrand).length;
      const averageGoalsPerBrand = uniqueBrands > 0 ? total / uniqueBrands : 0;

      return {
        total,
        byBrand,
        averageGoalsPerBrand: Math.round(averageGoalsPerBrand * 100) / 100,
      };
    } catch (error) {
      // If the brand_goals table doesn't exist, return empty statistics
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_goals" does not exist'))) {
        console.warn('Brand goals table not found, returning empty statistics.');
        return {
          total: 0,
          byBrand: {},
          averageGoalsPerBrand: 0,
        };
      }
      throw error;
    }
  }

  /**
   * Check if a brand has any goals
   */
  async hasGoals(brandId: BrandId): Promise<boolean> {
    if (!configService.isSupabaseConfigured) {
      return false;
    }

    try {
      const count = await this.countByField('brand_id', brandId);
      return count > 0;
    } catch (error) {
      // If the brand_goals table doesn't exist, return false
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_goals" does not exist'))) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get the most recent goals for a brand
   */
  async getRecentGoals(brandId: BrandId, limit: number = 5): Promise<BrandGoal[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty recent goals array');
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
        throw new Error(`Failed to fetch recent brand goals: ${error.message}`);
      }

      return (data || []).map(this.transformFromDB);
    } catch (error) {
      // If the brand_goals table doesn't exist, return empty array
      if (error instanceof Error && 
          (error.message.includes('Could not find the table') || 
           error.message.includes('relation "public.brand_goals" does not exist'))) {
        console.warn('Brand goals table not found, returning empty array.');
        return [];
      }
      throw error;
    }
  }
}

/**
 * Export the service with error handling applied
 */
export const BrandGoalsService = withServiceErrorHandling(
  BrandGoalsServiceClass,
  'BrandGoalsService',
  {
    logErrors: true,
    includeContext: true,
  }
);

/**
 * Create and export a singleton instance
 */
export const brandGoalsService = new BrandGoalsService();
