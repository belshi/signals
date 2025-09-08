import { typedSupabase, isSupabaseConfigured, type Database } from '../lib/supabase';

/**
 * Abstract base service class that provides common CRUD operations
 * for all database entities. This reduces code duplication and ensures
 * consistent patterns across all services.
 */
export abstract class BaseService<T, CreateT, UpdateT> {
  protected abstract tableName: keyof Database['public']['Tables'];
  protected abstract transformFromDB: (row: any) => T;

  /**
   * Get the Supabase client instance
   * Throws an error if Supabase is not configured
   */
  protected get client() {
    if (!isSupabaseConfigured) {
      throw new Error(`${String(this.tableName)} operations require Supabase configuration`);
    }
    return typedSupabase;
  }

  /**
   * Get all records from the table
   */
  async getAll(): Promise<T[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch ${String(this.tableName)}: ${error.message}`);
    }

    return (data || []).map(this.transformFromDB);
  }

  /**
   * Get a record by ID
   */
  async getById(id: string | number): Promise<T | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Record not found
      }
      throw new Error(`Failed to fetch ${String(this.tableName)}: ${error.message}`);
    }

    return this.transformFromDB(data);
  }

  /**
   * Create a new record
   */
  async create(data: CreateT): Promise<T> {
    const { data: inserted, error } = await this.client
      .from(this.tableName)
      .insert(data as any)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create ${String(this.tableName)}: ${error.message}`);
    }

    return this.transformFromDB(inserted);
  }

  /**
   * Update a record by ID
   */
  async update(id: string | number, updates: UpdateT): Promise<T> {
    const { data, error } = await this.client
      .from(this.tableName)
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ${String(this.tableName)}: ${error.message}`);
    }

    return this.transformFromDB(data);
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string | number): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete ${String(this.tableName)}: ${error.message}`);
    }
  }

  /**
   * Get records by a specific field value
   */
  async getByField(field: string, value: any): Promise<T[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq(field, value)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch ${String(this.tableName)} by ${field}: ${error.message}`);
    }

    return (data || []).map(this.transformFromDB);
  }

  /**
   * Check if a record exists by ID
   */
  async exists(id: string | number): Promise<boolean> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false; // Record not found
      }
      throw new Error(`Failed to check existence of ${String(this.tableName)}: ${error.message}`);
    }

    return !!data;
  }

  /**
   * Get count of records
   */
  async count(): Promise<number> {
    const { count, error } = await this.client
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to count ${String(this.tableName)}: ${error.message}`);
    }

    return count || 0;
  }

  /**
   * Get count of records by field value
   */
  async countByField(field: string, value: any): Promise<number> {
    const { count, error } = await this.client
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq(field, value);

    if (error) {
      throw new Error(`Failed to count ${String(this.tableName)} by ${field}: ${error.message}`);
    }

    return count || 0;
  }
}

/**
 * Type-safe service for entities with branded ID types
 */
export abstract class BrandedBaseService<T, CreateT, UpdateT, TId extends string> extends BaseService<T, CreateT, UpdateT> {
  /**
   * Get a record by branded ID
   */
  async getById(id: TId): Promise<T | null> {
    return super.getById(Number(id as unknown as string));
  }

  /**
   * Update a record by branded ID
   */
  async update(id: TId, updates: UpdateT): Promise<T> {
    return super.update(Number(id as unknown as string), updates);
  }

  /**
   * Delete a record by branded ID
   */
  async delete(id: TId): Promise<void> {
    return super.delete(Number(id as unknown as string));
  }

  /**
   * Check if a record exists by branded ID
   */
  async exists(id: TId): Promise<boolean> {
    return super.exists(Number(id as unknown as string));
  }
}
