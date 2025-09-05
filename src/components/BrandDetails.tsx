import React from 'react';
import { DetailRow } from './index';
import { useBrandContext } from '../contexts/BrandContext';

interface BrandDetailsProps {
  className?: string;
}

const BrandDetails: React.FC<BrandDetailsProps> = ({ className = '' }) => {
  const { brandDetails } = useBrandContext();

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
    </dl>
  );
};

export default BrandDetails;
