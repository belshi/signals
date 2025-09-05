import React from 'react';
import PageHeader from '../components/PageHeader';
import type { BrandDetails } from '../types';

const BrandPage: React.FC = () => {

  const brandDetails: BrandDetails = {
    name: 'TechCorp Solutions',
    description: 'A leading technology company specializing in innovative software solutions for businesses.',
    website: 'https://techcorp.com',
    industry: 'Technology',
  };




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
        <div className="space-y-6">
          {/* Brand Details Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Brand Details</h2>
              <p className="mt-1 text-sm text-gray-500">Basic information about your brand</p>
            </div>
            <div className="p-6">
              {renderDetailsContent()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BrandPage;
