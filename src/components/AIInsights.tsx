import React from 'react';
import { Card } from './index';
import { Icon } from './index';
import type { EnhancedSignal } from '../types/enhanced';

interface AIInsightsProps {
  signal?: EnhancedSignal;
  className?: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ signal, className = '' }) => {
  if (!signal || !signal.aiInsights) {
    return (
      <Card
        title="AI Insights"
        description="AI-powered analysis of social listening and consumer insights"
        icon={<Icon name="target" className="text-indigo-600" size="md" />}
        className={className}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">No AI insights available for this signal</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="AI Insights"
      description="AI-powered analysis of social listening and consumer insights"
      icon={<Icon name="target" className="text-indigo-600" size="md" />}
      className={className}
    >
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <Icon name="users" className="text-blue-600 mr-2" size="sm" />
            Social Listening
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {signal.aiInsights.socialListening}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <Icon name="building" className="text-green-600 mr-2" size="sm" />
            Consumer Insights
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {signal.aiInsights.consumerInsights}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AIInsights;
