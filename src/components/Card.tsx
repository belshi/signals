import React from 'react';
import Button from './Button';
import IconButton, { type IconButtonVariant, type IconButtonSize } from './IconButton';
import { type IconName } from './Icon';

export interface CardButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'brandGray';
  icon?: React.ReactNode;
}

export interface CardIconButton {
  icon: IconName;
  onClick: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  ariaLabel: string;
}

export interface CardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  buttons?: CardButton[];
  iconButtons?: CardIconButton[];
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  buttons = [],
  iconButtons = [],
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

  const hasHeader = title || description || icon || (buttons && buttons.length > 0) || (iconButtons && iconButtons.length > 0);

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
            
            {((buttons && buttons.length > 0) || (iconButtons && iconButtons.length > 0)) && (
              <div className="flex items-center space-x-2">
                {buttons.map((button, index) => (
                  <Button
                    key={`button-${index}`}
                    onClick={button.onClick}
                    variant={getButtonVariant(button.variant)}
                    size="sm"
                    icon={button.icon}
                    iconPosition="left"
                  >
                    {button.label}
                  </Button>
                ))}
                {iconButtons.map((iconButton, index) => (
                  <IconButton
                    key={`icon-button-${index}`}
                    icon={iconButton.icon}
                    onClick={iconButton.onClick}
                    variant={iconButton.variant}
                    size={iconButton.size}
                    loading={iconButton.loading}
                    ariaLabel={iconButton.ariaLabel}
                  />
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
