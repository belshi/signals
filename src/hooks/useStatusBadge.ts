import { useMemo } from 'react';
import { STATUS_CONFIG } from '../constants';
import type { Signal } from '../types';

export const useStatusBadge = (status: Signal['status']) => {
  return useMemo(() => {
    const config = STATUS_CONFIG[status];
    return {
      label: config.label,
      classes: config.classes,
      status,
    };
  }, [status]);
};
