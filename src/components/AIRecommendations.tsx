import React from 'react';
import { Card } from './index';
import { Icon } from './index';
import type { EnhancedSignal } from '../types/enhanced';

interface AIRecommendationsProps {
  signal?: EnhancedSignal;
  className?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ signal, className = '' }) => {
  if (!signal || !signal.aiRecommendations || signal.aiRecommendations.length === 0) {
    return (
      <Card
        title="AI Recommendations"
        description="AI-generated recommendations based on brand and brand goals"
        icon={<Icon name="target" className="text-indigo-600" size="md" />}
        className={className}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">No AI recommendations available for this signal</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="AI Recommendations"
      description="AI-generated recommendations based on brand and brand goals"
      icon={<Icon name="target" className="text-indigo-600" size="md" />}
      className={className}
    >
      <div className="space-y-4">
        {signal.aiRecommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-indigo-600">
                  {index + 1}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {recommendation}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AIRecommendations;
