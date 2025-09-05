import React from 'react';

export interface CardButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}

export interface CardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  buttons?: CardButton[];
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  buttons = [],
  children,
  className = '',
  noPadding = false,
}) => {
  const getButtonStyles = (variant: CardButton['variant'] = 'primary') => {
    const baseStyles = 'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'secondary':
        return `${baseStyles} text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500`;
      case 'danger':
        return `${baseStyles} text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500`;
      case 'primary':
      default:
        return `${baseStyles} text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500`;
    }
  };

  const hasHeader = title || description || icon || (buttons && buttons.length > 0);

  return (
    <div className={`bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {hasHeader && (
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {icon && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    {icon}
                  </div>
                </div>
              )}
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                )}
                {description && (
                  <p className="text-sm text-gray-500">{description}</p>
                )}
              </div>
            </div>
            
            {buttons && buttons.length > 0 && (
              <div className="flex items-center space-x-2">
                {buttons.map((button, index) => (
                  <button
                    key={index}
                    onClick={button.onClick}
                    className={getButtonStyles(button.variant)}
                    type="button"
                  >
                    {button.icon && (
                      <span className="mr-1.5">
                        {button.icon}
                      </span>
                    )}
                    {button.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
