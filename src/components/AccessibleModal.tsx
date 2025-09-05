import React, { useEffect, useCallback } from 'react';
import { useFocusManagement, useAccessibility } from '../hooks';
import AccessibleButton from './AccessibleButton';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  ariaLabel,
  ariaDescribedBy,
}) => {
  const { containerRef, restorePreviousFocus } = useFocusManagement({
    restoreFocus: true,
    focusOnMount: true,
  });

  const { announce, trapFocus } = useAccessibility({
    announceChanges: true,
    focusManagement: true,
    keyboardNavigation: true,
  });

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (closeOnEscape && event.key === 'Escape') {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      announce(`Modal opened: ${title}`);
      
      if (containerRef.current) {
        trapFocus(containerRef.current);
      }
    } else {
      document.body.style.overflow = 'unset';
      restorePreviousFocus();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, title, announce, trapFocus, restorePreviousFocus]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={handleOverlayClick}
        />

        {/* Modal panel */}
        <div
          ref={containerRef as React.Ref<HTMLDivElement>}
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${sizeClasses[size]}`}
        >
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h3
                id="modal-title"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                {title}
              </h3>
              <AccessibleButton
                variant="outline"
                size="sm"
                onClick={onClose}
                ariaLabel="Close modal"
                className="ml-4"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </AccessibleButton>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-4 pb-4 sm:p-6 sm:pt-0">
            {children}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <AccessibleButton
              variant="primary"
              onClick={onClose}
              className="w-full sm:w-auto sm:ml-3"
            >
              Close
            </AccessibleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibleModal;
