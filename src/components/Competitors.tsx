import React from 'react';
import { StackedList, type StackedListItem, type DropdownMenuItem } from '../components';
import type { BrandId } from '../types/enhanced';

interface Competitor {
  id: string;
  name: string;
}

interface CompetitorsProps {
  brandId?: BrandId;
}

const Competitors: React.FC<CompetitorsProps> = ({ brandId }) => {
  // Mock data for competitors
  const competitors: Competitor[] = [
    {
      id: '1',
      name: 'TechCorp Solutions'
    },
    {
      id: '2',
      name: 'InnovateLabs'
    },
    {
      id: '3',
      name: 'GlobalTech Inc'
    },
    {
      id: '4',
      name: 'StartupX'
    },
    {
      id: '5',
      name: 'MegaCorp Systems'
    }
  ];


  const handleEditCompetitor = (competitorId: string) => {
    console.log('Edit competitor:', competitorId);
    // TODO: Implement edit functionality
  };

  const handleDeleteCompetitor = (competitorId: string) => {
    console.log('Delete competitor:', competitorId);
    // TODO: Implement delete functionality
  };

  const getActionItems = (competitor: Competitor): DropdownMenuItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      icon: 'edit',
      variant: 'default',
      onClick: () => handleEditCompetitor(competitor.id)
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'trash',
      variant: 'danger',
      onClick: () => handleDeleteCompetitor(competitor.id)
    }
  ];

  const stackedListItems: StackedListItem[] = competitors.map((competitor) => ({
    id: competitor.id,
    text: competitor.name,
    actionItems: getActionItems(competitor),
    actionTriggerIcon: 'more-vertical',
    actionTriggerVariant: 'secondary',
    actionTriggerSize: 'sm',
    actionTriggerAriaLabel: `More options for ${competitor.name}`
  }));

  return (
    <StackedList 
      items={stackedListItems}
      bordered={false}
      aria-label="Competitors list"
    />
  );
};

export default Competitors;
