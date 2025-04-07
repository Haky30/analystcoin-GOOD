import React from 'react';
import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">AnalystCoin</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/market" className="hover:text-blue-400">Market Analysis</Link>
            <Link to="/investments" className="hover:text-blue-400">Investment Recommendations</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
                <button
                  onClick={signOut}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-400"
                >
                  Login
                </Link>
                <Link
                  to="/subscribe"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Subscribe
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}