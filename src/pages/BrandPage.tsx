import React from 'react';
import { PageHeader, Card, DetailRow, ErrorMessage, LoadingSpinner } from '../components';
import { Icons } from '../constants';
import { useBrand } from '../hooks';

const BrandPage: React.FC = () => {
  const { brandDetails, isLoading, error, refreshBrandDetails } = useBrand();

  const renderDetailsContent = (): React.JSX.Element => (
    <dl className="space-y-4">
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



  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="My Brand" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={refreshBrandDetails}
            className="mb-4"
          />
        )}
        
        {isLoading && (
          <LoadingSpinner 
            message="Loading brand details..." 
            className="mb-4"
          />
        )}
        
        <div className="space-y-6">
          {/* Brand Details Card */}
          <Card
            title="Brand Details"
            description="Basic information about your brand"
            icon={<Icons.Building className="w-5 h-5 text-indigo-600" />}
          >
            {renderDetailsContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
