import type { EnhancedSignal, EnhancedBrandDetails } from '../types/enhanced';
import { createSignalId, createBrandId, createISODateString } from '../utils/typeUtils';

export const MOCK_SIGNALS: EnhancedSignal[] = [
  {
    id: createSignalId('1'),
    name: 'Market Trend Analysis',
    type: 'Analytics',
    status: 'active',
    createdAt: createISODateString('2024-01-15'),
    updatedAt: createISODateString('2024-01-20'),
    description: 'Comprehensive analysis of market trends and consumer behavior patterns.',
    tags: ['market', 'trends', 'analysis'],
    metadata: {
      source: 'market-data-api',
      confidence: 0.95,
      lastUpdated: createISODateString('2024-01-20'),
    },
  },
  {
    id: createSignalId('2'),
    name: 'Social Media Sentiment',
    type: 'Social',
    status: 'inactive',
    createdAt: createISODateString('2024-01-10'),
    updatedAt: createISODateString('2024-01-18'),
    description: 'Real-time sentiment analysis from social media platforms.',
    tags: ['social', 'sentiment', 'monitoring'],
    metadata: {
      platforms: ['twitter', 'facebook', 'instagram'],
      sentiment: 'positive',
      volume: 1250,
    },
  },
  {
    id: createSignalId('3'),
    name: 'Competitor Monitoring',
    type: 'Competitive',
    status: 'pending',
    createdAt: createISODateString('2024-01-12'),
    updatedAt: createISODateString('2024-01-19'),
    description: 'Automated monitoring of competitor activities and market positioning.',
    tags: ['competitor', 'monitoring', 'intelligence'],
    metadata: {
      competitors: ['competitor-a', 'competitor-b'],
      frequency: 'daily',
      alerts: true,
    },
  },
];

export const MOCK_BRAND_DETAILS: EnhancedBrandDetails = {
  id: createBrandId('brand-1'),
  name: 'TechCorp Solutions',
  description: 'A leading technology company specializing in innovative software solutions for businesses.',
  website: 'https://techcorp.com',
  industry: 'Technology',
  logo: '/logos/techcorp.png',
  foundedYear: 2015,
  employeeCount: 250,
  revenue: 50000000,
  socialMedia: {
    twitter: '@techcorp',
    linkedin: 'techcorp-solutions',
    facebook: 'techcorp.solutions',
  },
  createdAt: createISODateString('2024-01-01'),
  updatedAt: createISODateString('2024-01-20'),
};
