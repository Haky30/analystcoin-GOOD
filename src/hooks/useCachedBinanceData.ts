import { useMemo } from 'react';
import { useCachedData } from '../lib/cache';
import { binanceService } from '../services/binanceService';
import type { Ticker, Kline } from '../lib/binance/types';

interface MarketData {
  prices: number[][];
  volumes: number[][];
  indicators: {
    rsi: number;
    macd: number;
    volume24h: number;
    ma20: number;
  };
}

export function useCachedBinanceData(symbol: string) {
  // Fetch market data with caching
  const { 
    data: marketData,
    error: marketError,
    loading: marketLoading,
    refresh: refreshMarket
  } = useCachedData<MarketData>(
    `market-${symbol}`,
    async () => {
      const [klineData, stats] = await Promise.all([
        binanceService.getKlines(symbol, '1d', 30),
        binanceService.get24hrStats(symbol)
      ]);

      const prices = klineData.map((item: any) => [item[0], parseFloat(item[4])]);
      const volumes = klineData.map((item: any) => [item[0], parseFloat(item[5])]);
      
      // Calculate indicators
      const lastPrices = prices.map(p => p[1]);
      const volume24h = parseFloat(stats.volume);

      return {
        prices,
        volumes,
        indicators: {
          rsi: calculateRSI(lastPrices),
          macd: calculateMACD(lastPrices),
          volume24h,
          ma20: calculateMA(lastPrices, 20)
        }
      };
    },
    {
      ttl: 30000, // 30 seconds
      refreshInterval: 30000 // Auto refresh every 30 seconds
    }
  );

  // Fetch top performers with caching
  const {
    data: topPerformers,
    error: topError,
    loading: topLoading,
    refresh: refreshTop
  } = useCachedData<Ticker[]>(
    'top-performers',
    async () => {
      const data = await binanceService.get24hrStats();
      return data
        .filter((ticker: Ticker) => ticker.symbol.endsWith('USDT'))
        .sort((a: Ticker, b: Ticker) => 
          parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
        )
        .slice(0, 10);
    },
    {
      ttl: 30000,
      refreshInterval: 30000
    }
  );

  const error = marketError || topError;
  const loading = marketLoading || topLoading;

  const refresh = () => {
    refreshMarket();
    refreshTop();
  };

  return {
    marketData,
    topPerformers,
    error,
    loading,
    refresh
  };
}

// Technical indicator calculations
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 0;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const difference = prices[i] - prices[i - 1];
    if (difference >= 0) {
      gains += difference;
    } else {
      losses -= difference;
    }
  }

  if (losses === 0) return 100;
  
  const rs = gains / losses;
  return 100 - (100 / (1 + rs));
}

function calculateMACD(prices: number[]): number {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  return ema12 - ema26;
}

function calculateMA(prices: number[], period: number): number {
  if (prices.length < period) return 0;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return 0;
  
  const k = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  
  return ema;
}