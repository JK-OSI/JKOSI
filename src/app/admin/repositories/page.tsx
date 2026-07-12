'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Repo {
  id: string;
  name: string;
  url: string;
  description: string | null;
  category: string;
  stars: number;
  owner: { id: string; githubUsername: string } | null;
  tags: { tag: string }[];
  createdAt: string;
}

export default function AdminRepositories() {
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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

    fetchRepos(token);
  }, [router]);

  function fetchRepos(token: string) {
    fetch('/api/repositories?limit=100', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRepos(data.docs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  async function deleteRepo(id: string) {
    const token = localStorage.getItem('jkosi-admin-token');
    try {
      const res = await fetch(`/api/repositories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRepos((prev) => prev.filter((r) => r.id !== id));
        setConfirmDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  }

  function handleLogout() {
    localStorage.removeItem('jkosi-admin-token');
    router.push('/admin/login');
  }

  function activePage() {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
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
              {['Submissions', 'Repositories', 'Subscribers'].map((page) => (
                <a
                  key={page}
                  href={`/admin/${page.toLowerCase()}`}
                  className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${
                    activePage().includes(page.toLowerCase())
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {page}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-on-surface-variant font-mono">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-primary hover:underline font-mono"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">
            Repositories ({repos.length})
          </h2>
        </div>

        {repos.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <p className="font-mono">No repositories yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-surface-container border border-outline/50 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-headline-md text-lg font-bold text-on-surface">
                      {repo.name}
                    </h3>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary text-sm hover:underline font-mono"
                    >
                      {repo.url}
                    </a>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs uppercase tracking-wider">
                    {repo.category}
                  </span>
                </div>

                {repo.description && (
                  <p className="text-on-surface-variant text-sm mb-3 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-on-surface-variant font-mono border-t border-outline/30 pt-4">
                  <span>
                    👤 {repo.owner?.githubUsername || 'Unknown'}
                  </span>
                  <span>⭐ {repo.stars}</span>
                  <span className="text-xs opacity-50">
                    {new Date(repo.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-outline/30">
                  {confirmDelete === repo.id ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-red-500 font-mono">
                        Delete this repository?
                      </span>
                      <button
                        onClick={() => deleteRepo(repo.id)}
                        className="px-4 py-1.5 bg-red-500 text-white font-bold rounded-lg text-sm hover:opacity-90 transition-opacity font-mono text-xs uppercase tracking-wider"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-4 py-1.5 bg-surface border border-outline text-on-surface rounded-lg text-sm hover:bg-surface-container transition-colors font-mono text-xs uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(repo.id)}
                      className="px-4 py-1.5 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/20 transition-colors font-mono text-xs uppercase tracking-wider"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
