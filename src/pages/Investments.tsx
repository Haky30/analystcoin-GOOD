import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export function Investments() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Investment Recommendations</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Buy Signals</h2>
            <TrendingUp className="text-green-500 w-6 h-6" />
          </div>
          <ul className="space-y-4">
            <li className="border-b pb-2">
              <div className="font-medium">Bitcoin (BTC)</div>
              <div className="text-sm text-gray-600">Strong buy signal at $45,000</div>
            </li>
            <li className="border-b pb-2">
              <div className="font-medium">Ethereum (ETH)</div>
              <div className="text-sm text-gray-600">Accumulate below $2,800</div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Risk Alerts</h2>
            <AlertTriangle className="text-yellow-500 w-6 h-6" />
          </div>
          <ul className="space-y-4">
            <li className="border-b pb-2">
              <div className="font-medium">Portfolio Exposure</div>
              <div className="text-sm text-gray-600">Current risk level: Moderate</div>
            </li>
            <li className="border-b pb-2">
              <div className="font-medium">Market Volatility</div>
              <div className="text-sm text-gray-600">Increased volatility expected</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}