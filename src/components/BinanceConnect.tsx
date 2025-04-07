import React, { useState } from 'react';
import { Key, Lock } from 'lucide-react';

interface BinanceConnectProps {
  onConnect: (apiKey: string, secretKey: string) => void;
}

export function BinanceConnect({ onConnect }: BinanceConnectProps) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(apiKey, secretKey);
  };

  return (
    <div className="bg-gray-800/50 p-8 rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Connectez votre compte Binance</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Clé API
            </div>
          </label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
            placeholder="Votre clé API Binance"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Clé Secrète
            </div>
          </label>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
            placeholder="Votre clé secrète Binance"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors"
        >
          Connecter mon compte
        </button>
      </form>
      <p className="text-sm text-gray-400 mt-4 text-center">
        Vos clés API sont stockées de manière sécurisée et ne sont utilisées que pour accéder à vos données Binance.
      </p>
    </div>
  );
} 