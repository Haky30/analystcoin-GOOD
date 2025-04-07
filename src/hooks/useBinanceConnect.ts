import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { encryptApiKeys } from '../utils/crypto';
import { binanceService } from '../services/binanceService';
import { useError } from '../contexts/ErrorContext';
import { toast } from 'react-hot-toast';

export function useBinanceConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();
  const { captureError } = useError();

  const connectToBinance = async (apiKey: string, secretKey: string) => {
    if (!user) {
      captureError('Please login first', 'auth');
      return;
    }

    setIsConnecting(true);

    try {
      // Test the connection first
      binanceService.setCredentials({ apiKey, secretKey });
      const isValid = await binanceService.testConnection();

      if (!isValid) {
        throw new Error('Invalid API keys');
      }

      // Generate a random salt and IV for encryption
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const salt = crypto.getRandomValues(new Uint8Array(16));

      // Encrypt the API keys
      const encryptedKeys = encryptApiKeys(apiKey, secretKey, iv, salt);

      // Store encrypted keys in Firestore
      await setDoc(doc(db, 'users', user.uid, 'exchanges', 'binance'), {
        apiKey: encryptedKeys.apiKey,
        secretKey: encryptedKeys.secretKey,
        iv: Array.from(iv),
        salt: Array.from(salt),
        connected: true,
        connectedAt: new Date().toISOString()
      });

      toast.success('Successfully connected to Binance!');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to connect to Binance');
      captureError(error, 'api');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    connectToBinance,
    isConnecting
  };
}