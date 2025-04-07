import { useState, useCallback } from 'react';
import { useError } from '../contexts/ErrorContext';
import { retry } from '../utils/retry';

export function useRetry<T>(
  operation: () => Promise<T>,
  options = {
    maxAttempts: 3,
    baseDelay: 1000,
    category: 'api' as const
  }
) {
  const [loading, setLoading] = useState(false);
  const { captureError } = useError();

  const execute = useCallback(async () => {
    setLoading(true);
    try {
      return await retry(operation, options.maxAttempts, options.baseDelay);
    } catch (error) {
      captureError(
        error instanceof Error ? error : new Error('Operation failed'),
        options.category,
        execute
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, [operation, options.maxAttempts, options.baseDelay, options.category, captureError]);

  return {
    execute,
    loading
  };
}