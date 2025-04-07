import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export type ErrorCategory = 'network' | 'auth' | 'api' | 'validation' | 'unknown';

export interface ErrorState {
  message: string;
  category: ErrorCategory;
  timestamp: number;
  retryAction?: () => Promise<void>;
}

interface ErrorContextType {
  error: ErrorState | null;
  setError: (error: ErrorState | null) => void;
  clearError: () => void;
  captureError: (error: Error | string, category: ErrorCategory, retryAction?: () => Promise<void>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((
    error: Error | string,
    category: ErrorCategory,
    retryAction?: () => Promise<void>
  ) => {
    const errorMessage = error instanceof Error ? error.message : error;
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${category}] ${errorMessage}`, error);
    }

    // Set the error state
    setError({
      message: errorMessage,
      category,
      timestamp: Date.now(),
      retryAction
    });

    // Show toast notification
    toast.error(errorMessage);
  }, []);

  const value = {
    error,
    setError,
    clearError,
    captureError,
    isLoading,
    setIsLoading
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}