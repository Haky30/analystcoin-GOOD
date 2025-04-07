import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { decryptApiKeys } from '../utils/crypto';
import { binanceAPI } from '../lib/binance';

interface Portfolio {
  totalValue: number;
  dailyChange: number;
  assets: Array<{
    symbol: string;
    amount: number;
    value: number;
  }>;
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get Binance API keys
        const binanceDoc = await getDoc(doc(db, 'users', user.uid, 'exchanges', 'binance'));
        
        if (!binanceDoc.exists()) {
          setPortfolio(null);
          return;
        }

        const { apiKey: encryptedApiKey, secretKey: encryptedSecretKey } = binanceDoc.data();
        const { apiKey, secretKey } = decryptApiKeys(encryptedApiKey, encryptedSecretKey);

        // Initialize Binance client with decrypted keys
        // Fetch account information and calculate portfolio value
        const accountInfo = await binanceAPI.getAccountInfo(apiKey, secretKey);
        
        // Transform account data into portfolio format
        const portfolio = transformAccountToPortfolio(accountInfo);
        setPortfolio(portfolio);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [user]);

  return { portfolio, loading, error };
}

function transformAccountToPortfolio(accountInfo: any): Portfolio {
  // Transform Binance account data into our Portfolio format
  // This is a placeholder implementation
  return {
    totalValue: 0,
    dailyChange: 0,
    assets: []
  };
}