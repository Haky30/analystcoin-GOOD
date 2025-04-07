import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { binanceService } from '../services/binanceService';
import { useAuth } from './AuthContext';
import { decryptApiKeys } from '../utils/crypto';

interface Balance {
  asset: string;
  free: string;
  locked: string;
}

interface PortfolioContextType {
  assets: Balance[];
  totalValue: {
    usdt: string;
    btc: string;
  };
  loading: boolean;
  error: string | null;
  refreshPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Balance[]>([]);
  const [totalValue, setTotalValue] = useState({ usdt: '0', btc: '0' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPortfolio = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get Binance API keys and encryption data
      const binanceDoc = await getDoc(doc(db, 'users', user.uid, 'exchanges', 'binance'));
      
      if (!binanceDoc.exists()) {
        setAssets([]);
        setTotalValue({ usdt: '0', btc: '0' });
        return;
      }

      const { 
        apiKey: encryptedApiKey, 
        secretKey: encryptedSecretKey, 
        iv, 
        salt 
      } = binanceDoc.data();

      // Decrypt the API keys using the stored salt and IV
      const { apiKey, secretKey } = decryptApiKeys(
        encryptedApiKey, 
        encryptedSecretKey, 
        iv, 
        salt
      );

      // Set the credentials in the binanceService
      binanceService.setCredentials({ apiKey, secretKey });

      // Fetch account information
      const accountInfo = await binanceService.getAccountInfo();
      
      setAssets(accountInfo.balances);
      setTotalValue({
        usdt: accountInfo.totalUSDTValue || '0',
        btc: accountInfo.totalBTCValue || '0'
      });
    } catch (err) {
      console.error('Portfolio loading error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load portfolio data');
      setAssets([]);
      setTotalValue({ usdt: '0', btc: '0' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshPortfolio();
      const interval = setInterval(refreshPortfolio, 30000);
      return () => clearInterval(interval);
    } else {
      setAssets([]);
      setTotalValue({ usdt: '0', btc: '0' });
    }
  }, [user]);

  const value = {
    assets,
    totalValue,
    loading,
    error,
    refreshPortfolio
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}