import React from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { Icons } from '../constants';
import { useBrand } from '../hooks';

const BrandPage: React.FC = () => {
  const { brandDetails, isLoading, error } = useBrand();




  const renderDetailsContent = (): JSX.Element => (
    <dl className="space-y-4">
      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Brand Name</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {brandDetails.name}
        </dd>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Description</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {brandDetails.description}
        </dd>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Website</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {brandDetails.website ? (
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
          )}
        </dd>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">Industry</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {brandDetails.industry}
        </dd>
      </div>
    </dl>
  );



  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="My Brand" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}
        
        {isLoading && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            Loading...
          </div>
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
