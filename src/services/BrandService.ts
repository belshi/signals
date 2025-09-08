import { BrandedBaseService } from './BaseService';
import { withServiceErrorHandling } from './ServiceDecorator';
import { configService } from '../config/ConfigurationService';
import type { 
  EnhancedBrandDetails, 
  BrandId, 
  CreateBrandForm
} from '../types/enhanced';
import type { Database } from '../lib/supabase';
import { createBrandId, createISODateString } from '../utils/typeUtils';

/**
 * Type definitions for database operations
 */
type BrandRow = Database['public']['Tables']['brands']['Row'];
type BrandInsert = Database['public']['Tables']['brands']['Insert'];
type BrandUpdate = Database['public']['Tables']['brands']['Update'];

/**
 * Brand service that extends the base service with brand-specific functionality.
 * This service handles all brand-related database operations with consistent
 * error handling and type safety.
 */
class BrandServiceClass extends BrandedBaseService<EnhancedBrandDetails, CreateBrandForm, Partial<CreateBrandForm>, BrandId> {
  protected tableName = 'brands' as const;

  /**
   * Transform database row to application type
   */
  protected transformFromDB = (dbBrand: BrandRow): EnhancedBrandDetails => {
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
  };

  /**
   * Transform application form data to database insert format
   */
  private transformToInsert(brandData: CreateBrandForm): BrandInsert {
    return {
      name: brandData.name,
      description: brandData.description || null,
      website: brandData.website || null,
      industry: brandData.industry || null,
      location: null,
      employees: brandData.employeeCount ? brandData.employeeCount.toString() : null,
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Transform application update data to database update format
   */
  private transformToUpdate(updates: Partial<CreateBrandForm>): BrandUpdate {
    const updateData: BrandUpdate = {};
    
    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }
    if (updates.description !== undefined) {
      updateData.description = updates.description;
    }
    if (updates.website !== undefined) {
      updateData.website = updates.website;
    }
    if (updates.industry !== undefined) {
      updateData.industry = updates.industry;
    }
    if (updates.employeeCount !== undefined) {
      updateData.employees = updates.employeeCount?.toString() ?? null;
    }

    return updateData;
  }

  /**
   * Create a new brand with proper data transformation
   */
  async create(brandData: CreateBrandForm): Promise<EnhancedBrandDetails> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot create brand: Supabase not configured');
    }

    const insertData = this.transformToInsert(brandData);
    return super.create(insertData as any);
  }

  /**
   * Update a brand with proper data transformation
   */
  async update(id: BrandId, updates: Partial<CreateBrandForm>): Promise<EnhancedBrandDetails> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot update brand: Supabase not configured');
    }

    const updateData = this.transformToUpdate(updates);
    return super.update(id, updateData as any);
  }

  /**
   * Get all brands with fallback for unconfigured Supabase
   */
  async getAll(): Promise<EnhancedBrandDetails[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty brands array');
      return [];
    }

    return super.getAll();
  }

  /**
   * Get brand by ID with fallback for unconfigured Supabase
   */
  async getById(id: BrandId): Promise<EnhancedBrandDetails | null> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, cannot fetch brand by ID:', id);
      return null;
    }

    return super.getById(id);
  }

  /**
   * Delete brand with configuration check
   */
  async delete(id: BrandId): Promise<void> {
    if (!configService.isSupabaseConfigured) {
      throw new Error('Cannot delete brand: Supabase not configured');
    }

    return super.delete(id);
  }

  /**
   * Get brands by industry
   */
  async getByIndustry(industry: string): Promise<EnhancedBrandDetails[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty brands array for industry:', industry);
      return [];
    }

    return this.getByField('industry', industry);
  }

  /**
   * Get brands by employee count range
   */
  async getByEmployeeCountRange(min: number, max: number): Promise<EnhancedBrandDetails[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty brands array for employee range');
      return [];
    }

    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .gte('employees', min.toString())
      .lte('employees', max.toString())
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch brands by employee count: ${error.message}`);
    }

    return (data || []).map(this.transformFromDB);
  }

  /**
   * Search brands by name or description
   */
  async search(query: string): Promise<EnhancedBrandDetails[]> {
    if (!configService.isSupabaseConfigured) {
      console.log('Supabase not configured, returning empty brands array for search');
      return [];
    }

    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search brands: ${error.message}`);
    }

    return (data || []).map(this.transformFromDB);
  }

  /**
   * Get brand statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byIndustry: Record<string, number>;
    averageEmployeeCount: number;
  }> {
    if (!configService.isSupabaseConfigured) {
      return {
        total: 0,
        byIndustry: {},
        averageEmployeeCount: 0,
      };
    }

    const [total, brands] = await Promise.all([
      this.count(),
      this.getAll()
    ]);

    const byIndustry = brands.reduce((acc, brand) => {
      const industry = brand.industry || 'Unknown';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageEmployeeCount = brands.length > 0 
      ? brands.reduce((sum, brand) => sum + (brand.employeeCount || 0), 0) / brands.length
      : 0;

    return {
      total,
      byIndustry,
      averageEmployeeCount: Math.round(averageEmployeeCount),
    };
  }
}

/**
 * Export the service with error handling applied
 */
export const BrandService = withServiceErrorHandling(
  BrandServiceClass,
  'BrandService',
  {
    logErrors: true,
    includeContext: true,
  }
);

/**
 * Create and export a singleton instance
 */
export const brandService = new BrandService();
