"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";

export interface Project {
  id: string;
  name: string;
  desc: string;
  repo: string;
  category: string;
  author: string;
  stars: number;
  commits: number;
  tags: string[];
  authorImage?: string;
}

interface ProjectsClientProps {
  initialProjects: Project[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState("All Projects");

  // Sync state if URL search query changes
  useEffect(() => {
    const search = searchParams.get("search");
    if (search !== null) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const categories = ["All Projects", "Web", "Mobile", "AI/ML", "IoT", "Blockchain"];

  // Filter projects by both search query and category
  const filteredProjects = initialProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeFilter === "All Projects" ||
      project.category.trim().toLowerCase() === activeFilter.trim().toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar activePage="directory" isFixed={true} />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl mt-16 relative min-h-[800px]">
        {/* Soft atmospheric blooms */}
        <div className="bloom-overlay bloom-moss"></div>
        <div className="bloom-overlay bloom-saffron"></div>

        {/* Hero/Header Section */}
        <section className="mb-16 text-center md:text-left relative z-10">
          <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
            01 — Registries
          </span>
          <h1 className="font-headline-xl text-4xl md:text-6xl text-on-surface font-black tracking-tight leading-none text-glow">
            Project Directory
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-[620px] mt-4 text-lg">
            Explore and collaborate on open-source projects designed to solve regional challenges and scale high-altitude utilities.
          </p>
        </section>

        {/* Search & Filter Controls */}
        <section className="mb-12 relative z-10 flex flex-col md:flex-row gap-lg justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-grow max-w-[576px]">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
              search
            </span>
            <input
              type="text"
              placeholder="Search by repository name, tech stack, or author..."
              className="w-full pl-12 pr-6 py-3.5 bg-surface-container border border-outline/40 hover:border-primary/50 focus:border-primary rounded-xl font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Chips Container */}
          <div className="flex flex-wrap gap-xs items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-lg font-label-md text-xs uppercase tracking-wider transition-all border ${
                  activeFilter === cat
                    ? "bg-primary text-on-primary border-primary shadow"
                    : "bg-surface-container-low text-on-surface-variant border-outline/30 hover:border-outline/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Project Cards Grid */}
        <section className="relative z-10 mb-24">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card bento-card-premium rounded-2xl overflow-hidden flex flex-col h-full bg-surface-container justify-between"
                >
                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="flex items-center gap-1 text-on-surface-variant font-mono text-label-sm">
                        <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>{" "}
                        {project.stars}
                      </span>
                    </div>

                    <h3 className="font-headline-md text-2xl text-on-surface mb-3 font-bold">{project.name}</h3>
                    <p className="text-on-surface-variant text-body-md line-clamp-3 leading-relaxed mb-6">
                      {project.desc}
                    </p>

                    <div className="flex flex-wrap gap-xs">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-surface-container-high border border-outline/30 text-on-surface-variant font-mono text-[9px] uppercase tracking-wider rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-surface-container-high border border-outline/30 text-on-surface-variant font-mono text-[9px] uppercase tracking-wider rounded-md">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-8 py-4 bg-surface border-t border-outline/50 flex items-center justify-between">
                    <a
                      href={`https://github.com/${project.author.replace(/^@/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-sm group"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-outline/35 flex items-center justify-center bg-primary/10">
                        {project.authorImage ? (
                          <img
                            src={project.authorImage}
                            alt={project.author}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-mono text-[10px] font-bold text-primary">
                            {project.author.replace(/^@/, '').slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-secondary group-hover:text-primary transition-colors decoration-primary group-hover:underline">
                        {project.author}
                      </span>
                    </a>

                    <Link
                      className="text-xs font-mono font-bold text-primary uppercase bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                      href={`/projects/${project.id}`}
                    >
                      Inspect <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface-container border border-outline/45 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-[48px] mb-4">search_off</span>
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">No Projects Match</h3>
              <p className="text-on-surface-variant text-body-md max-w-[480px] mx-auto px-4">
                No repositories match your active category or search string. Try searching for other technologies or clearing filters.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer variant="projects" />
    </>
  );
}
