import { useLocation } from 'react-router-dom';
import { NAV_ITEMS, ROUTES } from '../constants';

export const useNavigation = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    // For root path, use exact match
    if (path === '/') {
      return location.pathname === path;
    }
    
    // For other paths, check if current path starts with the nav item path
    // This makes parent routes active when on sub-pages (e.g., /signals active when on /signals/1)
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getActiveNavItem = () => {
    return NAV_ITEMS.find(item => isActive(item.path));
  };

  const isSignalsPage = location.pathname === ROUTES.SIGNALS;
  const isBrandPage = location.pathname === ROUTES.BRAND;

  return {
    currentPath: location.pathname,
    isActive,
    getActiveNavItem,
    isSignalsPage,
    isBrandPage,
    navItems: NAV_ITEMS,
  };
};
