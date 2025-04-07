import axios from 'axios';
import CryptoJS from 'crypto-js';

interface Balance {
  asset: string;
  free: string;
  locked: string;
}

export class BinanceService {
  private userApiKey: string | null = null;
  private userSecretKey: string | null = null;
  
  // Utilisation des variables d'environnement
  private readonly PUBLIC_API_KEY = import.meta.env.VITE_BINANCE_PUBLIC_API_KEY;
  private readonly PUBLIC_SECRET_KEY = import.meta.env.VITE_BINANCE_PUBLIC_SECRET_KEY;

  async get24hrStats() {
    try {
      // Pour les données publiques, pas besoin de signature
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Filtrer uniquement les paires USDT
      return data.filter((item: any) => item.symbol.endsWith('USDT'));
    } catch (error) {
      console.error('Error fetching 24hr stats:', error);
      throw error;
    }
  }

  async getAccountInfo() {
    // Données privées - nécessite une connexion utilisateur
    if (!this.userApiKey || !this.userSecretKey) {
      throw new Error('User API credentials not set');
    }
    return await this.makeRequest('/api/v3/account');
  }

  setUserCredentials(credentials: { apiKey: string; secretKey: string }) {
    this.userApiKey = credentials.apiKey;
    this.userSecretKey = credentials.secretKey;
  }

  private async makeRequest(path: string) {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}&recvWindow=5000`;
    const signature = this.generateSignature(queryString);

    const url = `${this.baseUrl}${path}?${queryString}&signature=${signature}`;
    
    try {
      const response = await axios({
        method: 'GET',
        url,
        headers: {
          'X-MBX-APIKEY': this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Request error:', {
        path,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  private generateSignature(queryString: string): string {
    return CryptoJS.HmacSHA256(queryString, this.secretKey).toString();
  }

  async getKlines(symbol: string, interval: string, limit: number) {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching klines:', error);
      throw error;
    }
  }
}

export const binanceService = new BinanceService();