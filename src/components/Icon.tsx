import React from 'react';
import {
  PlusIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  UsersIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Define the available icon names as a union type for type safety
export type IconName = 
  | 'plus'
  | 'building'
  | 'target'
  | 'users'
  | 'more-vertical'
  | 'edit'
  | 'trash'
  | 'external-link'
  | 'x';

// Map icon names to Heroicons components
const iconMap = {
  'plus': PlusIcon,
  'building': BuildingOfficeIcon,
  'target': CheckCircleIcon,
  'users': UsersIcon,
  'more-vertical': EllipsisVerticalIcon,
  'edit': PencilIcon,
  'trash': TrashIcon,
  'external-link': ArrowTopRightOnSquareIcon,
  'x': XMarkIcon,
} as const;

export interface IconProps {
  name: IconName;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  'aria-hidden'?: boolean | string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

/**
 * Unified Icon component that wraps Heroicons for consistent usage across the application.
 * Provides type-safe icon names and consistent sizing options.
 * 
 * @param name - The name of the icon to display
 * @param className - Additional CSS classes to apply
 * @param size - Predefined size options (sm, md, lg, xl)
 * @param aria-hidden - Whether the icon should be hidden from screen readers
 */
const Icon: React.FC<IconProps> = ({ 
  name, 
  className = '', 
  size = 'md',
  'aria-hidden': ariaHidden = true 
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  const sizeClass = sizeClasses[size];
  const combinedClassName = `${sizeClass} ${className}`.trim();

  // Convert string boolean to actual boolean for aria-hidden
  const ariaHiddenValue = typeof ariaHidden === 'string' 
    ? ariaHidden === 'true' 
    : ariaHidden;

  return (
    <IconComponent 
      className={combinedClassName}
      aria-hidden={ariaHiddenValue}
    />
  );
};

export default Icon;
