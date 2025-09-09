import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card } from './index';
import { Icon } from './index';
import type { EnhancedSignal } from '../types/enhanced';

interface AIInsightsProps {
  signal?: EnhancedSignal;
  className?: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ 
  signal, 
  className = '' 
}) => {
  if (!signal || !signal.aiInsights) {
    return (
      <Card
        title="AI Insights"
        description="AI-powered analysis of social listening and consumer insights"
        icon={<Icon name="target" className="text-nocturn" size="md" />}
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
      icon={<Icon name="target" className="text-nocturn" size="md" />}
      className={className}
    >
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            // Custom styling for markdown elements
            h1: ({ children }) => (
              <h1 className="text-lg font-semibold text-gray-900 mb-3">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-semibold text-gray-900 mb-2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-sm text-gray-700 mb-3 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-sm text-gray-700 mb-3 space-y-1">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-sm text-gray-700">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-800">{children}</em>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">{children}</code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600 mb-3">{children}</blockquote>
            ),
          }}
        >
          {signal.aiInsights.content}
        </ReactMarkdown>
      </div>
    </Card>
  );
};

export default AIInsights;
