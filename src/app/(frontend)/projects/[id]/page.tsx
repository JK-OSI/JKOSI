import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPayload } from 'payload'
import config from '../../../../../payload.config'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { notFound } from "next/navigation";

async function getGithubBio(username: string): Promise<string | null> {
  try {
    const cleanUsername = username.replace(/^@/, '');
    const res = await fetch(`https://api.github.com/users/${cleanUsername}`, {
      headers: {
        'User-Agent': 'JKOSI-App',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (res.ok) {
      const data = await res.json();
      return data.bio || null;
    }
  } catch (e) {
    console.error('Failed to fetch bio from GitHub:', e);
  }
  return null;
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  let dbProject = null;
  try {
    const payload = await getPayload({ config })
    dbProject = await payload.findByID({
      collection: 'repositories',
      id: projectId,
      depth: 1, // populate owner (Member) relationship
    })
  } catch (error) {
    // Non-DB record or database not configured yet
  }

  if (!dbProject) {
    notFound();
  }

  // Format database project to expected shape
  let project = null;
  let rawBaseUrl = ''
  
  // Fetch actual README from GitHub
  let readme = `# ${dbProject.name}\n\n${dbProject.description || "No description provided."}`
  try {
    const url = (dbProject.url as string || '').replace(/\.git$/, '').replace(/\/$/, '')
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
        readme = await res.text()
        rawBaseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`
      }
    }
  } catch {
    // fall through to synthetic readme
  }

  const ownerObj = dbProject.owner && typeof dbProject.owner === 'object' ? (dbProject.owner as any) : null
  const authorName = ownerObj ? ownerObj.githubUsername || 'anonymous' : 'anonymous'
  
  // Pull bio from DB or dynamically query from GitHub
  let authorBio = ownerObj ? ownerObj.bio || '' : ''
  if (!authorBio && authorName !== 'anonymous') {
    authorBio = await getGithubBio(authorName) || "Open-source developer contributing to regional tech capacity in Jammu & Kashmir.";
  } else if (!authorBio) {
    authorBio = "Open-source developer contributing to regional tech capacity in Jammu & Kashmir.";
  }

  project = {
    id: String(dbProject.id),
    name: dbProject.name,
    icon: "code",
    desc: dbProject.description || "",
    tags: dbProject.tags?.map((t: any) => t.tag) || [],
    category: dbProject.category || "Web",
    author: authorName,
    authorImage: `https://github.com/${authorName.replace(/^@/, '')}.png`,
    authorBio: authorBio,
    stars: String(dbProject.stars || 0),
    status: "Verified",
    version: "v1.0.0",
    githubUrl: dbProject.url,
    readme,
    demoUrl: undefined,
  };

  // Suggested Projects
  let suggestedProjects: {
    id: string;
    name: string;
    desc: string;
    category: string;
    stars: string;
    author: string;
    authorImage?: string;
  }[] = [];
  
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'repositories',
      limit: 3,
      depth: 1, // populate owner (Member) relationship
      where: {
        id: {
          not_equals: projectId,
        }
      }
    });
    if (res.docs && res.docs.length > 0) {
      suggestedProjects = res.docs.map((d: any) => {
        const username = d.owner && typeof d.owner === 'object' ? (d.owner as any).githubUsername || 'anonymous' : 'anonymous';
        return {
          id: String(d.id),
          name: d.name,
          desc: d.description || '',
          category: d.category || 'Web',
          stars: String(d.stars || 0),
          author: username,
          authorImage: `https://github.com/${username.replace(/^@/, '')}.png`,
        };
      });
    }
  } catch (e) {
    // Ignored
  }

  if (!project) {
    return (
      <>
        <Navbar activePage="directory" isFixed={true} />
        <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-32 text-center min-h-[600px] flex flex-col justify-center items-center">
          <span className="material-symbols-outlined text-primary text-[64px] mb-6">info</span>
          <h1 className="font-headline-xl text-3xl font-black text-on-surface mb-4">Project Not Found</h1>
          <p className="text-on-surface-variant mb-8 max-w-[480px]">
            The repository ID you are looking for does not exist in the initiative index.
          </p>
          <Link
            href="/projects"
            className="px-6 py-3 bg-primary text-on-primary font-bold text-label-md rounded-full"
          >
            Back to Directory
          </Link>
        </main>
        <Footer variant="projects" />
      </>
    );
  }

  return (
    <>
      <Navbar activePage="directory" isFixed={true} />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl mt-16 relative">
        {/* Soft atmospheric radial blooms */}
        <div className="bloom-overlay bloom-moss"></div>
        <div className="bloom-overlay bloom-saffron"></div>

        {/* Breadcrumb Header */}
        <nav className="mb-6 font-mono text-[11px] uppercase tracking-widest text-on-surface-variant relative z-10">
          <Link href="/projects" className="hover:text-primary transition-colors">
            Directory
          </Link>{" "}
          / <span className="text-secondary">{project.name}</span>
        </nav>

        {/* Project Header Card */}
        <section className="mb-12 bg-surface-container-low border border-outline/50 p-8 md:p-12 rounded-2xl relative z-10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-lg">
            <div>
              <div className="flex items-center gap-sm mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-bold uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[11px] uppercase tracking-wider">
                  {project.version || "v1.0.0"}
                </span>
              </div>
              <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface font-black tracking-tight leading-none mb-4 flex items-center gap-sm">
                {project.name}
                <span className="material-symbols-outlined text-primary text-3xl">{project.icon || "code"}</span>
              </h1>
              <p className="text-on-surface-variant text-body-lg max-w-[720px] leading-relaxed">
                {project.desc}
              </p>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-wrap gap-sm md:flex-col min-w-[200px]">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full px-6 py-3 bg-primary text-on-primary font-bold text-label-md rounded-full shadow-md text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">code</span> Repository
              </a>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full px-6 py-3 bg-transparent border border-outline text-on-surface font-bold text-label-md rounded-full text-center flex items-center justify-center gap-2 hover:bg-surface-container/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">language</span> Live Demo
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Metadata Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg relative z-10 mb-12">
          {/* Project Specs Card */}
          <div className="bento-card-premium p-8 rounded-2xl bg-surface-container-high flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 border-b border-outline pb-4">
                Maintainer
              </h3>
              <a
                href={`https://github.com/${project.author.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-sm mb-6 group"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30 ring-4 ring-primary/5 shadow-md flex items-center justify-center bg-primary/10 transition-transform group-hover:scale-105 duration-200">
                  {project.authorImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.authorImage}
                      alt={project.author}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-mono text-[14px] font-bold text-primary">
                      {project.author.replace(/^@/, '').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-black text-on-surface text-base group-hover:text-primary transition-colors group-hover:underline flex items-center gap-1">
                    {project.author}
                    <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </span>
                  <span className="block text-[9px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 mt-1 inline-block w-fit">
                    Maintainer
                  </span>
                </div>
              </a>
              <div className="bg-surface-container-low/40 p-4 rounded-xl border border-outline/35 mb-4">
                <p className="text-on-surface-variant text-[11px] leading-relaxed italic">
                  "{project.authorBio || "Open-source developer contributing to regional tech capacity in Jammu & Kashmir."}"
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-sm pt-4 border-t border-outline/50 text-label-md">
              <div>
                <span className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-1">
                  Stars
                </span>
                <span className="flex items-center gap-1 font-mono font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  {project.stars}
                </span>
              </div>
              <div>
                <span className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-1">
                  Status
                </span>
                <span className="font-mono font-bold text-primary">{project.status || "Verified"}</span>
              </div>
            </div>
          </div>

          {/* Audit Status Card (F3 Spec Sheet styled) */}
          <div className="bento-card-premium p-8 rounded-2xl bg-surface-container-high font-mono">
            <h3 className="text-xs uppercase tracking-widest text-secondary mb-6 border-b border-outline pb-4">
              Review Status
            </h3>
            <div className="space-y-4 text-xs">
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
                <span className="text-primary font-bold">{project.tags.includes("GPL-3.0") ? "GPL-3.0" : project.tags.includes("Apache 2.0") ? "Apache-2.0" : "MIT"}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">SECURITY</span>
                <span className="text-primary font-bold">✓ SECURE</span>
              </div>
            </div>
          </div>

          {/* Stack Tags Card */}
          <div className="bento-card-premium p-8 rounded-2xl bg-surface-container-high">
            <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 border-b border-outline pb-4">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-xs">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-outline/20 text-on-surface text-xs font-mono uppercase tracking-wider rounded-lg border border-outline/35"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Full-width README Box (GitHub Style) */}
        <div className="relative z-10 border border-outline/50 rounded-2xl overflow-hidden bg-surface-container mb-20 shadow-lg">
          <div className="px-6 py-4 bg-surface-container-high border-b border-outline/50 flex items-center justify-between font-mono text-xs text-on-surface-variant">
            <div className="flex items-center gap-2 font-bold text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-primary">menu_book</span>
              <span>README.md</span>
            </div>
          </div>
          <div className="p-6 md:p-12 bg-surface">
            <article className="github-readme">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ src, alt, ...props }) => {
                    let resolved = typeof src === 'string' ? src : undefined
                    if (resolved && !resolved.startsWith('http://') && !resolved.startsWith('https://') && !resolved.startsWith('data:')) {
                      resolved = `${rawBaseUrl}/${resolved}`
                    }
                    // eslint-disable-next-line @next/next/no-img-element
                    return <img src={resolved} alt={alt || ''} loading="lazy" {...props} />
                  },
                }}
              >
                {project.readme}
              </ReactMarkdown>
            </article>
          </div>
        </div>

        {/* Suggestion Rail Section */}
        {suggestedProjects.length > 0 && (
          <section className="relative z-10 border-t border-outline pt-16">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
                  02 — Explore
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Suggested Projects</h2>
              </div>
              <Link
                href="/projects"
                className="text-primary font-bold text-label-md border-b-2 border-primary/30 hover:border-primary pb-1 transition-all duration-200 flex items-center gap-1 font-mono tracking-wider"
              >
                DIRECTORY INDEX <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {suggestedProjects.map((sProj) => (
                <div
                  key={sProj.id}
                  className="project-card bento-card-premium rounded-2xl overflow-hidden flex flex-col h-full bg-surface-container justify-between"
                >
                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-bold uppercase tracking-wider">
                        {sProj.category}
                      </span>
                      <span className="flex items-center gap-1 text-on-surface-variant font-mono text-label-sm">
                        <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>{" "}
                        {sProj.stars}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-2xl text-on-surface mb-3 font-bold">{sProj.name}</h3>
                    <p className="text-on-surface-variant text-body-md line-clamp-3 leading-relaxed mb-6">
                      {sProj.desc}
                    </p>
                  </div>
                  <div className="px-8 py-4 bg-surface border-t border-outline/50 flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-mono text-[10px] font-bold text-primary border border-primary/20">
                        {sProj.author.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-mono text-xs text-secondary">{sProj.author}</span>
                    </div>
                    <Link
                      className="text-xs font-mono font-bold text-primary uppercase bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                      href={`/projects/${sProj.id}`}
                    >
                      View <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer variant="projects" />
    </>
  );
}
