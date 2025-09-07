import React from 'react';
import { StackedList, type StackedListItem } from '../components';

interface Competitor {
  id: string;
  name: string;
}

const Competitors: React.FC = () => {
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

  const stackedListItems: StackedListItem[] = competitors.map((competitor) => ({
    id: competitor.id,
    text: competitor.name,
    actionIcon: 'more-vertical',
    actionVariant: 'secondary',
    actionSize: 'sm',
    actionAriaLabel: `More options for ${competitor.name}`,
    onActionClick: () => {
      // For now, we'll just log the competitor ID
      // In a real app, this could open a dropdown or modal
      console.log('More options for competitor:', competitor.id);
    }
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
