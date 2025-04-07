import React, { createContext, useContext, useState, useEffect } from 'react';
import { binanceService } from '../services/binanceService';
import type { Ticker, Kline } from '../lib/binance/types';

interface MarketDataContextType {
  topPerformers: Ticker[];
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  marketData: {
    prices: number[][];
    volumes: number[][];
  } | null;
  loading: boolean;
  error: string | null;
  indicators: {
    rsi: number;
    macd: number;
    volume24h: number;
    ma20: number;
  };
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [topPerformers, setTopPerformers] = useState<Ticker[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSDT');
  const [marketData, setMarketData] = useState<{
    prices: number[][];
    volumes: number[][];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indicators, setIndicators] = useState({
    rsi: 0,
    macd: 0,
    volume24h: 0,
    ma20: 0
  });

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const [klineData, stats] = await Promise.all([
          binanceService.getKlines(selectedSymbol, '1d', 30),
          binanceService.get24hrStats()
        ]);

        setMarketData({
          prices: klineData.map((item: any) => [item[0], parseFloat(item[4])]),
          volumes: klineData.map((item: any) => [item[0], parseFloat(item[5])])
        });

        const sorted = stats
          .sort((a: Ticker, b: Ticker) => 
            parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
          )
          .slice(0, 10);
        
        setTopPerformers(sorted);
        
        // Mise à jour des indicateurs (à implémenter plus tard)
        setIndicators({
          rsi: 0,
          macd: 0,
          volume24h: parseFloat(stats[0]?.volume || '0'),
          ma20: 0
        });

      } catch (err) {
        setError('Failed to fetch market data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const value = {
    topPerformers,
    selectedSymbol,
    setSelectedSymbol,
    marketData,
    loading,
    error,
    indicators
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
}