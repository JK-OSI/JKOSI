'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminSubscribers() {
  const router = useRouter();
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('jkosi-admin-token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('jkosi-admin-token');
        router.push('/admin/login');
      });

    fetchSubs(token);
  }, [router]);

  function fetchSubs(token: string) {
    fetch('/api/subscribers', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSubs(data.docs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  function handleLogout() {
    localStorage.removeItem('jkosi-admin-token');
    router.push('/admin/login');
  }

  function activePage() {
    if (typeof window !== 'undefined') return window.location.pathname;
    return '';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-on-surface-variant font-mono">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-outline/50 bg-surface-container px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-headline-md text-xl font-black text-on-surface">JKOSI Admin</h1>
            <nav className="flex gap-4">
              {[
                { name: 'Submissions', href: '/admin/submissions' },
                { name: 'Join Applications', href: '/admin/join-applications' },
                { name: 'Repositories', href: '/admin/repositories' },
                { name: 'Subscribers', href: '/admin/subscribers' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${
                    item.href === '/admin/subscribers'
                      ? 'bg-primary text-on-primary font-bold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-on-surface-variant font-mono">{user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-primary hover:underline font-mono">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">
            Subscribers ({subs.length})
          </h2>
        </div>

        {subs.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <p className="font-mono">No subscribers yet</p>
          </div>
        ) : (
          <div className="bg-surface-container border border-outline/50 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline/50 bg-surface-container-high">
                  <th className="px-6 py-4 font-mono text-xs uppercase tracking-wider text-on-surface-variant">Email</th>
                  <th className="px-6 py-4 font-mono text-xs uppercase tracking-wider text-on-surface-variant">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/30">
                {subs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-6 py-4 text-on-surface font-mono text-sm">{sub.email}</td>
                    <td className="px-6 py-4 text-on-surface-variant font-mono text-sm">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
