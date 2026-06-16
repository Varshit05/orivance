import React, { useState } from 'react';
import { Lock, User, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, username: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminLogin({ onLoginSuccess, showToast }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('Please enter both username and password.', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Login successful. Welcome admin!', 'success');
        onLoginSuccess(data.token, data.admin.username);
      } else {
        showToast(data.message || 'Login failed. Invalid credentials.', 'error');
      }
    } catch (error) {
      showToast('Error connecting to authentication server', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b1a2e] px-4 py-12 overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-2xl rounded-2xl p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-blue-400 mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">OriVance Secure Gateway</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Please authenticate to access the administration portal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-slate-300">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white py-2.5 text-sm font-semibold tracking-wide shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              'Secure Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
