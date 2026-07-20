'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface JoinApplication {
  id: string;
  role: 'Volunteer' | 'Mentor';
  fullName: string;
  email: string;
  githubUsername?: string;
  skills?: string;
  bio?: string;
  location?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminJoinApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState<JoinApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);

  const [roleFilter, setRoleFilter] = useState<'All' | 'Volunteer' | 'Mentor'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'pending' | 'approved' | 'rejected'>('All');

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

    fetchApplications(token);
  }, [router]);

  function fetchApplications(token: string) {
    fetch('/api/join', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setApplications(data.docs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    const token = localStorage.getItem('jkosi-admin-token');
    try {
      const res = await fetch(`/api/join/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status } : app))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  async function deleteApplication(id: string) {
    if (!confirm('Are you sure you want to delete this application?')) return;
    const token = localStorage.getItem('jkosi-admin-token');
    try {
      const res = await fetch(`/api/join/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  }

  function handleLogout() {
    localStorage.removeItem('jkosi-admin-token');
    router.push('/admin/login');
  }

  const filteredApplications = applications.filter((app) => {
    if (roleFilter !== 'All' && app.role !== roleFilter) return false;
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const mentorCount = applications.filter((a) => a.role === 'Mentor').length;
  const volunteerCount = applications.filter((a) => a.role === 'Volunteer').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-on-surface-variant font-mono">Loading Join Applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header / Nav */}
      <header className="border-b border-outline/50 bg-surface-container px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-headline-md text-xl font-black text-on-surface">JKOSI Admin</h1>
            <nav className="flex gap-3">
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
                    item.href === '/admin/join-applications'
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-headline-md text-2xl font-bold text-on-surface">
              Mentors & Volunteers Applications
            </h2>
            <p className="text-sm text-on-surface-variant">
              Review and approve community members applying as mentors or volunteers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 font-mono text-xs font-bold">
              Pending: {pendingCount}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
              Mentors: {mentorCount}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-primary-fixed/20 text-primary font-mono text-xs font-bold">
              Volunteers: {volunteerCount}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 font-mono text-xs font-bold">
              Approved: {approvedCount}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-surface-container border border-outline/50 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase text-on-surface-variant">Role:</span>
            {(['All', 'Mentor', 'Volunteer'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors ${
                  roleFilter === r
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:ml-auto">
            <span className="font-mono text-xs uppercase text-on-surface-variant">Status:</span>
            {(['All', 'pending', 'approved', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg font-mono text-xs uppercase transition-colors ${
                  statusFilter === s
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* List of Applications */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-surface-container border border-outline/50 rounded-2xl text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 text-primary opacity-60">inbox</span>
            <p className="font-mono text-sm">No applications found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-surface-container border border-outline/50 rounded-2xl p-6 shadow-sm hover:border-outline transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-headline-md text-lg font-bold text-on-surface">
                        {app.fullName}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                          app.role === 'Mentor'
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-primary-fixed/20 text-primary border border-primary-fixed/30'
                        }`}
                      >
                        {app.role}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-mono text-on-surface-variant">
                      <span>✉ {app.email}</span>
                      {app.githubUsername && <span>🐙 @{app.githubUsername}</span>}
                      {app.location && <span>📍 {app.location}</span>}
                      <span>📅 {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider font-bold ${
                      app.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                        : app.status === 'approved'
                        ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                        : 'bg-red-500/10 text-red-500 border border-red-500/30'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Skills */}
                {app.skills && (
                  <div className="mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1">
                      Skills & Expertise:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.skills.split(',').map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 bg-surface border border-outline/30 text-primary font-mono text-xs rounded-lg"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {app.bio && (
                  <div className="mb-4 bg-surface/50 p-4 rounded-xl border border-outline/30">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1">
                      Applicant Bio:
                    </span>
                    <p className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap">
                      {app.bio}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-outline/30">
                  <div className="flex gap-3">
                    {app.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => updateStatus(app.id, 'approved')}
                          className="px-5 py-2 bg-primary text-on-primary font-bold rounded-xl text-xs uppercase font-mono tracking-wider hover:opacity-90 transition-opacity shadow-md shadow-primary/20 cursor-pointer"
                        >
                          Approve Application
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, 'rejected')}
                          className="px-5 py-2 bg-surface border border-outline/50 text-on-surface rounded-xl text-xs uppercase font-mono tracking-wider hover:bg-surface-container-high transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-mono text-on-surface-variant italic">
                        Status set to {app.status}. Click to change:
                        <button
                          onClick={() => updateStatus(app.id, app.status === 'approved' ? 'rejected' : 'approved')}
                          className="ml-2 underline text-primary cursor-pointer uppercase font-mono"
                        >
                          Switch to {app.status === 'approved' ? 'rejected' : 'approved'}
                        </button>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteApplication(app.id)}
                    className="text-red-400 hover:text-red-500 font-mono text-xs uppercase hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
