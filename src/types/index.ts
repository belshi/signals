import React from 'react';

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  path: string;
  isActive?: boolean;
}

// Page header types
export interface PageHeaderButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export interface PageHeaderProps {
  title: string;
  button?: PageHeaderButton;
  buttons?: PageHeaderButton[];
}

// Signal types
export interface Signal {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

// Brand types
export interface BrandDetails {
  name: string;
  description: string;
  website?: string;
  industry: string;
}

export interface BrandGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface Competitor {
  id: string;
  name: string;
  website?: string;
  description: string;
  strength: 'low' | 'medium' | 'high';
}

// Tab types
export interface Tab {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}
