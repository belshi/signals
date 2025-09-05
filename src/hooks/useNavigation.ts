import { useLocation } from 'react-router-dom';
import { NAV_ITEMS, ROUTES } from '../constants';

export const useNavigation = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const getActiveNavItem = () => {
    return NAV_ITEMS.find(item => item.path === location.pathname);
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
