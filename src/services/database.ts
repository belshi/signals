import { brandService as newBrandService } from './BrandService';
import { signalService as newSignalService } from './SignalService';
import { brandGoalsService as newBrandGoalsService } from './BrandGoalsService';
import { brandCompetitorsService as newBrandCompetitorsService } from './BrandCompetitorsService';
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
  UpdateBrandCompetitorForm
} from '../types/enhanced';

// Brand service functions - now using the new BrandService architecture
export const brandService = {
  // Get all brands
  async getAllBrands(): Promise<EnhancedBrandDetails[]> {
    return newBrandService.getAll();
  },

  // Get brand by ID
  async getBrandById(id: BrandId): Promise<EnhancedBrandDetails | null> {
    return newBrandService.getById(id);
  },

  // Create new brand
  async createBrand(brandData: CreateBrandForm): Promise<EnhancedBrandDetails> {
    return newBrandService.create(brandData);
  },

  // Update brand
  async updateBrand(id: BrandId, updates: Partial<CreateBrandForm>): Promise<EnhancedBrandDetails> {
    return newBrandService.update(id, updates);
  },

  // Delete brand
  async deleteBrand(id: BrandId): Promise<void> {
    return newBrandService.delete(id);
  },

  // Additional brand service methods
  async getBrandsByIndustry(industry: string): Promise<EnhancedBrandDetails[]> {
    return newBrandService.getByIndustry(industry);
  },

  async searchBrands(query: string): Promise<EnhancedBrandDetails[]> {
    return newBrandService.search(query);
  },

  async getBrandStatistics(): Promise<{
    total: number;
    byIndustry: Record<string, number>;
    averageEmployeeCount: number;
  }> {
    return newBrandService.getStatistics();
  },
};

// Signal service functions - now using the new SignalService architecture
export const signalService = {
  // Get all signals
  async getAllSignals(): Promise<EnhancedSignal[]> {
    return newSignalService.getAll();
  },

  // Get signal by ID
  async getSignalById(id: SignalId): Promise<EnhancedSignal | null> {
    return newSignalService.getById(id);
  },

  // Get signals by brand ID
  async getSignalsByBrandId(brandId: BrandId): Promise<EnhancedSignal[]> {
    return newSignalService.getByBrandId(brandId);
  },

  // Create signal
  async createSignal(data: CreateSignalForm): Promise<EnhancedSignal> {
    return newSignalService.create(data);
  },

  // Create signal with AI insights from Talkwalker
  async createSignalWithAI(
    data: CreateSignalForm,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void
  ): Promise<EnhancedSignal> {
    return newSignalService.createWithAI(data, brandDetails, onProgress);
  },

  // Refresh AI insights for an existing signal
  async refreshSignalInsights(
    signalId: SignalId,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void,
    signal?: AbortSignal
  ): Promise<EnhancedSignal> {
    return newSignalService.refreshInsights(signalId, brandDetails, onProgress, signal);
  },

  // Refresh AI recommendations for an existing signal (OpenAI only)
  async refreshRecommendations(
    signalId: SignalId,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void,
    signal?: AbortSignal
  ): Promise<EnhancedSignal> {
    return newSignalService.refreshRecommendations(signalId, brandDetails, onProgress, signal);
  },

  // Update signal
  async updateSignal(id: SignalId, updates: UpdateSignalForm): Promise<EnhancedSignal> {
    return newSignalService.update(id, updates);
  },

  // Delete signal
  async deleteSignal(id: SignalId): Promise<void> {
    return newSignalService.delete(id);
  },

  // Additional signal service methods
  async searchSignals(query: string): Promise<EnhancedSignal[]> {
    return newSignalService.search(query);
  },

  async getSignalsByCopilotId(copilotId: string): Promise<EnhancedSignal[]> {
    return newSignalService.getByCopilotId(copilotId);
  },

  async getSignalStatistics(): Promise<{
    total: number;
    byBrand: Record<string, number>;
    byCopilot: Record<string, number>;
    withAIInsights: number;
  }> {
    return newSignalService.getStatistics();
  },
};

