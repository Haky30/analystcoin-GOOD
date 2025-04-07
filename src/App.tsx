import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import Market from './pages/Market';
import { Investments } from './pages/Investments';
import { Login } from './pages/Login';
import { Subscribe } from './pages/Subscribe';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { MarketDataProvider } from './contexts/MarketDataContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorDisplay } from './components/errors/ErrorDisplay';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <AuthProvider>
          <MarketDataProvider>
            <PortfolioProvider>
              <Router>
                <div className="min-h-screen bg-gray-50">
                  <Header />
                  <ErrorDisplay />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/market" element={<Market />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/subscribe" element={<Subscribe />} />
                      <Route
                        path="/investments"
                        element={
                          <ProtectedRoute>
                            <Investments />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                </div>
              </Router>
            </PortfolioProvider>
          </MarketDataProvider>
        </AuthProvider>
      </ErrorProvider>
      <Toaster position="top-right" />
    </ErrorBoundary>
  );
}

export default App