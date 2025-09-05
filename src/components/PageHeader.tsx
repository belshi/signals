import type { PageHeaderProps } from '../types';

const PageHeader: React.FC<PageHeaderProps> = ({ title, button }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {button && (
            <div>
              <button
                onClick={button.onClick}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  button.variant === 'secondary'
                    ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                }`}
                type="button"
                aria-label={button.label}
              >
                {button.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
