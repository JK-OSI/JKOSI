'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Submission {
  id: string;
  projectName: string;
  repoUrl: string;
  description: string;
  status: string;
  fullName: string;
  email: string;
  githubUsername: string;
  bio: string;
  techStack: { tech: string }[];
  createdAt: string;
}

export default function AdminSubmissions() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
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

    fetchSubmissions(token);
  }, [router]);

  function fetchSubmissions(token: string) {
    fetch('/api/submissions', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSubmissions(data.docs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  async function updateStatus(id: string, status: string) {
    const token = localStorage.getItem('jkosi-admin-token');
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status } : s))
        );
      }
    } catch (err) {
      console.error('Failed to update:', err);
    }
  }

  function handleLogout() {
    localStorage.removeItem('jkosi-admin-token');
    router.push('/admin/login');
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
                    item.name === 'Submissions'
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
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">Submissions</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 font-mono text-xs">
              Pending: {submissions.filter((s) => s.status === 'pending').length}
            </span>
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 font-mono text-xs">
              Approved: {submissions.filter((s) => s.status === 'approved').length}
            </span>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <p className="font-mono">No submissions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-surface-container border border-outline/50 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-headline-md text-lg font-bold text-on-surface">
                      {sub.projectName}
                    </h3>
                    <a
                      href={sub.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary text-sm hover:underline font-mono"
                    >
                      {sub.repoUrl}
                    </a>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider ${
                      sub.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : sub.status === 'approved'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
                  {sub.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {sub.techStack?.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-surface-container-high border border-outline/30 text-on-surface-variant font-mono text-[10px] rounded"
                    >
                      {t.tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-on-surface-variant font-mono border-t border-outline/30 pt-4">
                  <span>👤 {sub.fullName || sub.githubUsername || 'Unknown'}</span>
                  {sub.email && <span>✉ {sub.email}</span>}
                  <span className="text-xs opacity-50">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-outline/30">
                  <Link
                    href={`/admin/submissions/${sub.id}`}
                    className="px-5 py-2 bg-surface border border-outline text-on-surface rounded-xl text-sm hover:bg-surface-container transition-colors font-mono text-xs uppercase tracking-wider"
                  >
                    Details
                  </Link>
                  {sub.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(sub.id, 'approved')}
                        className="px-5 py-2 bg-primary text-on-primary font-bold rounded-xl text-sm hover:opacity-90 transition-opacity font-mono text-xs uppercase tracking-wider"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(sub.id, 'rejected')}
                        className="px-5 py-2 bg-surface border border-outline text-on-surface rounded-xl text-sm hover:bg-surface-container transition-colors font-mono text-xs uppercase tracking-wider"
                      >
                        Reject
                      </button>
                    </>
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
