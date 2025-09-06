import React from 'react';
import { Icons } from '../constants';
import MoreMenu, { type MoreMenuOption } from './MoreMenu';

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

  const getMenuOptions = (goal: BrandGoal): MoreMenuOption[] => [
    {
      label: 'Edit',
      onClick: () => handleEditGoal(goal.id),
      icon: <Icons.Edit className="w-4 h-4" />,
      variant: 'default'
    },
    {
      label: 'Delete',
      onClick: () => handleDeleteGoal(goal.id),
      icon: <Icons.Trash className="w-4 h-4" />,
      variant: 'danger'
    }
  ];

  return (
    <div>
      <ul className="divide-y divide-gray-200">
        {goals.map((goal) => (
          <li key={goal.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-900 flex-1 min-w-0">
                {goal.title}
              </p>
              <div className="ml-4 flex-shrink-0">
                <MoreMenu options={getMenuOptions(goal)} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandGoals;
