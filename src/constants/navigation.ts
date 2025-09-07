import type { EnhancedNavItem } from '../types/enhanced';

export const NAV_ITEMS: EnhancedNavItem[] = [
  { id: 'brands', label: 'Brands', path: '/brands' },
  { id: 'signals', label: 'Signals', path: '/signals' },
];

export const ROUTES = {
  HOME: '/',
  SIGNALS: '/signals',
  SIGNAL: '/signals/:signalId',
  BRANDS: '/brands',
  BRAND: '/brands/:brandId',
} as const;

export const APP_NAME = 'Signals';
