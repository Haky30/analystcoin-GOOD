import React from 'react';
import { Lock, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface AuthenticationErrorProps {
  message: string;
}

export function AuthenticationError({ message }: AuthenticationErrorProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <Lock className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-yellow-700">Authentication Required</h3>
      </div>
      <p className="text-yellow-600 mb-4">{message}</p>
      <Button
        onClick={() => navigate('/login')}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
    </div>
  );
}