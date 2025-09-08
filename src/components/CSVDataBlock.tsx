import React, { useState } from 'react';
import { Card } from './index';
import { Icon } from './index';
import { Button } from './index';
import type { EnhancedSignal } from '../types/enhanced';

interface CSVDataBlockProps {
  signal?: EnhancedSignal;
  className?: string;
}

const CSVDataBlock: React.FC<CSVDataBlockProps> = ({ signal, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!signal || !signal.csvData) {
    return (
      <Card
        title="Signal Data"
        description="CSV formatted signal data with insights and recommendations"
        icon={<Icon name="building" className="text-brand-600" size="md" />}
        className={className}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">No CSV data available for this signal</p>
        </div>
      </Card>
    );
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(signal.csvData || '');
      // You could add a toast notification here
      console.log('CSV data copied to clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownloadCSV = () => {
    const blob = new Blob([signal.csvData || ''], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signal-${signal.id}-data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card
      title="Signal Data"
      description="CSV formatted signal data with insights and recommendations"
      icon={<Icon name="building" className="text-brand-600" size="md" />}
      className={className}
      buttons={[
        {
          label: isExpanded ? 'Collapse' : 'Expand',
          onClick: () => setIsExpanded(!isExpanded),
          icon: <Icon name={isExpanded ? 'minus' : 'plus'} size="sm" />,
          variant: 'secondary'
        },
        {
          label: 'Copy',
          onClick: handleCopyToClipboard,
          icon: <Icon name="edit" size="sm" />,
          variant: 'secondary'
        },
        {
          label: 'Download',
          onClick: handleDownloadCSV,
          icon: <Icon name="building" size="sm" />,
          variant: 'primary'
        }
      ]}
    >
      <div className="space-y-4">
        {!isExpanded ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-4">
              Click "Expand" to view the full CSV data
            </p>
            <Button
              onClick={() => setIsExpanded(true)}
              variant="secondary"
              size="sm"
            >
              <Icon name="plus" size="sm" className="mr-2" />
              Expand Data
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">
                CSV Data ({signal.csvData.split('\n').length} lines)
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCopyToClipboard}
                  variant="secondary"
                  size="sm"
                >
                  <Icon name="edit" size="sm" className="mr-1" />
                  Copy
                </Button>
                <Button
                  onClick={handleDownloadCSV}
                  variant="primary"
                  size="sm"
                >
                  <Icon name="building" size="sm" className="mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                {signal.csvData}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CSVDataBlock;
