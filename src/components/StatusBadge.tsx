import React from 'react';
import { useStatusBadge } from '../hooks';
import type { Signal } from '../types';

interface StatusBadgeProps {
  status: Signal['status'];
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const { label, classes } = useStatusBadge(status);

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${classes} ${className}`}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
