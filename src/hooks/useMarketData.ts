import { useState, useEffect } from 'react';

interface MarketData {
  date: string;
  price: number;
}

// This would be replaced with real API calls in production
export function useMarketData() {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulated API call
        const dummyData = [
          { date: '2024-01', price: 42000 },
          { date: '2024-02', price: 45000 },
          { date: '2024-03', price: 48000 },
          { date: '2024-04', price: 43000 },
          { date: '2024-05', price: 47000 },
        ];
        setData(dummyData);
      } catch (err) {
        setError('Failed to fetch market data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}