import React from 'react';
import { Wallet } from 'lucide-react';
import { Card } from '../ui/Card';
import { ConnectBinanceButton } from '../binance/ConnectBinanceButton';
import { usePortfolio } from '../../hooks/usePortfolio';

export function PortfolioSection() {
  const { portfolio, loading, error } = usePortfolio();

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Portfolio</h2>
          <Wallet className="text-blue-500 w-6 h-6" />
        </div>
        <p className="text-red-500 mb-4">{error}</p>
        <ConnectBinanceButton />
      </Card>
    );
  }

  if (!portfolio) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Connect Your Portfolio</h2>
          <Wallet className="text-blue-500 w-6 h-6" />
        </div>
        <p className="text-gray-600 mb-4">
          Connect your Binance account to view your portfolio and get personalized recommendations.
        </p>
        <ConnectBinanceButton />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Portfolio Value</h2>
        <Wallet className="text-blue-500 w-6 h-6" />
      </div>
      <p className="text-3xl font-bold">${portfolio.totalValue.toLocaleString()}</p>
      <p className={`text-sm ${portfolio.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {portfolio.dailyChange >= 0 ? '+' : ''}{portfolio.dailyChange}% today
      </p>
    </Card>
  );
}