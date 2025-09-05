import type { Signal, BrandDetails } from '../types';

export const MOCK_SIGNALS: Signal[] = [
  {
    id: '1',
    name: 'Market Trend Analysis',
    type: 'Analytics',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: '2',
    name: 'Social Media Sentiment',
    type: 'Social',
    status: 'inactive',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
  },
  {
    id: '3',
    name: 'Competitor Monitoring',
    type: 'Competitive',
    status: 'pending',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19',
  },
];

export const MOCK_BRAND_DETAILS: BrandDetails = {
  name: 'TechCorp Solutions',
  description: 'A leading technology company specializing in innovative software solutions for businesses.',
  website: 'https://techcorp.com',
  industry: 'Technology',
};
