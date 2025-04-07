import React, { useState } from 'react';
import { X, Key, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface BinanceApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string, secretKey: string) => Promise<void>;
}

export function BinanceApiKeyModal({ isOpen, onClose, onSubmit }: BinanceApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(apiKey, secretKey);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Binance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Connect Binance Account</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Connection Error</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="API Key"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              icon={<Key className="w-4 h-4 text-gray-500" />}
              required
              placeholder="Enter your Binance API key"
            />

            <Input
              label="Secret Key"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              icon={<Lock className="w-4 h-4 text-gray-500" />}
              required
              placeholder="Enter your Binance secret key"
            />
          </div>

          <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
            <p>Your API keys are encrypted and stored securely. They are only used to:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>Access your Binance account data</li>
              <li>Monitor your portfolio</li>
              <li>Track your investments</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !apiKey || !secretKey}
              className="min-w-[100px]"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}