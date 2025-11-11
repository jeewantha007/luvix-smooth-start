import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Check if already authenticated, redirect to dashboard
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate('/admin-dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Compare input values with environment variables
    // Note: In Vite, use import.meta.env.VITE_* for environment variables
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (email === adminEmail && password === adminPassword) {
      // Store authentication state
      localStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin-dashboard', { replace: true });
    } else {
      console.log('Invalid email or password');
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-lg shadow-2xl p-8 border border-zinc-800">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Admin Login
          </h1>
          <p className="text-zinc-400 text-center mb-8">
            Enter your credentials to access the admin panel
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15873f] focus:border-transparent transition"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15873f] focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#15873f] hover:bg-[#127334] text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
