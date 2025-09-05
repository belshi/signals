import React from 'react';

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ 
  label, 
  value, 
  className = '',
  labelClassName = '',
  valueClassName = ''
}) => {
  return (
    <div className={`sm:grid sm:grid-cols-3 sm:gap-4 ${className}`}>
      <dt className={`text-sm font-medium text-gray-500 ${labelClassName}`}>
        {label}
      </dt>
      <dd className={`mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ${valueClassName}`}>
        {value}
      </dd>
    </div>
  );
};

export default DetailRow;
