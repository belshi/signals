import { Link } from 'react-router-dom';
import { useState } from 'react';
import { APP_NAME } from '../constants';
import { useNavigation } from '../hooks';
import logo from '../assets/images/logo.svg';
import Icon from './Icon';

const Sidebar: React.FC = () => {
  const { isActive, navItems } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getNavIcon = (itemId: string) => {
    switch (itemId) {
      case 'brands':
        return 'building';
      case 'signals':
        return 'target';
      default:
        return 'building';
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav 
        className="hidden sm:flex sm:flex-col fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 z-40" 
        role="navigation" 
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-4">
          <Link 
            to="/" 
            className="flex items-center justify-center focus:outline-none focus:ring-0 focus:ring-none rounded-md"
            aria-label={`${APP_NAME} - Go to homepage`}
          >
            <img 
              src={logo} 
              alt={`${APP_NAME} logo`}
              className="h-auto w-20 object-contain"
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col flex-1 py-2 gap-y-4" role="menubar">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              role="menuitem"
              className={`flex flex-col items-center justify-center w-full h-auto mb-1 transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-none rounded group relative ${
                isActive(item.path)
                  ? 'bg-transparent text-nocturn'
                  : 'text-nocturn hover:text-gray-700'
              }`}
              aria-current={isActive(item.path) ? 'page' : undefined}
              aria-label={`Navigate to ${item.label}`}
            >
              <Icon 
                name={getNavIcon(item.id) as any}
                className={`h-10 w-10 mb-1 p-2 ${
                  isActive(item.path)
                    ? 'bg-nocturn rounded-full text-white'
                    : 'bg-transparent rounded-full text-nocturn hover:bg-brand-gray'
                }`}
              />
              <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
              
              {/* Tooltip for extra clarity on hover */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Circle */}
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center justify-center w-12 h-12 bg-brand-gray text-nocture rounded-full text-base font-bold">
            OW
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        {/* Mobile menu button */}
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
          <div className="flex items-center justify-between h-16 px-4">
            <Link 
              to="/" 
              className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label={`${APP_NAME} - Go to homepage`}
            >
              <img 
                src={logo} 
                alt={`${APP_NAME} logo`}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">
                {APP_NAME}
              </span>
            </Link>
            
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle main menu"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu */}
          <div 
            className={`${mobileMenuOpen ? 'block' : 'hidden'} border-t border-gray-200`}
            id="mobile-menu"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  role="menuitem"
                  className={`flex items-center px-4 py-3 text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                    isActive(item.path)
                      ? 'bg-brand-50 border-l-4 border-brand-600 text-brand-700'
                      : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon 
                    name={getNavIcon(item.id) as any}
                    className="h-5 w-5 mr-3"
                  />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
