import type { EnhancedSignal, EnhancedBrandDetails } from '../types/enhanced';
import { createSignalId, createBrandId, createISODateString } from '../utils/typeUtils';

export const MOCK_SIGNALS: EnhancedSignal[] = [
  {
    id: createSignalId('1'),
    name: 'Market Trend Analysis',
    prompt: 'Analyze market trends and consumer behavior patterns for sustainable technology products. Focus on social media sentiment, search volume, and competitor activity.',
    type: 'Analytics',
    status: 'active',
    createdAt: createISODateString('2024-01-15'),
    updatedAt: createISODateString('2024-01-20'),
    tags: ['market', 'trends', 'analysis'],
    brandId: createBrandId(1),
    triggeredAt: createISODateString('2024-01-20T10:30:00Z'),
    aiInsights: {
      socialListening: 'Increased mentions of "sustainable technology" by 45% across social platforms, with positive sentiment trending upward. Key influencers are discussing green tech solutions and environmental impact.',
      consumerInsights: 'Consumer behavior shows growing preference for eco-friendly products (78% increase in searches). Price sensitivity remains high, but willingness to pay premium for sustainable options has increased by 23%.'
    },
    aiRecommendations: [
      'Launch a sustainability-focused marketing campaign highlighting your green initiatives',
      'Consider introducing eco-friendly product variants to capture the growing market segment',
      'Engage with environmental influencers to amplify your brand message',
      'Monitor competitor sustainability claims to maintain competitive advantage'
    ],
    csvData: 'Signal ID,Name,Type,Status,Brand,Triggered At,Social Listening Insights,Consumer Insights,Recommendations\n1,Market Trend Analysis,Analytics,active,TechCorp Solutions,2024-01-20T10:30:00Z,"Increased mentions of sustainable technology by 45%","Consumer preference for eco-friendly products up 78%","Launch sustainability campaign,Introduce eco-friendly variants,Engage environmental influencers"',
    metadata: {
      source: 'market-data-api',
      confidence: 0.95,
      lastUpdated: createISODateString('2024-01-20'),
    },
  },
  {
    id: createSignalId('2'),
    name: 'Social Media Sentiment',
    prompt: 'Monitor social media sentiment for our brand across Twitter, Facebook, and Instagram. Track mentions, sentiment changes, and identify potential PR issues or opportunities.',
    type: 'Social',
    status: 'inactive',
    createdAt: createISODateString('2024-01-10'),
    updatedAt: createISODateString('2024-01-18'),
    tags: ['social', 'sentiment', 'monitoring'],
    brandId: createBrandId(2),
    triggeredAt: createISODateString('2024-01-18T14:15:00Z'),
    aiInsights: {
      socialListening: 'Negative sentiment spike detected around customer service complaints. 67% of negative mentions relate to response time and support quality. Viral complaint thread gaining traction.',
      consumerInsights: 'Customer satisfaction scores dropped 12% this week. Main pain points: slow response times (34%), unclear communication (28%), and unresolved issues (38%).'
    },
    aiRecommendations: [
      'Implement 24/7 customer support chatbot to address immediate concerns',
      'Create a dedicated customer success team for high-priority issues',
      'Develop a public response strategy for the viral complaint thread',
      'Review and improve internal communication protocols'
    ],
    csvData: 'Signal ID,Name,Type,Status,Brand,Triggered At,Social Listening Insights,Consumer Insights,Recommendations\n2,Social Media Sentiment,Social,inactive,GreenEnergy Corp,2024-01-18T14:15:00Z,"Negative sentiment spike - 67% relate to customer service","Customer satisfaction dropped 12%","Implement 24/7 chatbot,Create customer success team,Develop public response strategy"',
    metadata: {
      platforms: ['twitter', 'facebook', 'instagram'],
      sentiment: 'negative',
      volume: 1250,
    },
  },
  {
    id: createSignalId('3'),
    name: 'Competitor Monitoring',
    prompt: 'Track competitor product launches, pricing changes, marketing campaigns, and market positioning. Alert on significant competitive moves that could impact our market share.',
    type: 'Competitive',
    status: 'pending',
    createdAt: createISODateString('2024-01-12'),
    updatedAt: createISODateString('2024-01-19'),
    tags: ['competitor', 'monitoring', 'intelligence'],
    brandId: createBrandId(3),
    triggeredAt: createISODateString('2024-01-19T09:45:00Z'),
    aiInsights: {
      socialListening: 'Competitor launched new AI-powered diagnostic tool with significant media coverage. Social engagement up 200% with positive reception from healthcare professionals.',
      consumerInsights: 'Market research shows 89% of healthcare providers are interested in AI diagnostic tools. Price point and accuracy are the top decision factors.'
    },
    aiRecommendations: [
      'Accelerate development of your AI diagnostic solution to maintain competitive position',
      'Conduct competitive analysis of the new tool to identify differentiation opportunities',
      'Engage with healthcare professionals to understand their specific needs',
      'Consider strategic partnerships with medical institutions for validation'
    ],
    csvData: 'Signal ID,Name,Type,Status,Brand,Triggered At,Social Listening Insights,Consumer Insights,Recommendations\n3,Competitor Monitoring,Competitive,pending,HealthTech Innovations,2024-01-19T09:45:00Z,"Competitor launched AI diagnostic tool with 200% engagement","89% of healthcare providers interested in AI tools","Accelerate AI development,Conduct competitive analysis,Engage healthcare professionals"',
    metadata: {
      competitors: ['competitor-a', 'competitor-b'],
      frequency: 'daily',
      alerts: true,
    },
  },
];

