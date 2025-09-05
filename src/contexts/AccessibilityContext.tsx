import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AccessibilityState {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityActions {
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (highContrast: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setScreenReaderMode: (enabled: boolean) => void;
  setKeyboardNavigation: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

interface AccessibilityContextType extends AccessibilityState, AccessibilityActions {}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

const defaultState: AccessibilityState = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  screenReaderMode: false,
  keyboardNavigation: true,
};

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>(() => {
    // Check for user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    return {
      ...defaultState,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
    };
  });

  const setReducedMotion = useCallback((reduced: boolean) => {
    setState(prev => ({ ...prev, reducedMotion: reduced }));
  }, []);

  const setHighContrast = useCallback((highContrast: boolean) => {
    setState(prev => ({ ...prev, highContrast }));
  }, []);

  const setFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    setState(prev => ({ ...prev, fontSize: size }));
  }, []);

  const setScreenReaderMode = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, screenReaderMode: enabled }));
  }, []);

  const setKeyboardNavigation = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, keyboardNavigation: enabled }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setState(defaultState);
  }, []);

  const contextValue: AccessibilityContextType = {
    ...state,
    setReducedMotion,
    setHighContrast,
    setFontSize,
    setScreenReaderMode,
    setKeyboardNavigation,
    resetToDefaults,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibilityContext = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
  }
  return context;
};
