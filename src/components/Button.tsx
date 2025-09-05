import React from 'react';

export interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  icon,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const getVariantStyles = () => {
    const baseStyles = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'secondary':
        return `${baseStyles} text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500`;
      case 'danger':
        return `${baseStyles} text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`;
      case 'primary':
      default:
        return `${baseStyles} text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${getVariantStyles()} ${className}`}
      type={type}
      disabled={disabled}
      aria-label={label}
    >
      {icon && (
        <span className="mr-2">
          {icon}
        </span>
      )}
      {label}
    </button>
  );
};

export default Button;
