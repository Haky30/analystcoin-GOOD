import React, { useState, useEffect } from 'react';
import { Activity, Bell, Wallet } from 'lucide-react';
import { BinanceConnect } from './components/BinanceConnect';
import { Portfolio } from './Portfolio';
import { binanceService } from '../services/binanceService';
import { toast } from 'react-hot-toast';

interface Balance {
  asset: string;
  free: string;
  locked: string;
}

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAccountData = async () => {
    try {
      setLoading(true);
      setError(null);
      const accountBalances = await binanceService.getAccountInfo();
      console.log('Données reçues de Binance:', accountBalances);
      setBalances(accountBalances || []);
    } catch (error) {
      console.error('Error loading account data:', error);
      setError('Failed to load account data');
      setBalances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBinanceConnect = async (credentials: { apiKey: string; secretKey: string }) => {
    try {
      binanceService.setCredentials(credentials);
      const connected = await binanceService.testConnection();
      
      if (connected) {
        setIsConnected(true);
        await loadAccountData();
      } else {
        setError('Connection test failed');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setError('Failed to connect to Binance');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected) {
      interval = setInterval(loadAccountData, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConnected]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {!isConnected ? (
        <BinanceConnect onConnect={handleBinanceConnect} />
      ) : (
        <div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Portfolio balances={balances} />
        </div>
      )}
    </div>
  );
} 