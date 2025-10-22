import React, { useState } from 'react';
import { login, register } from '../services/authService';
import type { User } from '../types';
import { AiIcon } from '../constants';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let user: User;
      if (activeTab === 'login') {
        user = await login(email, password, rememberMe);
      } else {
        user = await register(email, password);
      }
      onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const TabButton: React.FC<{ tab: 'login' | 'register', label: string }> = ({ tab, label }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setError(null);
      }}
      className={`w-1/2 py-3 text-sm font-medium transition-colors ${
        activeTab === tab 
          ? 'text-cyan-400 border-b-2 border-cyan-400' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full max-w-sm bg-[#161B22] border border-gray-700 rounded-lg shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6">
            <div className="bg-cyan-500 p-3 rounded-lg mb-4">
                <AiIcon className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your AI Legal Assistant account.</p>
        </div>
        
        <div className="flex border-b border-gray-700 mb-6">
            <TabButton tab="login" label="Sign In" />
            <TabButton tab="register" label="Create Account" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#21262D] border border-gray-600 rounded-md p-2.5 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#21262D] border border-gray-600 rounded-md p-2.5 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          
          {activeTab === 'login' && (
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-500 bg-gray-700 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>
          )}

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 text-white py-2.5 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              activeTab === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
