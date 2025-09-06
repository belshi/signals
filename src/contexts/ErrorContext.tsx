import React, { createContext, useReducer, useCallback, type ReactNode } from 'react';
import ErrorToast from '../components/ErrorToast';

interface ErrorState {
  errors: Array<{
    id: string;
    error: Error | string;
    timestamp: number;
  }>;
}

type ErrorAction =
  | { type: 'ADD_ERROR'; payload: { id: string; error: Error | string; timestamp: number } }
  | { type: 'REMOVE_ERROR'; payload: string }
  | { type: 'CLEAR_ALL_ERRORS' };

interface ErrorContextType {
  errors: ErrorState['errors'];
  addError: (error: Error | string) => void;
  removeError: (id: string) => void;
  clearAllErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };
    case 'REMOVE_ERROR':
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload),
      };
    case 'CLEAR_ALL_ERRORS':
      return {
        ...state,
        errors: [],
      };
    default:
      return state;
  }
};

interface ErrorProviderProps {
  children: ReactNode;
  maxErrors?: number;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ 
  children, 
  maxErrors = 5 
}) => {
  const [state, dispatch] = useReducer(errorReducer, { errors: [] });

  const addError = useCallback((error: Error | string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();

    dispatch({
      type: 'ADD_ERROR',
      payload: { id, error, timestamp },
    });

    // Auto-remove old errors if we exceed the limit
    if (state.errors.length >= maxErrors) {
      const oldestError = state.errors[0];
      if (oldestError) {
        dispatch({
          type: 'REMOVE_ERROR',
          payload: oldestError.id,
        });
      }
    }
  }, [state.errors.length, maxErrors]);

  const removeError = useCallback((id: string) => {
    dispatch({
      type: 'REMOVE_ERROR',
      payload: id,
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    dispatch({
      type: 'CLEAR_ALL_ERRORS',
    });
  }, []);

  const contextValue: ErrorContextType = {
    errors: state.errors,
    addError,
    removeError,
    clearAllErrors,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
      {/* Render error toasts */}
      {state.errors.map(({ id, error }) => (
        <ErrorToast
          key={id}
          error={error}
          onDismiss={() => removeError(id)}
          autoDismiss={true}
          autoDismissDelay={5000}
        />
      ))}
    </ErrorContext.Provider>
  );
};

