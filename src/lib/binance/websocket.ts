import { BINANCE_CONFIG } from './config';
import type { Ticker } from './types';

export class BinanceWebSocket {
  private ws: WebSocket | null = null;

  constructor(
    private symbol: string,
    private onMessage: (ticker: Ticker) => void
  ) {}

  connect() {
    this.ws = new WebSocket(
      `${BINANCE_CONFIG.WS_URL}/${this.symbol.toLowerCase()}@ticker`
    );

    this.ws.onmessage = (event) => {
      const tickerData = JSON.parse(event.data);
      this.onMessage({
        symbol: tickerData.s,
        price: tickerData.c,
        volume: tickerData.v,
        priceChangePercent: tickerData.P
      });
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}