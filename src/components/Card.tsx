import React from 'react';
import Button from './Button';

export interface CardButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'brandGray';
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
  const getButtonVariant = (variant: CardButton['variant'] = 'primary'): 'primary' | 'secondary' | 'brandGray' => {
    switch (variant) {
      case 'secondary':
        return 'secondary';
      case 'brandGray':
        return 'brandGray';
      case 'primary':
            return 'primary';
      default:
        return 'primary';
    }
  };

  const hasHeader = title || description || icon || (buttons && buttons.length > 0);

  return (
    <div className={`bg-white rounded-xl ${className}`}>
      {hasHeader && (
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {icon && (
                <div className="flex-shrink-0">
                  <div className="rounded-lg flex items-center justify-center">
                    {icon}
                  </div>
                </div>
              )}
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                )}
                {description && (
                  <p className="text-sm text-gray-500 -mt-1">{description}</p>
                )}
              </div>
            </div>
            
            {buttons && buttons.length > 0 && (
              <div className="flex items-center space-x-2">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    onClick={button.onClick}
                    variant={getButtonVariant(button.variant)}
                    size="sm"
                    icon={button.icon}
                    iconPosition="left"
                  >
                    {button.label}
                  </Button>
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
