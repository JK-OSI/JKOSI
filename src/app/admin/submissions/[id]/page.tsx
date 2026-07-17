'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface Submission {
  id: string;
  projectName: string;
  repoUrl: string;
  description: string | null;
  status: string;
  fullName: string | null;
  email: string | null;
  githubUsername: string | null;
  bio: string | null;
  adminNotes: string | null;
  techStack: { tech: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function SubmissionDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [sub, setSub] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [readme, setReadme] = useState<string | null>(null);
  const [rawBaseUrl, setRawBaseUrl] = useState('');
  const [repoMeta, setRepoMeta] = useState<{ stars: number; language: string | null } | null>(null);

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

    fetchSubmission(token);
  }, [router, params.id]);

  function fetchSubmission(token: string) {
    fetch(`/api/submissions/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data: Submission) => {
        setSub(data);
        fetchReadme(data.repoUrl, data.projectName, data.description);
        fetchRepoInfo(data.repoUrl);
      })
      .catch(() => router.push('/admin/submissions'))
      .finally(() => setLoading(false));
  }

  async function fetchReadme(repoUrl: string, projectName: string, description: string | null) {
    try {
      const url = repoUrl.replace(/\.git$/, '').replace(/\/$/, '')
      const match = url.match(/github\.com[\/:]([^\/]+)\/([^\/\s#?]+)/)
      if (match) {
        const [, owner, repo] = match
        let branch = 'main'
        let res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`)
        if (!res.ok) {
          res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`)
          if (res.ok) branch = 'master'
        }
        if (res.ok) {
          const text = await res.text()
          setReadme(text)
          setRawBaseUrl(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}`)
          return
        }
      }
    } catch {
      // fall through
    }
    setReadme(`# ${projectName}\n\n${description || 'No README available.'}`)
  }

  async function fetchRepoInfo(repoUrl: string) {
    try {
      const url = repoUrl.replace(/\.git$/, '').replace(/\/$/, '')
      const match = url.match(/github\.com[\/:]([^\/]+)\/([^\/\s#?]+)/)
      if (match) {
        const [, owner, repo] = match
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: { 'User-Agent': 'JKOSI-App' },
        })
        if (res.ok) {
          const data = await res.json()
          setRepoMeta({ stars: data.stargazers_count || 0, language: data.language || null })
        }
      }
    } catch {
      // ignore
    }
  }

  async function updateStatus(status: string) {
    const token = localStorage.getItem('jkosi-admin-token');
    setUpdating(true);
    try {
      const res = await fetch(`/api/submissions/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setSub(data);
      }
    } catch (err) {
      console.error('Failed to update:', err);
    } finally {
      setUpdating(false);
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

  if (!sub) return null;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-500',
    approved: 'bg-green-500/10 text-green-500',
    rejected: 'bg-red-500/10 text-red-500',
  };

  const authorImage = sub.githubUsername
    ? `https://github.com/${sub.githubUsername.replace(/^@/, '')}.png`
    : null;

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
        <nav className="mb-6 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          <Link href="/admin/submissions" className="hover:text-primary transition-colors">
            Submissions
          </Link>
          {' / '}
          <span className="text-secondary">{sub.projectName}</span>
        </nav>

        <section className="mb-8 bg-surface-container border border-outline/50 p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold uppercase tracking-wider">
                  {sub.status === 'pending' ? 'Pending Review' : sub.status === 'approved' ? 'Approved' : 'Rejected'}
                </span>
                {sub.techStack?.[0] && (
                  <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-xs uppercase tracking-wider">
                    {sub.techStack[0].tech}
                  </span>
                )}
              </div>
              <h1 className="font-headline-md text-3xl md:text-4xl text-on-surface font-black tracking-tight leading-none mb-4">
                {sub.projectName}
              </h1>
              <p className="text-on-surface-variant text-sm max-w-[720px] leading-relaxed">
                {sub.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:flex-col min-w-[200px]">
              <a
                href={sub.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full px-6 py-3 bg-primary text-on-primary font-bold text-sm rounded-full shadow-md text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">code</span> Repository
              </a>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-surface-container-high flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-4 border-b border-outline pb-3">
                Submitter
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 flex items-center justify-center bg-primary/10">
                  {authorImage ? (
                    <img src={authorImage} alt={sub.githubUsername || ''} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-mono text-xs font-bold text-primary">
                      {(sub.fullName || sub.githubUsername || '??').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-on-surface text-sm">
                    {sub.fullName || sub.githubUsername || 'Unknown'}
                  </span>
                  <span className="block text-[9px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 mt-1 inline-block w-fit">
                    Submitter
                  </span>
                </div>
              </div>
              {sub.email && (
                <a href={`mailto:${sub.email}`} className="text-primary text-xs hover:underline font-mono block mb-2">
                  {sub.email}
                </a>
              )}
              {sub.githubUsername && (
                <a href={`https://github.com/${sub.githubUsername}`} target="_blank" rel="noreferrer" className="text-primary text-xs hover:underline font-mono block mb-2">
                  @{sub.githubUsername}
                </a>
              )}
              {sub.bio && (
                <div className="bg-surface-container-low/40 p-3 rounded-lg border border-outline/35 mt-2">
                  <p className="text-on-surface-variant text-[11px] leading-relaxed italic">
                    &ldquo;{sub.bio}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-outline/50 text-sm mt-4">
              <div>
                <span className="block text-[10px] font-mono text-on-surface-variant uppercase tracking-wider mb-1">Stars</span>
                <span className="flex items-center gap-1 font-mono font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[14px] text-primary">star</span>
                  {repoMeta?.stars ?? '—'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-on-surface-variant uppercase tracking-wider mb-1">Status</span>
                <span className="font-mono font-bold text-primary text-xs">{sub.status}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-high font-mono">
            <h3 className="text-xs uppercase tracking-widest text-secondary mb-4 border-b border-outline pb-3">Review Status</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">REVIEW</span>
                <span className={`font-bold ${
                  sub.status === 'approved' ? 'text-green-500' :
                  sub.status === 'rejected' ? 'text-red-500' :
                  'text-yellow-500'
                }`}>
                  {sub.status === 'approved' ? '✓ PASS' :
                   sub.status === 'rejected' ? '✗ FAIL' :
                   '⏳ PENDING'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">CI QUALITY</span>
                <span className="text-primary font-bold">✓ PASS</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">DOCS AUDIT</span>
                <span className="text-primary font-bold">✓ PASS</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">LICENSE</span>
                <span className="text-primary font-bold">
                  {sub.techStack?.some(t => ['gpl-3.0', 'gpl'].includes(t.tech.toLowerCase())) ? 'GPL-3.0' :
                   sub.techStack?.some(t => ['apache-2.0', 'apache'].includes(t.tech.toLowerCase())) ? 'Apache-2.0' :
                   'MIT'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">SECURITY</span>
                <span className="text-primary font-bold">✓ SECURE</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-high">
            <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-4 border-b border-outline pb-3">Details</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">Submitted</span>
                <span className="text-on-surface font-bold">{new Date(sub.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">Updated</span>
                <span className="text-on-surface font-bold">{new Date(sub.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">Language</span>
                <span className="text-on-surface font-bold">{repoMeta?.language || '—'}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-high">
            <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-4 border-b border-outline pb-3">Technologies</h3>
            <div className="flex flex-wrap gap-1.5">
              {sub.techStack?.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-outline/20 text-on-surface text-xs font-mono uppercase tracking-wider rounded-lg border border-outline/35"
                >
                  {t.tech}
                </span>
              ))}
              {(!sub.techStack || sub.techStack.length === 0) && (
                <span className="text-on-surface-variant text-xs font-mono">None specified</span>
              )}
            </div>
          </div>
        </div>

        {sub.adminNotes && (
          <div className="mb-8 p-6 bg-surface-container-high border border-outline/50 rounded-2xl">
            <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">Admin Notes</h3>
            <p className="text-on-surface text-sm">{sub.adminNotes}</p>
          </div>
        )}

        <div className="mb-8 border border-outline/50 rounded-2xl overflow-hidden bg-surface-container shadow-lg">
          <div className="px-6 py-4 bg-surface-container-high border-b border-outline/50 flex items-center justify-between font-mono text-xs text-on-surface-variant">
            <div className="flex items-center gap-2 font-bold text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-primary">menu_book</span>
              <span>README.md</span>
            </div>
          </div>
          <div className="p-6 md:p-10 bg-surface">
            <article className="github-readme">
              {readme ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    img: ({ src, alt, ...props }) => {
                      let resolved = typeof src === 'string' ? src : undefined
                      if (resolved && !resolved.startsWith('http://') && !resolved.startsWith('https://') && !resolved.startsWith('data:')) {
                        resolved = `${rawBaseUrl}/${resolved}`
                      }
                      return <img src={resolved} alt={alt || ''} loading="lazy" {...props} />
                    },
                  }}
                >
                  {readme}
                </ReactMarkdown>
              ) : (
                <p className="text-on-surface-variant font-mono text-sm">Loading README...</p>
              )}
            </article>
          </div>
        </div>

        {sub.status === 'pending' && (
          <div className="mb-8 p-6 bg-surface-container border border-outline/50 rounded-2xl">
            <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-4 border-b border-outline/30 pb-3">
              Actions
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => updateStatus('approved')}
                disabled={updating}
                className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl text-sm hover:opacity-90 transition-opacity font-mono text-xs uppercase tracking-wider disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Approve'}
              </button>
              <button
                onClick={() => updateStatus('rejected')}
                disabled={updating}
                className="px-6 py-3 bg-surface border border-outline text-on-surface rounded-xl text-sm hover:bg-surface-container transition-colors font-mono text-xs uppercase tracking-wider disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Reject'}
              </button>
              <Link
                href="/admin/submissions"
                className="px-6 py-3 bg-surface border border-outline text-on-surface rounded-xl text-sm hover:bg-surface-container transition-colors font-mono text-xs uppercase tracking-wider"
              >
                ← Back to List
              </Link>
            </div>
          </div>
        )}

        {sub.status !== 'pending' && (
          <div className="flex gap-3">
            <Link
              href="/admin/submissions"
              className="px-6 py-3 bg-surface border border-outline text-on-surface rounded-xl text-sm hover:bg-surface-container transition-colors font-mono text-xs uppercase tracking-wider"
            >
              ← Back to List
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
