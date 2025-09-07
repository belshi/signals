import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  size = 'md' 
}) => {
  const getVariantClasses = (variant: BadgeVariant): string => {
    const variants = {
      primary: 'bg-indigo-100 text-indigo-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    };
    return variants[variant];
  };

  const getSizeClasses = (size: string): string => {
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    };
    return sizes[size];
  };

  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
