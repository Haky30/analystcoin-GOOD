import React from 'react';

interface PortfolioProps {
  balances: Array<{
    asset: string;
    free: string;
    locked: string;
  }>;
}

export function Portfolio({ balances }: PortfolioProps) {
  if (!balances || balances.length === 0) {
    return (
      <div className="bg-[#1a1f2e] p-6 rounded-lg">
        <h2 className="text-xl mb-4">Portfolio</h2>
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f2e] p-6 rounded-lg">
      <h2 className="text-xl mb-4">Portfolio</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left pb-4">Asset</th>
              <th className="text-right pb-4">Free</th>
              <th className="text-right pb-4">Locked</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((balance) => (
              <tr key={balance.asset}>
                <td className="py-2">{balance.asset}</td>
                <td className="text-right py-2">{balance.free}</td>
                <td className="text-right py-2">{balance.locked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 