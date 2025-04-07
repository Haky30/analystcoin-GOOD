import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend
}: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">{title}</h2>
        <Icon className="text-blue-500 w-6 h-6" />
      </CardHeader>
      <p className="text-3xl font-bold">{value}</p>
      {trend && (
        <p className={`text-sm ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.value}
        </p>
      )}
      {subtitle && (
        <p className="text-sm text-gray-500">{subtitle}</p>
      )}
    </Card>
  );
}