import React from 'react';
import { Page, Card, BrandDetails } from '../components';
import { Icons } from '../constants';
import { useBrandContext } from '../contexts';

const BrandPage: React.FC = () => {
  const { refreshBrandDetails } = useBrandContext();

  return (
    <Page>
      <Page.Header title="My Brand" />
      
      <Page.Content>
        <Page.Error onRetry={refreshBrandDetails} />
        <Page.Loading message="Loading brand details..." />
        
        <div className="space-y-6">
          <Card
            title="Brand Details"
            description="Basic information about your brand"
            icon={<Icons.Building className="w-5 h-5 text-indigo-600" />}
          >
            <BrandDetails />
          </Card>
        </div>
      </Page.Content>
    </Page>
  );
};

export default BrandPage;
