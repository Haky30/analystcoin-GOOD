import React from 'react';
import { NetworkError } from './NetworkError';
import { AuthenticationError } from './AuthenticationError';
import { ApiError } from './ApiError';
import { useError } from '../../contexts/ErrorContext';

export function ErrorDisplay() {
  const { error, clearError } = useError();

  if (!error) return null;

  const handleRetry = async () => {
    if (error.retryAction) {
      clearError();
      try {
        await error.retryAction();
      } catch {
        // Error will be captured by the error context
      }
    }
  };

  switch (error.category) {
    case 'network':
      return (
        <NetworkError
          message={error.message}
          onRetry={error.retryAction ? handleRetry : undefined}
        />
      );
    case 'auth':
      return <AuthenticationError message={error.message} />;
    case 'api':
      return (
        <ApiError
          message={error.message}
          onRetry={error.retryAction ? handleRetry : undefined}
        />
      );
    default:
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error.message}</p>
        </div>
      );
  }
}