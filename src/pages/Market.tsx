import React, { memo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useCachedBinanceData } from '../hooks/useCachedBinanceData';
import { cryptoNames } from '../lib/constants';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Memoized chart component to prevent unnecessary re-renders
const PriceChart = memo(({ data, options }: { data: any; options: any }) => (
  <Line options={options} data={data} />
));

PriceChart.displayName = 'PriceChart';

export default function Market() {
  const [selectedSymbol, setSelectedSymbol] = React.useState('BTCUSDT');
  const { marketData, topPerformers, loading, error } = useCachedBinanceData(selectedSymbol);

  const priceChartOptions = React.useMemo(() => ({
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedSymbol} Price Chart`,
        color: 'white'
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    }
  }), [selectedSymbol]);

  const priceChartData = React.useMemo(() => {
    if (!marketData) return null;

    return {
      labels: marketData.prices.map(item => new Date(item[0]).toLocaleDateString()),
      datasets: [
        {
          label: 'Price',
          data: marketData.prices.map(item => item[1]),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  }, [marketData]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Market Analysis</h1>
      
      <div className="mb-8">
        <div className="bg-[#1a1f2e] rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Price Chart</h2>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-[#212838] text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              {Object.entries(cryptoNames).map(([symbol, name]) => (
                <option key={symbol} value={symbol}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <span className="text-gray-400">Loading chart data...</span>
            </div>
          ) : error ? (
            <div className="h-64 flex items-center justify-center">
              <span className="text-red-400">{error.message}</span>
            </div>
          ) : priceChartData ? (
            <PriceChart data={priceChartData} options={priceChartOptions} />
          ) : null}
        </div>
      </div>

      {marketData && (
        <div className="mb-8">
          <div className="bg-[#1a1f2e] rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Technical Indicators for {selectedSymbol}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#212838] p-4 rounded-lg">
                <div className="text-gray-400 text-sm">RSI (14)</div>
                <div className="text-white text-lg font-semibold">
                  {marketData.indicators.rsi.toFixed(2)}
                </div>
              </div>
              <div className="bg-[#212838] p-4 rounded-lg">
                <div className="text-gray-400 text-sm">MACD</div>
                <div className={`text-${marketData.indicators.macd >= 0 ? 'green' : 'red'}-500 text-lg font-semibold`}>
                  {marketData.indicators.macd >= 0 ? '+' : ''}{marketData.indicators.macd.toFixed(4)}
                </div>
              </div>
              <div className="bg-[#212838] p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Volume 24h</div>
                <div className="text-white text-lg font-semibold">
                  ${(marketData.indicators.volume24h / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="bg-[#212838] p-4 rounded-lg">
                <div className="text-gray-400 text-sm">MA (20)</div>
                <div className="text-white text-lg font-semibold">
                  ${marketData.indicators.ma20.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1a1f2e] rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Top Performers (24h)</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading market data...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error.message}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#151a27]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Name</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Change 24h</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">High 24h</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Low 24h</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {topPerformers?.map((coin) => (
                  <tr key={coin.symbol} className="hover:bg-[#212838] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{cryptoNames[coin.symbol] || coin.symbol}</div>
                      <div className="text-sm text-gray-400">{coin.symbol}</div>
                    </td>
                    <td className={`px-6 py-4 text-right ${
                      parseFloat(coin.priceChangePercent) >= 0 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {parseFloat(coin.priceChangePercent).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-right text-white">
                      ${parseFloat(coin.price).toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">
                      ${parseFloat(coin.highPrice || '0').toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">
                      ${parseFloat(coin.lowPrice || '0').toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}