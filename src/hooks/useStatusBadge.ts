import { useMemo } from 'react';
import { STATUS_CONFIG } from '../constants';
import type { SignalStatus } from '../types/enhanced';

export const useStatusBadge = (status: SignalStatus) => {
  return useMemo(() => {
    const config = STATUS_CONFIG[status];
    return {
      label: config.label,
      classes: config.classes,
      status,
    };
  }, [status]);
};
