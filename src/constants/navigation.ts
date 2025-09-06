import type { EnhancedNavItem } from '../types/enhanced';

export const NAV_ITEMS: EnhancedNavItem[] = [
  { id: 'signals', label: 'Signals', path: '/signals' },
  { id: 'brand', label: 'My Brand', path: '/brand' },
];

export const ROUTES = {
  HOME: '/',
  SIGNALS: '/signals',
  BRAND: '/brand',
} as const;

export const APP_NAME = 'Signals';
