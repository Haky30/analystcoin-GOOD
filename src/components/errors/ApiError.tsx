import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface ApiErrorProps {
  message: string;
  onRetry?: () => void;
}

export function ApiError({ message, onRetry }: ApiErrorProps) {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-orange-700">API Error</h3>
      </div>
      <p className="text-orange-600 mb-4">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </Button>
      )}
    </div>
  );
}