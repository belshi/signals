import React from 'react';
import { StackedList, type StackedListItem } from '../components';

interface BrandGoal {
  id: string;
  title: string;
}

const BrandGoals: React.FC = () => {
  // Mock data for brand goals
  const goals: BrandGoal[] = [
    {
      id: '1',
      title: 'Increase brand awareness by 25% through social media and content marketing'
    },
    {
      id: '2',
      title: 'Launch new eco-friendly product line to expand market reach'
    },
    {
      id: '3',
      title: 'Improve customer satisfaction score to NPS of 8.5 or higher'
    },
    {
      id: '4',
      title: 'Expand to 3 new markets in Europe and Asia'
    },
    {
      id: '5',
      title: 'Reduce customer acquisition cost by optimizing marketing spend'
    }
  ];


  const handleEditGoal = (goalId: string) => {
    console.log('Edit goal:', goalId);
    // TODO: Implement edit functionality
  };

  const handleDeleteGoal = (goalId: string) => {
    console.log('Delete goal:', goalId);
    // TODO: Implement delete functionality
  };

  const stackedListItems: StackedListItem[] = goals.map((goal) => ({
    id: goal.id,
    text: goal.title,
    actionIcon: 'more-vertical',
    actionVariant: 'secondary',
    actionSize: 'sm',
    actionAriaLabel: `More options for ${goal.title}`,
    onActionClick: () => {
      // For now, we'll just log the goal ID
      // In a real app, this could open a dropdown or modal
      console.log('More options for goal:', goal.id);
    }
  }));

  return (
    <StackedList 
      items={stackedListItems}
      bordered={false}
      aria-label="Brand goals list"
    />
  );
};

export default BrandGoals;
