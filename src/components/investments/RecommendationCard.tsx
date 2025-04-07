import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';

interface Recommendation {
  coin: string;
  action: string;
  price: string;
  date: string;
}

interface RecommendationCardProps {
  title: string;
  recommendations: Recommendation[];
}

export function RecommendationCard({ title, recommendations }: RecommendationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <TrendingUp className="text-green-500 w-6 h-6" />
      </CardHeader>
      <ul className="space-y-4">
        {recommendations.map((rec, index) => (
          <li key={index} className="border-b pb-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{rec.coin}</div>
                <div className="text-sm text-gray-500">{rec.date}</div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${
                  rec.action === 'Buy' ? 'text-green-500' : 
                  rec.action === 'Sell' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {rec.action}
                </div>
                <div className="text-sm text-gray-500">{rec.price}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}