import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Ticker } from '../../lib/binance';

interface CryptoTableProps {
  data: Ticker[];
  loading: boolean;
  error: string | null;
}

export function CryptoTable({ data, loading, error }: CryptoTableProps) {
  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-red-500">{error}</div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="text-gray-500">No data available</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">Symbol</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">24h Change</th>
              <th className="px-4 py-3 text-right">Volume</th>
            </tr>
          </thead>
          <tbody>
            {data.map((ticker) => (
              <tr key={ticker.symbol} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{ticker.symbol}</td>
                <td className="px-4 py-3 text-right">
                  ${parseFloat(ticker.price).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className={`flex items-center justify-end ${
                    parseFloat(ticker.priceChangePercent) >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {parseFloat(ticker.priceChangePercent) >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(parseFloat(ticker.priceChangePercent)).toFixed(2)}%
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  ${(parseFloat(ticker.volume) * parseFloat(ticker.price)).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}