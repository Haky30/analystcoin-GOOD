import { useState } from 'react';
import { analyzePortfolio } from '../lib/ai/api';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useMarketData } from '../contexts/MarketDataContext';
import type { Analysis } from '../lib/ai/types';

export function useAIAnalysis(analysisType: 'full' | 'risk' | 'opportunity' = 'full') {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { assets, totalValue } = usePortfolio();
  const { topPerformers, marketData } = useMarketData();
  
  const runAnalysis = async (timeframe: 'short' | 'medium' | 'long' = 'medium') => {
    try {
      setLoading(true);
      setError(null);
      
      const portfolioData = {
        assets: assets.map(asset => ({
          symbol: asset.asset,
          free: parseFloat(asset.free),
          locked: parseFloat(asset.locked)
        })),
        totalValue: {
          usdt: parseFloat(totalValue.usdt),
          btc: parseFloat(totalValue.btc)
        }
      };
      
      const marketContext = {
        topPerformers: topPerformers?.slice(0, 5),
        currentTrends: marketData || {},
        timestamp: new Date().toISOString()
      };
      
      const result = await analyzePortfolio({
        portfolioData,
        marketContext,
        analysisType,
        timeframe
      });
      
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze portfolio');
    } finally {
      setLoading(false);
    }
  };
  
  return { analysis, loading, error, runAnalysis };
}