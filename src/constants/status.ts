import type { SignalStatus } from '../types/enhanced';

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

