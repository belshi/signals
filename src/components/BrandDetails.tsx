import React from 'react';
import { DetailRow } from './index';
import type { EnhancedBrandDetails } from '../types/enhanced';

interface BrandDetailsProps {
  className?: string;
  brand?: EnhancedBrandDetails;
}

const BrandDetails: React.FC<BrandDetailsProps> = ({ className = '', brand }) => {
  // Use the passed brand prop - no fallback to context needed
  const brandDetails = brand;

  if (!brandDetails) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No brand details available</p>
      </div>
    );
  }

  return (
    <dl className={`space-y-4 ${className}`}>
      <DetailRow
        label="Brand Name"
        value={brandDetails.name}
      />
      <DetailRow
        label="Description"
        value={brandDetails.description}
      />
      <DetailRow
        label="Website"
        value={
          brandDetails.website ? (
            <a
              href={brandDetails.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {brandDetails.website}
            </a>
          ) : (
            'Not provided'
          )
        }
      />
      <DetailRow
        label="Industry"
        value={brandDetails.industry}
      />
      <DetailRow
        label="Location"
        value={brandDetails.location || 'Not provided'}
      />
    </dl>
  );
};

export default BrandDetails;
