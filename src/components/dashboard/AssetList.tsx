import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../ui/Card';

interface Asset {
  asset: string;
  free: string;
  locked: string;
  value: number;
  change24h: number;
}

interface AssetListProps {
  assets: Asset[];
  loading: boolean;
}

export function AssetList({ assets, loading }: AssetListProps) {
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

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Your Assets</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Asset</th>
              <th className="text-right py-3">Balance</th>
              <th className="text-right py-3">Value (USDT)</th>
              <th className="text-right py-3">24h Change</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.asset} className="border-b">
                <td className="py-3">{asset.asset}</td>
                <td className="text-right py-3">
                  {parseFloat(asset.free).toFixed(8)}
                  {asset.locked !== '0' && (
                    <span className="text-gray-500 text-sm">
                      {' '}(+{asset.locked} locked)
                    </span>
                  )}
                </td>
                <td className="text-right py-3">
                  ${asset.value.toLocaleString()}
                </td>
                <td className={`text-right py-3 flex items-center justify-end ${
                  asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {asset.change24h >= 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(asset.change24h).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}