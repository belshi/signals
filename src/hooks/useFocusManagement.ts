import { useEffect, useRef, useCallback } from 'react';

interface FocusManagementOptions {
  restoreFocus?: boolean;
  focusOnMount?: boolean;
}

export const useFocusManagement = (options: FocusManagementOptions = {}) => {
  const {
    restoreFocus = true,
    focusOnMount = false,
  } = options;

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Store the previously focused element
  useEffect(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [restoreFocus]);

  // Focus on mount if requested
  useEffect(() => {
    if (focusOnMount && containerRef.current) {
      const focusableElement = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      focusableElement?.focus();
    }
  }, [focusOnMount]);

  const restorePreviousFocus = useCallback(() => {
    if (restoreFocus && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [restoreFocus]);

  const focusFirstElement = useCallback(() => {
    if (containerRef.current) {
      const focusableElement = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      focusableElement?.focus();
    }
  }, []);

  const focusLastElement = useCallback(() => {
    if (containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      lastElement?.focus();
    }
  }, []);

  return {
    containerRef,
    restorePreviousFocus,
    focusFirstElement,
    focusLastElement,
  };
};
