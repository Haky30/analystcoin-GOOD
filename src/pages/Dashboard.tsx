import React from 'react';
import { Activity, Bell, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { AssetList } from '../components/dashboard/AssetList';
import { AssetChart } from '../components/dashboard/AssetChart';
import { Card } from '../components/ui/Card';
import { ConnectBinanceButton } from '../components/binance/ConnectBinanceButton';

export function Dashboard() {
  const { assets, totalValue, loading, error, refreshPortfolio } = usePortfolio();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
          <ConnectBinanceButton />
        </div>
      </div>
    );
  }

  if (!assets.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Connect Your Portfolio</h2>
            <p className="text-gray-600 mb-6">
              Connect your Binance account to view your portfolio and get personalized recommendations.
            </p>
            <ConnectBinanceButton />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Portfolio Value Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Total Value (USDT)</h2>
                <Wallet className="text-blue-500 w-6 h-6" />
              </div>
              <div className="text-3xl font-bold">${totalValue.usdt}</div>
              <div className="mt-2 text-sm text-green-500">+2.5% today</div>
            </div>
          </Card>

          <Card className="bg-gray-800/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Total Value (BTC)</h2>
                <Activity className="text-blue-500 w-6 h-6" />
              </div>
              <div className="text-3xl font-bold">₿{totalValue.btc}</div>
              <div className="mt-2 text-sm text-green-500">+1.8% today</div>
            </div>
          </Card>
        </div>

        {/* Asset Distribution */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <AssetChart assets={assets} loading={loading} />
          <Card className="bg-gray-800/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Performance</h2>
                <TrendingUp className="text-blue-500 w-6 h-6" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">1 Day</div>
                  <div className="text-lg font-semibold text-green-500">+2.5%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">1 Week</div>
                  <div className="text-lg font-semibold text-red-500">-1.2%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">1 Month</div>
                  <div className="text-lg font-semibold text-green-500">+15.7%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">1 Year</div>
                  <div className="text-lg font-semibold text-green-500">+142.3%</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Asset List */}
        <div className="mb-8">
          <AssetList assets={assets} loading={loading} />
        </div>

        {/* Active Alerts */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Active Alerts</h2>
                <Bell className="text-blue-500 w-6 h-6" />
              </div>
              <div className="text-3xl font-bold">3</div>
              <div className="text-gray-400 text-sm">Price targets nearby</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}