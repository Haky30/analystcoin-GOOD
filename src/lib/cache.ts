import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheEntry<any>>;
  private pendingRequests: Map<string, Promise<any>>;
  private config: CacheConfig;

  private constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.config = {
      ttl: 30000, // Default TTL: 30 seconds
    };
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  setConfig(config: Partial<CacheConfig>) {
    this.config = { ...this.config, ...config };
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.config.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key);
    if (cached) return cached;

    // Check if there's a pending request
    let pendingRequest = this.pendingRequests.get(key);
    if (pendingRequest) return pendingRequest;

    // Create new request
    pendingRequest = fetcher().then((data) => {
      this.set(key, data);
      this.pendingRequests.delete(key);
      return data;
    });

    this.pendingRequests.set(key, pendingRequest);
    return pendingRequest;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export const cache = Cache.getInstance();

export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  config?: {
    ttl?: number;
    refreshInterval?: number;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await cache.getOrFetch(key, fetcher, config?.ttl);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, config?.ttl]);

  useEffect(() => {
    fetchData();

    if (config?.refreshInterval) {
      const interval = setInterval(fetchData, config.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, config?.refreshInterval]);

  const refresh = useCallback(() => {
    cache.invalidate(key);
    return fetchData();
  }, [key, fetchData]);

  return { data, error, loading, refresh };
}