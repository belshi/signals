import type { SignalStatus, SignalType } from '../types/enhanced';

export const STATUS_CONFIG: Record<SignalStatus, { label: string; classes: string }> = {
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

export const SIGNAL_TYPES: Record<Uppercase<SignalType>, SignalType> = {
  ANALYTICS: 'Analytics',
  SOCIAL: 'Social',
  COMPETITIVE: 'Competitive',
  MARKET: 'Market',
  FINANCIAL: 'Financial',
} as const;

export const SIGNAL_STATUSES: Record<Uppercase<SignalStatus>, SignalStatus> = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

// Type-safe status validation
export const isValidSignalStatus = (status: string): status is SignalStatus => {
  return Object.values(SIGNAL_STATUSES).includes(status as SignalStatus);
};

export const isValidSignalType = (type: string): type is SignalType => {
  return Object.values(SIGNAL_TYPES).includes(type as SignalType);
};
