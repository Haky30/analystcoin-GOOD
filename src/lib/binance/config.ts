export const BINANCE_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  WS_URL: 'wss://stream.binance.com:9443/ws'
} as const;