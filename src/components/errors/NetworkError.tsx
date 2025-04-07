import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface NetworkErrorProps {
  message: string;
  onRetry?: () => void;
}

export function NetworkError({ message, onRetry }: NetworkErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <WifiOff className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-red-700">Network Error</h3>
      </div>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}