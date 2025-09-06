import React from 'react';
import { Page, Card, BrandDetails, BrandGoals, Competitors } from '../components';
import { Icons } from '../constants';
import { useBrandContext } from '../contexts';

const BrandPage: React.FC = () => {
  const { refreshBrandDetails } = useBrandContext();

  const handleAddGoal = () => {
    console.log('Add new goal');
    // TODO: Implement add functionality
  };

  const handleAddCompetitor = () => {
    console.log('Add new competitor');
    // TODO: Implement add functionality
  };

  const handleEditBrandDetails = () => {
    console.log('Edit brand details');
    // TODO: Implement edit functionality
  };

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
            buttons={[
              {
                label: 'Edit',
                onClick: handleEditBrandDetails,
                icon: <Icons.Edit className="w-4 h-4" />,
                variant: 'primary'
              }
            ]}
          >
            <BrandDetails />
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Brand Goals"
              description="Track your brand objectives and milestones"
              icon={<Icons.Target className="w-5 h-5 text-indigo-600" />}
              noPadding={true}
              buttons={[
                {
                  label: 'Add Goal',
                  onClick: handleAddGoal,
                  icon: <Icons.Plus className="w-4 h-4" />,
                  variant: 'primary'
                }
              ]}
            >
              <BrandGoals />
            </Card>
            
            <Card
              title="Competitors"
              description="Monitor your competitive landscape"
              icon={<Icons.Users className="w-5 h-5 text-indigo-600" />}
              noPadding={true}
              buttons={[
                {
                  label: 'Add Competitor',
                  onClick: handleAddCompetitor,
                  icon: <Icons.Plus className="w-4 h-4" />,
                  variant: 'primary'
                }
              ]}
            >
              <Competitors />
            </Card>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};

export default BrandPage;
