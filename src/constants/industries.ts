/**
 * Comprehensive list of industry options for brand forms
 * Organized by major industry categories for better UX
 */

export interface IndustryOption {
  value: string;
  label: string;
  category?: string;
}

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  // Technology & Software
  { value: 'Technology', label: 'Technology', category: 'Technology & Software' },
  { value: 'Software', label: 'Software', category: 'Technology & Software' },
  { value: 'SaaS', label: 'SaaS (Software as a Service)', category: 'Technology & Software' },
  { value: 'Artificial Intelligence', label: 'Artificial Intelligence', category: 'Technology & Software' },
  { value: 'Cybersecurity', label: 'Cybersecurity', category: 'Technology & Software' },
  { value: 'Cloud Computing', label: 'Cloud Computing', category: 'Technology & Software' },
  { value: 'Blockchain', label: 'Blockchain & Cryptocurrency', category: 'Technology & Software' },
  { value: 'Fintech', label: 'Financial Technology (Fintech)', category: 'Technology & Software' },
  { value: 'Edtech', label: 'Educational Technology (Edtech)', category: 'Technology & Software' },
  { value: 'Healthtech', label: 'Health Technology (Healthtech)', category: 'Technology & Software' },
  { value: 'E-commerce', label: 'E-commerce', category: 'Technology & Software' },
  { value: 'Mobile Apps', label: 'Mobile Applications', category: 'Technology & Software' },
  { value: 'Gaming', label: 'Gaming & Interactive Entertainment', category: 'Technology & Software' },
  { value: 'IoT', label: 'Internet of Things (IoT)', category: 'Technology & Software' },
  { value: 'Robotics', label: 'Robotics & Automation', category: 'Technology & Software' },

  // Healthcare & Life Sciences
  { value: 'Healthcare', label: 'Healthcare', category: 'Healthcare & Life Sciences' },
  { value: 'Pharmaceuticals', label: 'Pharmaceuticals', category: 'Healthcare & Life Sciences' },
  { value: 'Biotechnology', label: 'Biotechnology', category: 'Healthcare & Life Sciences' },
  { value: 'Medical Devices', label: 'Medical Devices', category: 'Healthcare & Life Sciences' },
  { value: 'Telemedicine', label: 'Telemedicine', category: 'Healthcare & Life Sciences' },
  { value: 'Mental Health', label: 'Mental Health', category: 'Healthcare & Life Sciences' },
  { value: 'Dental', label: 'Dental Care', category: 'Healthcare & Life Sciences' },
  { value: 'Veterinary', label: 'Veterinary Care', category: 'Healthcare & Life Sciences' },
  { value: 'Wellness', label: 'Wellness & Fitness', category: 'Healthcare & Life Sciences' },

  // Financial Services
  { value: 'Finance', label: 'Finance', category: 'Financial Services' },
  { value: 'Banking', label: 'Banking', category: 'Financial Services' },
  { value: 'Insurance', label: 'Insurance', category: 'Financial Services' },
  { value: 'Investment', label: 'Investment & Asset Management', category: 'Financial Services' },
  { value: 'Real Estate Finance', label: 'Real Estate Finance', category: 'Financial Services' },
  { value: 'Credit & Lending', label: 'Credit & Lending', category: 'Financial Services' },
  { value: 'Payment Processing', label: 'Payment Processing', category: 'Financial Services' },
  { value: 'Cryptocurrency', label: 'Cryptocurrency & Digital Assets', category: 'Financial Services' },

  // Manufacturing & Industrial
  { value: 'Manufacturing', label: 'Manufacturing', category: 'Manufacturing & Industrial' },
  { value: 'Automotive', label: 'Automotive', category: 'Manufacturing & Industrial' },
  { value: 'Aerospace', label: 'Aerospace & Defense', category: 'Manufacturing & Industrial' },
  { value: 'Electronics', label: 'Electronics', category: 'Manufacturing & Industrial' },
  { value: 'Textiles', label: 'Textiles & Apparel', category: 'Manufacturing & Industrial' },
  { value: 'Food & Beverage', label: 'Food & Beverage', category: 'Manufacturing & Industrial' },
  { value: 'Chemicals', label: 'Chemicals', category: 'Manufacturing & Industrial' },
  { value: 'Construction Materials', label: 'Construction Materials', category: 'Manufacturing & Industrial' },
  { value: 'Packaging', label: 'Packaging', category: 'Manufacturing & Industrial' },

  // Energy & Utilities
  { value: 'Energy', label: 'Energy', category: 'Energy & Utilities' },
  { value: 'Oil & Gas', label: 'Oil & Gas', category: 'Energy & Utilities' },
  { value: 'Renewable Energy', label: 'Renewable Energy', category: 'Energy & Utilities' },
  { value: 'Solar', label: 'Solar Energy', category: 'Energy & Utilities' },
  { value: 'Wind', label: 'Wind Energy', category: 'Energy & Utilities' },
  { value: 'Nuclear', label: 'Nuclear Energy', category: 'Energy & Utilities' },
  { value: 'Utilities', label: 'Utilities', category: 'Energy & Utilities' },
  { value: 'Water', label: 'Water & Wastewater', category: 'Energy & Utilities' },

  // Retail & Consumer
  { value: 'Retail', label: 'Retail', category: 'Retail & Consumer' },
  { value: 'Fashion', label: 'Fashion & Apparel', category: 'Retail & Consumer' },
  { value: 'Beauty & Cosmetics', label: 'Beauty & Cosmetics', category: 'Retail & Consumer' },
  { value: 'Luxury Goods', label: 'Luxury Goods', category: 'Retail & Consumer' },
  { value: 'Home & Garden', label: 'Home & Garden', category: 'Retail & Consumer' },
  { value: 'Sports & Recreation', label: 'Sports & Recreation', category: 'Retail & Consumer' },
  { value: 'Toys & Games', label: 'Toys & Games', category: 'Retail & Consumer' },
  { value: 'Jewelry', label: 'Jewelry & Accessories', category: 'Retail & Consumer' },

  // Media & Entertainment
  { value: 'Media', label: 'Media & Entertainment', category: 'Media & Entertainment' },
  { value: 'Broadcasting', label: 'Broadcasting', category: 'Media & Entertainment' },
  { value: 'Publishing', label: 'Publishing', category: 'Media & Entertainment' },
  { value: 'Music', label: 'Music', category: 'Media & Entertainment' },
  { value: 'Film & TV', label: 'Film & Television', category: 'Media & Entertainment' },
  { value: 'Sports Media', label: 'Sports Media', category: 'Media & Entertainment' },
  { value: 'News', label: 'News & Journalism', category: 'Media & Entertainment' },
  { value: 'Advertising', label: 'Advertising & Marketing', category: 'Media & Entertainment' },
  { value: 'Social Media', label: 'Social Media', category: 'Media & Entertainment' },
  { value: 'Content Creation', label: 'Content Creation', category: 'Media & Entertainment' },

  // Transportation & Logistics
  { value: 'Transportation', label: 'Transportation', category: 'Transportation & Logistics' },
  { value: 'Logistics', label: 'Logistics & Supply Chain', category: 'Transportation & Logistics' },
  { value: 'Shipping', label: 'Shipping & Freight', category: 'Transportation & Logistics' },
  { value: 'Airlines', label: 'Airlines', category: 'Transportation & Logistics' },
  { value: 'Railways', label: 'Railways', category: 'Transportation & Logistics' },
  { value: 'Public Transit', label: 'Public Transit', category: 'Transportation & Logistics' },
  { value: 'Ride Sharing', label: 'Ride Sharing & Mobility', category: 'Transportation & Logistics' },
  { value: 'Delivery', label: 'Delivery & Last Mile', category: 'Transportation & Logistics' },

  // Real Estate & Construction
  { value: 'Real Estate', label: 'Real Estate', category: 'Real Estate & Construction' },
  { value: 'Construction', label: 'Construction', category: 'Real Estate & Construction' },
  { value: 'Architecture', label: 'Architecture & Design', category: 'Real Estate & Construction' },
  { value: 'Property Management', label: 'Property Management', category: 'Real Estate & Construction' },
  { value: 'Commercial Real Estate', label: 'Commercial Real Estate', category: 'Real Estate & Construction' },
  { value: 'Residential Real Estate', label: 'Residential Real Estate', category: 'Real Estate & Construction' },
  { value: 'Real Estate Development', label: 'Real Estate Development', category: 'Real Estate & Construction' },

  // Education & Training
  { value: 'Education', label: 'Education', category: 'Education & Training' },
  { value: 'Higher Education', label: 'Higher Education', category: 'Education & Training' },
  { value: 'K-12 Education', label: 'K-12 Education', category: 'Education & Training' },
  { value: 'Online Learning', label: 'Online Learning', category: 'Education & Training' },
  { value: 'Corporate Training', label: 'Corporate Training', category: 'Education & Training' },
  { value: 'Vocational Training', label: 'Vocational Training', category: 'Education & Training' },
  { value: 'Language Learning', label: 'Language Learning', category: 'Education & Training' },

  // Professional Services
  { value: 'Consulting', label: 'Consulting', category: 'Professional Services' },
  { value: 'Legal', label: 'Legal Services', category: 'Professional Services' },
  { value: 'Accounting', label: 'Accounting & Tax', category: 'Professional Services' },
  { value: 'Marketing', label: 'Marketing & PR', category: 'Professional Services' },
  { value: 'Human Resources', label: 'Human Resources', category: 'Professional Services' },
  { value: 'Recruiting', label: 'Recruiting & Staffing', category: 'Professional Services' },
  { value: 'Business Services', label: 'Business Services', category: 'Professional Services' },
  { value: 'Research', label: 'Research & Development', category: 'Professional Services' },

  // Agriculture & Food
  { value: 'Agriculture', label: 'Agriculture', category: 'Agriculture & Food' },
  { value: 'Farming', label: 'Farming', category: 'Agriculture & Food' },
  { value: 'Food Production', label: 'Food Production', category: 'Agriculture & Food' },
  { value: 'Food Distribution', label: 'Food Distribution', category: 'Agriculture & Food' },
  { value: 'Restaurants', label: 'Restaurants & Food Service', category: 'Agriculture & Food' },
  { value: 'Beverages', label: 'Beverages', category: 'Agriculture & Food' },
  { value: 'Organic Food', label: 'Organic Food', category: 'Agriculture & Food' },

  // Government & Non-Profit
  { value: 'Government', label: 'Government', category: 'Government & Non-Profit' },
  { value: 'Non-Profit', label: 'Non-Profit', category: 'Government & Non-Profit' },
  { value: 'NGO', label: 'NGO (Non-Governmental Organization)', category: 'Government & Non-Profit' },
  { value: 'Charity', label: 'Charity & Philanthropy', category: 'Government & Non-Profit' },
  { value: 'Public Sector', label: 'Public Sector', category: 'Government & Non-Profit' },

  // Travel & Hospitality
  { value: 'Travel', label: 'Travel & Tourism', category: 'Travel & Hospitality' },
  { value: 'Hospitality', label: 'Hospitality', category: 'Travel & Hospitality' },
  { value: 'Hotels', label: 'Hotels & Accommodation', category: 'Travel & Hospitality' },
  { value: 'Airlines', label: 'Airlines', category: 'Travel & Hospitality' },
  { value: 'Cruise Lines', label: 'Cruise Lines', category: 'Travel & Hospitality' },
  { value: 'Event Planning', label: 'Event Planning', category: 'Travel & Hospitality' },

  // Other
  { value: 'Other', label: 'Other', category: 'Other' },
];

/**
 * Get industry options grouped by category for better UX
 */
export const getIndustryOptionsByCategory = (): Record<string, IndustryOption[]> => {
  const grouped: Record<string, IndustryOption[]> = {};
  
  INDUSTRY_OPTIONS.forEach(option => {
    const category = option.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(option);
  });
  
  return grouped;
};

/**
 * Get a simple list of industry options (for backward compatibility)
 * Sorted alphabetically by label for better UX
 */
export const getSimpleIndustryOptions = (): Array<{ value: string; label: string }> => {
  return INDUSTRY_OPTIONS
    .map(option => ({
      value: option.value,
      label: option.label
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};
