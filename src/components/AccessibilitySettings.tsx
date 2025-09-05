import React, { useState } from 'react';
import { useAccessibilityContext } from '../contexts/AccessibilityContext';
import AccessibleButton from './AccessibleButton';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ isOpen, onClose }) => {
  const {
    reducedMotion,
    highContrast,
    fontSize,
    screenReaderMode,
    keyboardNavigation,
    setReducedMotion,
    setHighContrast,
    setFontSize,
    setScreenReaderMode,
    setKeyboardNavigation,
    resetToDefaults,
  } = useAccessibilityContext();

  const [localSettings, setLocalSettings] = useState({
    reducedMotion,
    highContrast,
    fontSize,
    screenReaderMode,
    keyboardNavigation,
  });

  const handleSave = () => {
    setReducedMotion(localSettings.reducedMotion);
    setHighContrast(localSettings.highContrast);
    setFontSize(localSettings.fontSize);
    setScreenReaderMode(localSettings.screenReaderMode);
    setKeyboardNavigation(localSettings.keyboardNavigation);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings({
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      screenReaderMode: false,
      keyboardNavigation: true,
    });
    resetToDefaults();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Accessibility Settings
              </h3>
              <AccessibleButton
                variant="outline"
                size="sm"
                onClick={onClose}
                ariaLabel="Close accessibility settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </AccessibleButton>
            </div>

            <div className="space-y-4">
              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-700">
                    Reduce Motion
                  </label>
                  <p className="text-xs text-gray-500">Minimize animations and transitions</p>
                </div>
                <input
                  id="reduced-motion"
                  type="checkbox"
                  checked={localSettings.reducedMotion}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, reducedMotion: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700">
                    High Contrast
                  </label>
                  <p className="text-xs text-gray-500">Increase color contrast for better visibility</p>
                </div>
                <input
                  id="high-contrast"
                  type="checkbox"
                  checked={localSettings.highContrast}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, highContrast: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              {/* Font Size */}
              <div>
                <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <select
                  id="font-size"
                  value={localSettings.fontSize}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, fontSize: e.target.value as 'small' | 'medium' | 'large' }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Screen Reader Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="screen-reader" className="text-sm font-medium text-gray-700">
                    Screen Reader Mode
                  </label>
                  <p className="text-xs text-gray-500">Optimize for screen readers</p>
                </div>
                <input
                  id="screen-reader"
                  type="checkbox"
                  checked={localSettings.screenReaderMode}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, screenReaderMode: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="keyboard-nav" className="text-sm font-medium text-gray-700">
                    Enhanced Keyboard Navigation
                  </label>
                  <p className="text-xs text-gray-500">Enable advanced keyboard shortcuts</p>
                </div>
                <input
                  id="keyboard-nav"
                  type="checkbox"
                  checked={localSettings.keyboardNavigation}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, keyboardNavigation: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <AccessibleButton
              variant="primary"
              onClick={handleSave}
              className="w-full sm:w-auto sm:ml-3"
            >
              Save Settings
            </AccessibleButton>
            <AccessibleButton
              variant="outline"
              onClick={handleReset}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Reset to Defaults
            </AccessibleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
