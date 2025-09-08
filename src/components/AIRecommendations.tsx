import React from 'react';
import ReactMarkdown from 'react-markdown';
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
        icon={<Icon name="target" className="text-nocturn" size="md" />}
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
      icon={<Icon name="target" className="text-nocturn" size="md" />}
      className={className}
    >
      <div className="space-y-4">
        {signal.aiRecommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-brand-50 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-brand-600">
                  {index + 1}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600">{children}</blockquote>,
                }}
              >
                {recommendation}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AIRecommendations;
