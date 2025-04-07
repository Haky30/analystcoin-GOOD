import { useState, useEffect } from 'react';
import { binanceAPI, BinanceWebSocket, type Ticker, type Kline } from '../lib/binance';

interface UseBinanceDataProps {
  symbol: string;
  interval?: string;
  limit?: number;
}

interface BinanceData {
  ticker: Ticker | null;
  klines: Kline[];
  loading: boolean;
  error: string | null;
}

export function useBinanceData({ 
  symbol, 
  interval = '1d',
  limit = 30 
}: UseBinanceDataProps): BinanceData {
  const [data, setData] = useState<BinanceData>({
    ticker: null,
    klines: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;
    let ws: BinanceWebSocket | null = null;

    const fetchData = async () => {
      try {
        const [ticker, klines] = await Promise.all([
          binanceAPI.getTicker(symbol),
          binanceAPI.getKlines(symbol, interval, limit)
        ]);

        if (mounted) {
          setData({
            ticker,
            klines,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        if (mounted) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch data'
          }));
        }
      }
    };

    fetchData();
    
    // Set up WebSocket connection for real-time updates
    ws = new BinanceWebSocket(symbol, (ticker) => {
      if (mounted) {
        setData(prev => ({ ...prev, ticker }));
      }
    });
    
    ws.connect();

    return () => {
      mounted = false;
      if (ws) {
        ws.disconnect();
      }
    };
  }, [symbol, interval, limit]);

  return data;
}