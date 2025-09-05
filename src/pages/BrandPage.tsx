import React from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
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
          <Card
            title="Brand Details"
            description="Basic information about your brand"
            icon={
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          >
            {renderDetailsContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
