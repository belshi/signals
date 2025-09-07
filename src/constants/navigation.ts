import type { EnhancedNavItem } from '../types/enhanced';

export const NAV_ITEMS: EnhancedNavItem[] = [
  { id: 'brand', label: 'My Brand', path: '/brand' },
  { id: 'signals', label: 'Signals', path: '/signals' },
];

export const ROUTES = {
  HOME: '/',
  SIGNALS: '/signals',
  BRAND: '/brand',
} as const;

export const APP_NAME = 'Signals';
