import type { EnhancedPageHeaderProps, EnhancedPageHeaderButton } from '../types/enhanced';
import Button from './Button';

const PageHeader: React.FC<EnhancedPageHeaderProps> = ({ title, button, buttons }) => {
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

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {renderButtons()}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
