import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card } from '../ui/Card';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Asset {
  asset: string;
  value: number;
}

interface AssetChartProps {
  assets: Asset[];
  loading: boolean;
}

export function AssetChart({ assets, loading }: AssetChartProps) {
  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  const data = {
    labels: assets.map(a => a.asset),
    datasets: [
      {
        data: assets.map(a => a.value),
        backgroundColor: [
          '#3B82F6', // blue-500
          '#10B981', // emerald-500
          '#6366F1', // indigo-500
          '#F59E0B', // amber-500
          '#EC4899', // pink-500
          '#8B5CF6', // violet-500
          '#14B8A6', // teal-500
          '#F97316', // orange-500
          '#06B6D4', // cyan-500
          '#EF4444', // red-500
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Portfolio Distribution',
      },
    },
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </Card>
  );
}