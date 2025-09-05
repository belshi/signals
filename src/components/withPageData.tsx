import { type ComponentType } from 'react';
import { usePageData } from '../hooks/usePageData';

interface WithPageDataOptions {
  onLoad?: () => Promise<void>;
  onError?: (error: Error) => void;
  autoLoad?: boolean;
}

export function withPageData<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPageDataOptions = {}
) {
  const WithPageDataComponent = (props: P) => {
    usePageData(options);

    return <WrappedComponent {...props} />;
  };

  WithPageDataComponent.displayName = `withPageData(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithPageDataComponent;
}
