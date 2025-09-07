import React from 'react';
import { StackedList, type StackedListItem, type DropdownMenuItem } from '../components';

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

  const getActionItems = (goal: BrandGoal): DropdownMenuItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      icon: 'edit',
      variant: 'default',
      onClick: () => handleEditGoal(goal.id)
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'trash',
      variant: 'danger',
      onClick: () => handleDeleteGoal(goal.id)
    }
  ];

  const stackedListItems: StackedListItem[] = goals.map((goal) => ({
    id: goal.id,
    text: goal.title,
    actionItems: getActionItems(goal),
    actionTriggerIcon: 'more-vertical',
    actionTriggerVariant: 'secondary',
    actionTriggerSize: 'sm',
    actionTriggerAriaLabel: `More options for ${goal.title}`
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
