import React from 'react';
import { Page, Card, BrandDetails, BrandGoals, Competitors } from '../components';
import { Icon } from '../components';
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
            icon={<Icon name="building" className="text-indigo-600" size="md" />}
            buttons={[
              {
                label: 'Edit',
                onClick: handleEditBrandDetails,
                icon: <Icon name="edit" size="sm" />,
                variant: 'secondary'
              }
            ]}
          >
            <BrandDetails />
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Brand Goals"
              description="Track your brand objectives and milestones"
              icon={<Icon name="target" className="text-indigo-600" size="md" />}
              noPadding={true}
              buttons={[
                {
                  label: 'Add Goal',
                  onClick: handleAddGoal,
                  icon: <Icon name="plus" size="sm" />,
                  variant: 'secondary'
                }
              ]}
            >
              <BrandGoals />
            </Card>
            
            <Card
              title="Competitors"
              description="Monitor your competitive landscape"
              icon={<Icon name="users" className="text-indigo-600" size="md" />}
              noPadding={true}
              buttons={[
                {
                  label: 'Add Competitor',
                  onClick: handleAddCompetitor,
                  icon: <Icon name="plus" size="sm" />,
                  variant: 'secondary'
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
