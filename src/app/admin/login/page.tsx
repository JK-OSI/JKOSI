'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('jkosi-admin-token', data.token);
      router.push('/admin/submissions');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-[448px] bg-surface-container border border-outline/50 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="font-headline-xl text-2xl font-black text-on-surface">JKOSI Admin</h1>
          <p className="text-on-surface-variant text-sm mt-2">Sign in to manage submissions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-outline/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="admin@jkosi.org"
              required
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-outline/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-mono">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 font-mono text-xs uppercase tracking-widest"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
