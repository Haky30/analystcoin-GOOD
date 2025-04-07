import { BINANCE_CONFIG } from './config';
import { tickerSchema, klineSchema, type Ticker, type Kline } from './types';
import { z } from 'zod';

class BinanceAPI {
  private async fetch<T>(endpoint: string, schema: z.ZodType<T>): Promise<T> {
    const response = await fetch(`${BINANCE_CONFIG.BASE_URL}${endpoint}`, {
      headers: {
        'X-MBX-APIKEY': BINANCE_CONFIG.API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.statusText}`);
    }

    const data = await response.json();
    return schema.parse(data);
  }

  async getTicker(symbol: string): Promise<Ticker> {
    return this.fetch(`/ticker/24hr?symbol=${symbol}`, tickerSchema);
  }

  async getKlines(symbol: string, interval: string, limit: number): Promise<Kline[]> {
    const response = await fetch(
      `${BINANCE_CONFIG.BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((kline: any[]) => ({
      openTime: kline[0],
      open: kline[1],
      high: kline[2],
      low: kline[3],
      close: kline[4],
      volume: kline[5],
      closeTime: kline[6]
    }));
  }

  async getTopCryptos(limit: number = 10): Promise<Ticker[]> {
    const response = await fetch(`${BINANCE_CONFIG.BASE_URL}/ticker/24hr`);
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data
      .filter((ticker: any) => ticker.symbol.endsWith('USDT'))
      .sort((a: any, b: any) => parseFloat(b.volume) - parseFloat(a.volume))
      .slice(0, limit)
      .map((ticker: any) => tickerSchema.parse(ticker));
  }
}

export const binanceAPI = new BinanceAPI();