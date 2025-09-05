import React from 'react';

// Re-export enhanced types for backward compatibility
export * from './enhanced';

// Legacy types for backward compatibility (deprecated - use enhanced types)
/** @deprecated Use EnhancedSignal from enhanced.ts */
export interface Signal {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

/** @deprecated Use EnhancedBrandDetails from enhanced.ts */
export interface BrandDetails {
  name: string;
  description: string;
  website?: string;
  industry: string;
}

/** @deprecated Use EnhancedBrandGoal from enhanced.ts */
export interface BrandGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

/** @deprecated Use EnhancedCompetitor from enhanced.ts */
export interface Competitor {
  id: string;
  name: string;
  website?: string;
  description: string;
  strength: 'low' | 'medium' | 'high';
}

/** @deprecated Use EnhancedNavItem from enhanced.ts */
export interface NavItem {
  id: string;
  label: string;
  path: string;
  isActive?: boolean;
}

/** @deprecated Use EnhancedPageHeaderButton from enhanced.ts */
export interface PageHeaderButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

/** @deprecated Use EnhancedPageHeaderProps from enhanced.ts */
export interface PageHeaderProps {
  title: string;
  button?: PageHeaderButton;
  buttons?: PageHeaderButton[];
}

/** @deprecated Use EnhancedNavItem from enhanced.ts */
export interface Tab {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}
