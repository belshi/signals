import React from 'react';
import type { EnhancedPageHeaderProps, EnhancedPageHeaderButton } from '../types/enhanced';
import Button from './Button';

const PageHeader: React.FC<EnhancedPageHeaderProps> = ({ title, subtitle, button, buttons, breadcrumbs }) => {
  const renderButton = (btn: EnhancedPageHeaderButton, index: number) => (
    <Button
      key={index}
      onClick={btn.onClick}
      variant={btn.variant === 'danger' ? 'primary' : btn.variant}
      icon={btn.icon}
      disabled={btn.disabled}
      loading={btn.loading}
      ariaLabel={btn.tooltip}
    >
      {btn.label}
    </Button>
  );

  const renderButtons = () => {
    if (buttons && buttons.length > 0) {
      return (
        <div className="flex items-center space-x-3">
          {buttons.map((btn, index) => renderButton(btn, index))}
        </div>
      );
    }
    
    if (button) {
      return renderButton(button, 0);
    }
    
    return null;
  };

  const renderBreadcrumbs = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    
    return (
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="flex-shrink-0 h-4 w-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-sm font-medium text-gray-900" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          {renderBreadcrumbs()}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {renderButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
