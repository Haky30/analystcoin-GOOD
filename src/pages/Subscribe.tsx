import React from 'react';
import { Check } from 'lucide-react';

export function Subscribe() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Premium Analysis Access</h1>
          <p className="text-xl text-gray-600">
            Get access to AI-powered investment recommendations and advanced market analysis
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center mb-8">Premium Plan</h2>
            <div className="text-center mb-8">
              <span className="text-4xl font-bold">€15</span>
              <span className="text-gray-600">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'AI-Powered Investment Recommendations',
                'Real-time Market Analysis',
                'Risk Management Tools',
                'Portfolio Tracking',
                'Priority Support'
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
              onClick={() => alert('Subscription functionality coming soon!')}
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}