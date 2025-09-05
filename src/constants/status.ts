import type { Signal } from '../types';

export const STATUS_CONFIG: Record<Signal['status'], { label: string; classes: string }> = {
  active: {
    label: 'Active',
    classes: 'bg-green-100 text-green-800',
  },
  inactive: {
    label: 'Inactive',
    classes: 'bg-gray-100 text-gray-800',
  },
  pending: {
    label: 'Pending',
    classes: 'bg-yellow-100 text-yellow-800',
  },
} as const;

export const SIGNAL_TYPES = {
  ANALYTICS: 'Analytics',
  SOCIAL: 'Social',
  COMPETITIVE: 'Competitive',
} as const;

export const SIGNAL_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;
