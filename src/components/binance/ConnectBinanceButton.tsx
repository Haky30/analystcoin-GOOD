import React, { useState } from 'react';
import { Link } from 'lucide-react';
import { Button } from '../ui/Button';
import { BinanceApiKeyModal } from './BinanceApiKeyModal';
import { useBinanceConnect } from '../../hooks/useBinanceConnect';

export function ConnectBinanceButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connectToBinance, isConnecting } = useBinanceConnect();

  const handleConnect = async (apiKey: string, secretKey: string) => {
    await connectToBinance(apiKey, secretKey);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        disabled={isConnecting}
        className="flex items-center gap-2"
      >
        <Link className="w-4 h-4" />
        Connect Binance Account
      </Button>

      <BinanceApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleConnect}
      />
    </>
  );
}