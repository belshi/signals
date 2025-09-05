import { Component, type ErrorInfo, type ReactNode } from 'react';
import ErrorMessage from './ErrorMessage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

class AsyncErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);

    // Log error for debugging
    console.error('AsyncErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
    });
  };

  handleRetry = () => {
    const { retryCount } = this.state;
    const newRetryCount = retryCount + 1;

    this.setState({ retryCount: newRetryCount });

    // Exponential backoff for retries
    const delay = Math.min(1000 * Math.pow(2, newRetryCount - 1), 10000);
    
    this.retryTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, delay);
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="p-4">
          <ErrorMessage
            message={error?.message || 'An unexpected error occurred'}
            onRetry={this.handleRetry}
            variant="error"
          />
          {retryCount > 0 && (
            <div className="mt-2 text-sm text-gray-500 text-center">
              Retry attempt {retryCount}
            </div>
          )}
        </div>
      );
    }

    return children;
  }
}

export default AsyncErrorBoundary;
