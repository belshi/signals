import React from 'react';
import { DetailRow } from './index';
import type { EnhancedSignal, EnhancedBrandDetails } from '../types/enhanced';

interface SignalDetailsProps {
  className?: string;
  signal?: EnhancedSignal;
  brand?: EnhancedBrandDetails;
}

const SignalDetails: React.FC<SignalDetailsProps> = ({ className = '', signal, brand }) => {
  if (!signal) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No signal details available</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };


  return (
    <dl className={`space-y-4 ${className}`}>
      <DetailRow
        label="Brand"
        value={brand ? brand.name : 'No brand linked'}
      />
      <DetailRow
        label="Prompt"
        value={signal.prompt || 'No prompt available'}
      />
      <DetailRow
        label="Created"
        value={formatDate(signal.createdAt)}
      />
      <DetailRow
        label="Last Updated"
        value={formatDate(signal.updatedAt)}
      />
    </dl>
  );
};

export default SignalDetails;
