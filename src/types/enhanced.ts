import React from 'react';

// Branded types for better type safety
export type SignalId = string & { readonly __brand: 'SignalId' };
export type BrandId = number & { readonly __brand: 'BrandId' };
export type UserId = string & { readonly __brand: 'UserId' };

// Utility type to create branded types
export type Brand<T, B> = T & { readonly __brand: B };

// Union types for better type safety
export type SignalStatus = 'active' | 'inactive' | 'pending';
export type SignalType = 'Analytics' | 'Social' | 'Competitive' | 'Market' | 'Financial';
export type BrandGoalStatus = 'not-started' | 'in-progress' | 'completed';
export type CompetitorStrength = 'low' | 'medium' | 'high';
export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type LoadingSize = 'sm' | 'md' | 'lg';
export type ErrorVariant = 'error' | 'warning' | 'info';
export type CopilotType = 'Market Research' | 'Social Media' | 'Competitive Analysis' | 'Brand Monitoring' | 'Consumer Insights';

// Date types for better date handling
export type ISODateString = string & { readonly __brand: 'ISODateString' };
export type DateString = string & { readonly __brand: 'DateString' };

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: ISODateString;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: ISODateString;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Enhanced Signal types
export interface EnhancedSignal {
  id: SignalId;
  name: string;
  prompt: string;
  type: SignalType;
  status: SignalStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  tags?: string[];
  metadata?: Record<string, unknown>;
  brandId?: BrandId;
  triggeredAt?: ISODateString;
  aiInsights?: {
    socialListening: string;
    consumerInsights: string;
  };
  aiRecommendations?: string[];
  csvData?: string;
}

// Enhanced Brand types
export interface EnhancedBrandDetails {
  id: BrandId;
  name: string;
  description: string;
  website?: string;
  industry: string;
  logo?: string;
  employeeCount?: number;
  revenue?: number;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Brand Goal types based on Supabase schema
export interface BrandGoal {
  id: number;
  goal: string;
  brand_id: number;
  created_at: string;
}

export interface CreateBrandGoalForm {
  goal: string;
  brand_id: number;
}

export interface UpdateBrandGoalForm {
  goal?: string;
}

// Enhanced Brand Goal type for UI (keeping the existing interface for backward compatibility)
export interface EnhancedBrandGoal {
  id: string;
  title: string;
  description: string;
  targetDate: ISODateString;
  status: BrandGoalStatus;
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100
  milestones?: Array<{
    id: string;
    title: string;
    completed: boolean;
    completedAt?: ISODateString;
  }>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface EnhancedCompetitor {
  id: string;
  name: string;
  website?: string;
  description: string;
  strength: CompetitorStrength;
  marketShare?: number;
  strengths: string[];
  weaknesses: string[];
  threats: string[];
  opportunities: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Form types

export interface CreateSignalForm {
  name: string;
  prompt: string;
  brandId: BrandId;
  copilotType: CopilotType;
  type?: SignalType;
  tags?: string[];
}

export interface UpdateSignalForm {
  name?: string;
  type?: SignalType;
  status?: SignalStatus;
  description?: string;
  tags?: string[];
}

export interface CreateBrandForm {
  name: string;
  description: string;
  website?: string;
  industry: string;
  employeeCount?: number;
}

// Navigation types with better type safety
export interface EnhancedNavItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: {
    count: number;
    variant: 'primary' | 'secondary' | 'danger';
  };
  children?: EnhancedNavItem[];
}

// Component prop types with better constraints
export interface EnhancedPageHeaderButton {
  label: string;
  onClick: () => void;
  variant: ButtonVariant;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
}

export interface EnhancedPageHeaderProps {
  title: string;
  subtitle?: string;
  button?: EnhancedPageHeaderButton;
  buttons?: EnhancedPageHeaderButton[];
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

// Table types with better generics
export interface TableColumn<T, K extends keyof T = keyof T> {
  key: K | string;
  label: string;
  render?: (item: T, value: T[K], index: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
}

export interface TableSortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface EnhancedDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyField: keyof T;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  error?: string;
  onRowClick?: (item: T, index: number) => void;
  onSort?: (config: TableSortConfig) => void;
  sortConfig?: TableSortConfig;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  selection?: {
    selectedItems: T[];
    onSelectionChange: (items: T[]) => void;
    selectable?: boolean;
  };
}

// Hook return types
export interface UseSignalsReturn {
  signals: EnhancedSignal[];
  isLoading: boolean;
  error: string | null;
  updateSignal: (id: SignalId, data: UpdateSignalForm) => Promise<EnhancedSignal>;
  deleteSignal: (id: SignalId) => Promise<void>;
  refreshSignals: () => Promise<void>;
  getSignal: (id: SignalId) => EnhancedSignal | undefined;
}

export interface UseBrandReturn {
  brandDetails: EnhancedBrandDetails | null;
  isLoading: boolean;
  error: string | null;
  updateBrandDetails: (data: Partial<CreateBrandForm>) => Promise<EnhancedBrandDetails>;
  refreshBrandDetails: () => Promise<void>;
}

export interface UseBrandsReturn {
  brands: EnhancedBrandDetails[];
  isLoading: boolean;
  error: string | null;
  getBrand: (id: BrandId) => EnhancedBrandDetails | undefined;
  createBrand: (data: CreateBrandForm) => Promise<EnhancedBrandDetails>;
  updateBrand: (id: BrandId, data: Partial<CreateBrandForm>) => Promise<EnhancedBrandDetails>;
  deleteBrand: (id: BrandId) => Promise<void>;
  refreshBrands: () => Promise<void>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Component ref types
export type ComponentRef<T> = React.RefObject<T>;
export type ForwardedRef<T> = React.ForwardedRef<T>;

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}