// Brand Goals service functions - now using the new BrandGoalsService architecture
export const brandGoalsService = {
  // Get all goals for a brand
  async getGoalsByBrandId(brandId: BrandId): Promise<BrandGoal[]> {
    return newBrandGoalsService.getByBrandId(brandId);
  },

  // Create new goal
  async createGoal(goalData: CreateBrandGoalForm): Promise<BrandGoal> {
    return newBrandGoalsService.create(goalData);
  },

  // Update goal
  async updateGoal(id: number, updates: UpdateBrandGoalForm): Promise<BrandGoal> {
    return newBrandGoalsService.update(id, updates);
  },

  // Delete goal
  async deleteGoal(id: number): Promise<void> {
    return newBrandGoalsService.delete(id);
  },

  // Additional brand goals service methods
  async getAllGoals(): Promise<BrandGoal[]> {
    return newBrandGoalsService.getAll();
  },

  async getGoalById(id: number): Promise<BrandGoal | null> {
    return newBrandGoalsService.getById(id);
  },

  async getGoalsByName(name: string): Promise<BrandGoal[]> {
    return newBrandGoalsService.getByName(name);
  },

  async hasGoals(brandId: BrandId): Promise<boolean> {
    return newBrandGoalsService.hasGoals(brandId);
  },

  async getRecentGoals(brandId: BrandId, limit?: number): Promise<BrandGoal[]> {
    return newBrandGoalsService.getRecentGoals(brandId, limit);
  },

  async getBrandGoalsStatistics(): Promise<{
    total: number;
    byBrand: Record<string, number>;
    averageGoalsPerBrand: number;
  }> {
    return newBrandGoalsService.getStatistics();
  },
};

// Brand Competitors service functions - now using the new BrandCompetitorsService architecture
export const brandCompetitorsService = {
  // Get all competitors for a brand
  async getCompetitorsByBrandId(brandId: BrandId): Promise<BrandCompetitor[]> {
    return newBrandCompetitorsService.getByBrandId(brandId);
  },

  // Create new competitor
  async createCompetitor(competitorData: CreateBrandCompetitorForm): Promise<BrandCompetitor> {
    return newBrandCompetitorsService.create(competitorData);
  },

  // Update competitor
  async updateCompetitor(id: number, updates: UpdateBrandCompetitorForm): Promise<BrandCompetitor> {
    return newBrandCompetitorsService.update(id, updates);
  },

  // Delete competitor
  async deleteCompetitor(id: number): Promise<void> {
    return newBrandCompetitorsService.delete(id);
  },

  // Additional brand competitors service methods
  async getAllCompetitors(): Promise<BrandCompetitor[]> {
    return newBrandCompetitorsService.getAll();
  },

  async getCompetitorById(id: number): Promise<BrandCompetitor | null> {
    return newBrandCompetitorsService.getById(id);
  },

  async getCompetitorsByName(name: string): Promise<BrandCompetitor[]> {
    return newBrandCompetitorsService.getByName(name);
  },

  async existsForBrand(brandId: BrandId, competitorName: string): Promise<boolean> {
    return newBrandCompetitorsService.existsForBrand(brandId, competitorName);
  },

  async hasCompetitors(brandId: BrandId): Promise<boolean> {
    return newBrandCompetitorsService.hasCompetitors(brandId);
  },

  async getRecentCompetitors(brandId: BrandId, limit?: number): Promise<BrandCompetitor[]> {
    return newBrandCompetitorsService.getRecentCompetitors(brandId, limit);
  },

  async getUniqueCompetitorNames(): Promise<string[]> {
    return newBrandCompetitorsService.getUniqueCompetitorNames();
  },

  async getBrandCompetitorsStatistics(): Promise<{
    total: number;
    byBrand: Record<string, number>;
    averageCompetitorsPerBrand: number;
    mostCommonCompetitors: Array<{ name: string; count: number }>;
  }> {
    return newBrandCompetitorsService.getStatistics();
  },
};

// Transform functions to convert database rows to our application types
// Note: All transform functions are now handled by the new service classes:
// - transformBrandFromDB -> BrandService
// - transformSignalFromDB -> SignalService
// - Brand goals and competitors use direct database row mapping