export const MOCK_BRANDS: EnhancedBrandDetails[] = [
  {
    id: createBrandId(1),
    name: 'TechCorp Solutions',
    description: 'A leading technology company specializing in innovative software solutions for businesses.',
    website: 'https://techcorp.com',
    industry: 'Technology',
    logo: '/logos/techcorp.png',
    employeeCount: 250,
    revenue: 50000000,
    socialMedia: {
      twitter: '@techcorp',
      linkedin: 'techcorp-solutions',
      facebook: 'techcorp.solutions',
    },
    createdAt: createISODateString('2024-01-01'),
    updatedAt: createISODateString('2024-01-20'),
  },
  {
    id: createBrandId(2),
    name: 'GreenEnergy Corp',
    description: 'Sustainable energy solutions provider focused on renewable technologies and environmental impact.',
    website: 'https://greenenergy.com',
    industry: 'Energy',
    logo: '/logos/greenenergy.png',
    employeeCount: 180,
    revenue: 35000000,
    socialMedia: {
      twitter: '@greenenergy',
      linkedin: 'greenenergy-corp',
      facebook: 'greenenergy.corp',
    },
    createdAt: createISODateString('2024-01-05'),
    updatedAt: createISODateString('2024-01-18'),
  },
  {
    id: createBrandId(3),
    name: 'HealthTech Innovations',
    description: 'Revolutionary healthcare technology company developing AI-powered medical solutions.',
    website: 'https://healthtech.com',
    industry: 'Healthcare',
    logo: '/logos/healthtech.png',
    employeeCount: 120,
    revenue: 25000000,
    socialMedia: {
      twitter: '@healthtech',
      linkedin: 'healthtech-innovations',
      facebook: 'healthtech.innovations',
    },
    createdAt: createISODateString('2024-01-10'),
    updatedAt: createISODateString('2024-01-15'),
  },
  {
    id: createBrandId(4),
    name: 'FinanceFlow Systems',
    description: 'Advanced financial technology platform providing comprehensive banking and investment solutions.',
    website: 'https://financeflow.com',
    industry: 'Financial Services',
    logo: '/logos/financeflow.png',
    employeeCount: 300,
    revenue: 75000000,
    socialMedia: {
      twitter: '@financeflow',
      linkedin: 'financeflow-systems',
      facebook: 'financeflow.systems',
    },
    createdAt: createISODateString('2024-01-08'),
    updatedAt: createISODateString('2024-01-22'),
  },
  {
    id: createBrandId(5),
    name: 'EduTech Academy',
    description: 'Online education platform offering interactive learning experiences and professional development courses.',
    website: 'https://edutech.com',
    industry: 'Education',
    logo: '/logos/edutech.png',
    employeeCount: 95,
    revenue: 18000000,
    socialMedia: {
      twitter: '@edutech',
      linkedin: 'edutech-academy',
      facebook: 'edutech.academy',
    },
    createdAt: createISODateString('2024-01-12'),
    updatedAt: createISODateString('2024-01-19'),
  },
];

// Keep the original export for backward compatibility
export const MOCK_BRAND_DETAILS: EnhancedBrandDetails = MOCK_BRANDS[0];
