import React from 'react';
import { Icons } from '../constants';
import MoreMenu, { type MoreMenuOption } from './MoreMenu';

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

  const getMenuOptions = (competitor: Competitor): MoreMenuOption[] => [
    {
      label: 'Edit',
      onClick: () => handleEditCompetitor(competitor.id),
      icon: <Icons.Edit className="w-4 h-4" />,
      variant: 'default'
    },
    {
      label: 'Delete',
      onClick: () => handleDeleteCompetitor(competitor.id),
      icon: <Icons.Trash className="w-4 h-4" />,
      variant: 'danger'
    }
  ];

  return (
    <div>
      <ul className="divide-y divide-gray-200">
        {competitors.map((competitor) => (
          <li key={competitor.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 flex-1 min-w-0">
                {competitor.name}
              </p>
              <div className="ml-4 flex-shrink-0">
                <MoreMenu options={getMenuOptions(competitor)} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Competitors;
