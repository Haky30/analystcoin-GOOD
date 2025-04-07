import { z } from 'zod';

export const tickerSchema = z.object({
  symbol: z.string(),
  price: z.string(),
  volume: z.string(),
  priceChangePercent: z.string()
});

export const klineSchema = z.object({
  openTime: z.number(),
  open: z.string(),
  high: z.string(),
  low: z.string(),
  close: z.string(),
  volume: z.string(),
  closeTime: z.number()
});

export type Ticker = z.infer<typeof tickerSchema>;
export type Kline = z.infer<typeof klineSchema>;