import { z } from 'zod';

export const analysisSchema = z.object({
  score: z.number(),
  recommendations: z.array(z.object({
    title: z.string(),
    description: z.string(),
    action: z.string().optional()
  })),
  insights: z.array(z.string()),
  warnings: z.array(z.string()).optional()
});

export type Analysis = z.infer<typeof analysisSchema>;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIAnalysisRequest {
  portfolioData: {
    assets: Array<{
      symbol: string;
      free: number;
      locked: number;
    }>;
    totalValue: {
      usdt: number;
      btc: number;
    };
  };
  marketContext?: {
    topPerformers?: any[];
    currentTrends?: any;
    timestamp: string;
  };
  analysisType: 'full' | 'risk' | 'opportunity';
  timeframe?: 'short' | 'medium' | 'long';
}