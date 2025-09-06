import React, { useState, useCallback, useRef } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  ariaLabel?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  className = '',
  ariaLabel = 'Tabs',
  orientation = 'horizontal',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const [focusedTab, setFocusedTab] = useState<string | null>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleTabClick = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  }, [tabs, onTabChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, tabId: string) => {
    const enabledTabs = tabs.filter(tab => !tab.disabled);
    const currentEnabledIndex = enabledTabs.findIndex(tab => tab.id === tabId);

    switch (event.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          event.preventDefault();
          const nextIndex = (currentEnabledIndex + 1) % enabledTabs.length;
          const nextTab = enabledTabs[nextIndex];
          setFocusedTab(nextTab.id);
          handleTabClick(nextTab.id);
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          event.preventDefault();
          const prevIndex = currentEnabledIndex === 0 ? enabledTabs.length - 1 : currentEnabledIndex - 1;
          const prevTab = enabledTabs[prevIndex];
          setFocusedTab(prevTab.id);
          handleTabClick(prevTab.id);
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical') {
          event.preventDefault();
          const nextIndex = (currentEnabledIndex + 1) % enabledTabs.length;
          const nextTab = enabledTabs[nextIndex];
          setFocusedTab(nextTab.id);
          handleTabClick(nextTab.id);
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical') {
          event.preventDefault();
          const prevIndex = currentEnabledIndex === 0 ? enabledTabs.length - 1 : currentEnabledIndex - 1;
          const prevTab = enabledTabs[prevIndex];
          setFocusedTab(prevTab.id);
          handleTabClick(prevTab.id);
        }
        break;
      case 'Home':
        event.preventDefault();
        const firstTab = enabledTabs[0];
        setFocusedTab(firstTab.id);
        handleTabClick(firstTab.id);
        break;
      case 'End':
        event.preventDefault();
        const lastTab = enabledTabs[enabledTabs.length - 1];
        setFocusedTab(lastTab.id);
        handleTabClick(lastTab.id);
        break;
    }
  }, [tabs, orientation, handleTabClick]);


  return (
    <div className={`tabs ${className}`}>
      <div
        ref={tabListRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={`flex ${orientation === 'vertical' ? 'flex-col space-y-1' : 'space-x-1 border-b border-gray-200'}`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            aria-disabled={tab.disabled}
            aria-label={tab.ariaLabel || tab.label}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            disabled={tab.disabled}
            className={`
              px-4 py-2 text-sm font-medium rounded-t-md transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              ${activeTab === tab.id
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }
              ${tab.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
              }
              ${focusedTab === tab.id ? 'ring-2 ring-indigo-500' : ''}
            `}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            onFocus={() => setFocusedTab(tab.id)}
            onBlur={() => setFocusedTab(null)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="mt-4"
        >
          {activeTab === tab.id && tab.content}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
