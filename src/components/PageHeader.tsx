import type { PageHeaderProps, PageHeaderButton } from '../types';
import Button from './Button';

const PageHeader: React.FC<PageHeaderProps> = ({ title, button, buttons }) => {
  const renderButton = (btn: PageHeaderButton, index: number) => (
    <Button
      key={index}
      label={btn.label}
      onClick={btn.onClick}
      variant={btn.variant}
      icon={btn.icon}
    />
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
